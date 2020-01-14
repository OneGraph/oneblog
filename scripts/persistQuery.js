const https = require('https');
const GraphQLLanguage = require('graphql/language');
const {parse, print} = require('graphql');

require('dotenv').config();

if (
  !process.env['REPOSITORY_FIXED_VARIABLES'] &&
  process.env['RAZZLE_GITHUB_REPO_OWNER'] &&
  process.env['RAZZLE_GITHUB_REPO_NAME']
) {
  process.env['REPOSITORY_FIXED_VARIABLES'] = `{"repoName": "${
    process.env['RAZZLE_GITHUB_REPO_NAME']
  }", "repoOwner": "${process.env['RAZZLE_GITHUB_REPO_OWNER']}"}`;
}

const PERSIST_QUERY_MUTATION = `
  mutation PersistQuery(
    $freeVariables: [String!]!
    $appId: String!
    $accessToken: String
    $query: String!
    $fixedVariables: JSON
  ) {
    oneGraph {
      createPersistedQuery(
        input: {
          query: $query
          accessToken: $accessToken
          appId: $appId
          cacheStrategy: { timeToLiveSeconds: 300 }
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

  const variables = {
    query: print(transformedAst),
    // This is your app's app id, edit `/.env` to change it
    appId: process.env.RAZZLE_ONEGRAPH_APP_ID,
    accessToken: accessToken || null,
    freeVariables: [...freeVariables],
    fixedVariables: fixedVariables,
  };

  const body = JSON.stringify({
    query: PERSIST_QUERY_MUTATION,
    variables,
  });
  return new Promise((resolve, reject) => {
    let data = '';
    const req = https.request(
      {
        hostname: 'serve.onegraph.com',
        port: 443,
        // This is onedash's app id. If you followed the instructions in the
        // README to create the `OG_DASHBOARD_ACCESS_TOKEN`, then this is the
        // app id associated with the token that lets you persist queries.
        // Don't change this to your app id.
        path: '/graphql?app_id=0b066ba6-ed39-4db8-a497-ba0be34d5b2a',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': body.length,
          Authorization: 'Bearer ' + process.env.OG_DASHBOARD_ACCESS_TOKEN,
        },
      },
      res => {
        res.on('data', chunk => {
          data += chunk;
        });
        res.on('end', () => {
          const resp = JSON.parse(data);
          if (resp.errors) {
            throw new Error(
              'Error persisting query, errors=' + JSON.stringify(resp.errors),
            );
          } else {
            resolve(resp.data.oneGraph.createPersistedQuery.persistedQuery.id);
          }
        });
      },
    );
    req.write(body);
    req.end();
  });
}

exports.default = persistQuery;
