const https = require('https');
const GraphQLLanguage = require('graphql/language');
const {parse, print} = require('graphql');

require('dotenv').config();

if (
  (!process.env.REPOSITORY_FIXED_VARIABLES &&
    // Backwards compat with older apps that started with razzle
    (process.env.RAZZLE_GITHUB_REPO_OWNER &&
      process.env.RAZZLE_GITHUB_REPO_NAME)) ||
  (process.env.NEXT_PUBLIC_GITHUB_REPO_OWNER &&
    process.env.NEXT_PUBLIC_GITHUB_REPO_NAME) ||
  (process.env.VERCEL_GITHUB_ORG && process.env.VERCEL_GITHUB_REPO)
) {
  const repoName =
    process.env['RAZZLE_GITHUB_REPO_NAME'] ||
    process.env['NEXT_PUBLIC_GITHUB_REPO_NAME'] ||
    process.env['VERCEL_GITHUB_REPO'];
  const repoOwner =
    process.env['RAZZLE_GITHUB_REPO_OWNER'] ||
    process.env['NEXT_PUBLIC_GITHUB_REPO_OWNER'] ||
    process.env['VERCEL_GITHUB_ORG'];
  process.env[
    'REPOSITORY_FIXED_VARIABLES'
  ] = `{"repoName": "${repoName}", "repoOwner": "${repoOwner}"}`;
}

const PERSIST_QUERY_MUTATION = `
  mutation PersistQuery(
    $freeVariables: [String!]!
    $appId: String!
    $accessToken: String
    $query: String!
    $fixedVariables: JSON
    $cacheStrategy: OneGraphPersistedQueryCacheStrategyArg
  ) {
    oneGraph {
      createPersistedQuery(
        input: {
          query: $query
          accessToken: $accessToken
          appId: $appId
          cacheStrategy: $cacheStrategy
          freeVariables: $freeVariables
          fixedVariables: $fixedVariables
        }
      ) {
        persistedQuery {
          id
        }
      }
    }
  }
`;

async function persistQuery(queryText) {
  const ast = parse(queryText, {noLocation: true});

  const freeVariables = new Set([]);
  let accessToken = null;
  let fixedVariables = null;
  let cacheSeconds = null;
  let transformedAst = GraphQLLanguage.visit(ast, {
    OperationDefinition: {
      enter(node) {
        for (const directive of node.directives) {
          if (directive.name.value === 'persistedQueryConfiguration') {
            const accessTokenArg = directive.arguments.find(
              a => a.name.value === 'accessToken',
            );
            const fixedVariablesArg = directive.arguments.find(
              a => a.name.value === 'fixedVariables',
            );
            const freeVariablesArg = directive.arguments.find(
              a => a.name.value === 'freeVariables',
            );

            const cacheSecondsArg = directive.arguments.find(
              a => a.name.value === 'cacheSeconds',
            );

            if (accessTokenArg) {
              const envArg = accessTokenArg.value.fields.find(
                f => f.name.value === 'environmentVariable',
              );
              if (envArg) {
                if (accessToken) {
                  throw new Error(
                    'Access token is already defined for operation=' +
                      node.name.value,
                  );
                }
                const envVar = envArg.value.value;
                accessToken = process.env[envVar];
                if (!accessToken) {
                  throw new Error(
                    'Cannot persist query. Missing environment variable `' +
                      envVar +
                      '`.',
                  );
                }
              }
            }

            if (fixedVariablesArg) {
              const envArg = fixedVariablesArg.value.fields.find(
                f => f.name.value === 'environmentVariable',
              );
              if (envArg) {
                if (fixedVariables) {
                  throw new Error(
                    'fixedVariables are already defined for operation=' +
                      node.name.value,
                  );
                }
                const envVar = envArg.value.value;
                fixedVariables = JSON.parse(process.env[envVar]);
                if (!fixedVariables) {
                  throw new Error(
                    'Cannot persist query. Missing environment variable `' +
                      envVar +
                      '`.',
                  );
                }
              }
            }

            if (freeVariablesArg) {
              for (const v of freeVariablesArg.value.values) {
                freeVariables.add(v.value);
              }
            }

            if (cacheSecondsArg) {
              cacheSeconds = parseFloat(cacheSecondsArg.value.value);
            }
          }
        }
        return {
          ...node,
          directives: node.directives.filter(
            d => d.name.value !== 'persistedQueryConfiguration',
          ),
        };
      },
    },
  });

  const appId =
    process.env.NEXT_PUBLIC_ONEGRAPH_APP_ID ||
    // Backwards compat with older apps that started with razzle
    process.env.RAZZLE_ONEGRAPH_APP_ID;

  const variables = {
    query: print(transformedAst),
    // This is your app's app id, edit `/.env` to change it
    appId,
    accessToken: accessToken || null,
    freeVariables: [...freeVariables],
    fixedVariables: fixedVariables,
    cacheStrategy: cacheSeconds
      ? {
          timeToLiveSeconds: cacheSeconds,
        }
      : null,
  };

  const body = JSON.stringify({
    query: PERSIST_QUERY_MUTATION,
    variables,
  });

  function persist(appId) {
    return new Promise((resolve, reject) => {
      let data = '';
      const req = https.request(
        {
          hostname: 'serve.onegraph.com',
          port: 443,
          path: `/graphql?app_id=${appId}`,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': body.length,
            Authorization: 'Bearer ' + process.env.OG_DASHBOARD_ACCESS_TOKEN,
          },
        },
        (res) => {
          res.on('data', (chunk) => {
            data += chunk;
          });
          res.on('end', () => {
            const resp = JSON.parse(data);
            if (resp.errors) {
              reject(
                new Error(
                  'Error persisting query, errors=' +
                    JSON.stringify(resp.errors),
                ),
              );
            } else {
              resolve(
                resp.data.oneGraph.createPersistedQuery.persistedQuery.id,
              );
            }
          });
        },
      );
      req.write(body);
      req.end();
    });
  }
  return persist(appId).catch(() =>
    // This is the app id for the OneGraph dashboard. Some older persist query tokens will require
    // you to use this id. If persisting with the oneblog app id fails, then try with the dashboard id.
    persist('0b066ba6-ed39-4db8-a497-ba0be34d5b2a'),
  );
}

exports.default = persistQuery;
