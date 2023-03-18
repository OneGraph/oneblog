const https = require('https');
const GraphQLLanguage = require('graphql/language');
const {parse, print} = require('graphql');
const fs = require('fs');
const prettier = require('prettier');

require('dotenv').config();

if (
  (!process.env.REPOSITORY_FIXED_VARIABLES &&
    // Backwards compat with older apps that started with razzle
    process.env.RAZZLE_GITHUB_REPO_OWNER &&
    process.env.RAZZLE_GITHUB_REPO_NAME) ||
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

async function persistQuery(queryText) {
  const ast = parse(queryText, {noLocation: true});

  const freeVariables = new Set([]);
  let fixedVariables = null;
  let cacheSeconds = null;
  let operationName = null;
  let transformedAst = GraphQLLanguage.visit(ast, {
    OperationDefinition: {
      enter(node) {
        operationName = node.name.value;
        operationType = node.operation;
        for (const directive of node.directives) {
          if (directive.name.value === 'persistedQueryConfiguration') {
            const fixedVariablesArg = directive.arguments.find(
              (a) => a.name.value === 'fixedVariables',
            );
            const freeVariablesArg = directive.arguments.find(
              (a) => a.name.value === 'freeVariables',
            );

            const cacheSecondsArg = directive.arguments.find(
              (a) => a.name.value === 'cacheSeconds',
            );

            if (fixedVariablesArg) {
              const envArg = fixedVariablesArg.value.fields.find(
                (f) => f.name.value === 'environmentVariable',
              );
              if (envArg) {
                if (fixedVariables) {
                  throw new Error(
                    'fixedVariables are already defined for operation=' +
                      node.name.value,
                  );
                }
                const envVar = envArg.value.value;
                try {
                  fixedVariables = JSON.parse(process.env[envVar]);
                } catch (e) {
                  console.error(e);
                }
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
            (d) => d.name.value !== 'persistedQueryConfiguration',
          ),
        };
      },
    },
  });

  const apiHandler =
    operationType === 'query'
      ? `
    import fetch from 'node-fetch';
    const query = \`${print(transformedAst)}\`;
    const token = process.env.GITHUB_TOKEN;
    const fixedVariables = ${JSON.stringify(fixedVariables || {}, null, 2)};
    const freeVariables = new Set(${JSON.stringify([...freeVariables])});

    function logRateLimit(resp) {
      const reset = new Date(
        parseInt(resp.headers.get('x-ratelimit-reset')) * 1000,
      );
      console.log(
        'GitHub request for ${operationName}, rate limit: %s/%s resets at %s',
        resp.headers.get('x-ratelimit-remaining'),
        resp.headers.get('x-ratelimit-limit'),
        reset,
      );
    }

    export const fetchQuery = async (requestVariables) => {
      const variables = {...fixedVariables};
      if (freeVariables.size > 0 && requestVariables) {
        for (const v of freeVariables) {
          variables[v] = requestVariables[v];
        }
      }

      const resp = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: \`Bearer \${token}\`,
          'User-Agent': 'oneblog',
        },
        body: JSON.stringify({query, variables})
      });
      logRateLimit(resp);
      const json = await resp.json();
      return json;
    };

    const ${operationName} = async (req, res) => {
      const json = await fetchQuery(req.query.variables ? JSON.parse(req.query.variables) : null);
      res.setHeader('Content-Type', 'application/json');
      if (${cacheSeconds}) {
        res.setHeader(
          'Cache-Control',
          'public, s-maxage=${cacheSeconds}, stale-while-revalidate=${cacheSeconds}'
        );
      }
      res.status(200).send(json);
    }
    export default ${operationName};`
      : `
    const ${operationName} = async (req, res) => {
      const json = {"errors": [{"message": "Mutations are not yet supported"}]};
      res.setHeader('Content-Type', 'application/json');
      res.status(200).send(json);
    }
    export default ${operationName};
`;

  fs.mkdirSync('./src/pages/api/__generated__/', {recursive: true});

  const filename = `./src/pages/api/__generated__/${operationName}.js`;

  fs.writeFileSync(filename, prettier.format(apiHandler, {filepath: filename}));

  return operationName;
}

exports.default = persistQuery;
