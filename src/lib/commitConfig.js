// @flow

// Uses a persisted query to set the custom config for a subdomain

import {onegraphAuth} from '../Environment';

import config from '../config';

import type {Config} from '../config';

const IS_DEV = process.env.NODE_ENV === 'development';

const docId = IS_DEV
  ? 'e0264980-6609-42c6-a96f-52f262df587b'
  : '34c57950-23db-465c-aa44-043c4545d18b';

export async function commitConfig(configShape: $Shape<Config>): {url: string} {
  const res = await fetch(
    'https://serve.onegraph.com/graphql?app_id=' + config.appId,
    {
      method: 'POST',
      body: JSON.stringify({
        doc_id: docId,
        operationName: 'SetConfigOverrideChain',
        variables: {
          config: configShape,
        },
      }),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...onegraphAuth.authHeaders(),
      },
    },
  );
  const json = await res.json();

  const results = json.data?.oneGraph?.executeChain?.results || [];

  const updateFileMutationResult = results.find(
    (r) => r.request.id === 'UpdateFileMutation',
  );

  return updateFileMutationResult?.result?.[0]?.data?.gitHub
    ?.createOrUpdateFileContent_oneGraph?.commit;
}

// Document
/*

query WhoAmIQuery {
  gitHub {
    viewer {
      name
      login
    }
  }
}

query Identity($newConfig: JSON!) {
  oneGraph {
    identity(input: $newConfig)
  }
}

query CurrentOid($expression: String!) {
  gitHub {
    repository(name: "oneblog", owner: "onegraph") {
      object(expression: $expression) {
        oid
      }
    }
  }
}

mutation SetConfigOverrideChain($config: JSON!, $gitHubToken: JSON!) {
  oneGraph {
    executeChain(input: {
      script: "function viewerLogin(result) {\n  return result.WhoAmIQuery.data.gitHub.viewer.login;\n}\n\nconst branch = 'essay.dev';\n\nexport function getExpression(result) {\n  return `${branch}:src/config-overrides/${viewerLogin(result)}.json`;\n}\n\nconst ALLOWED_CONFIG_KEYS = [\n  'title',\n  'description',\n  'hideAttribution',\n  'gaTrackingId',\n  'codeTheme',\n];\n\nconst CONFIG_KEY_TYPE = {\n  title: 'string',\n  description: 'string',\n  hideAttribution: 'boolean',\n  gaTrackingId: 'string',\n  codeTheme: 'string',\n};\n\nfunction sanitizeConfig(config) {\n  const result = {};\n  for (const key of ALLOWED_CONFIG_KEYS) {\n    if (\n      typeof config[key] === CONFIG_KEY_TYPE[key] &&\n      (config[key].length === undefined || config[key].length < 501)\n    ) {\n      result[key] = config[key];\n    }\n  }\n  return config;\n}\n\nexport function getContent(result) {\n  return JSON.stringify(\n    sanitizeConfig(result.Identity.data.oneGraph.identity),\n    null,\n    2,\n  );\n}\n\nexport function getExistingOid(result) {\n  const obj = result.CurrentOid.data.gitHub.repository.object || {};\n  return obj.oid;\n}\n\nexport function getPath(result) {\n  return `src/config-overrides/${viewerLogin(result)}.json`;\n}\n\nexport function getMessage(result) {\n  return `Update config for ${viewerLogin(result)}`;\n}\n"

      requests: [
        {
          operationName: "Identity",
          id: "Identity"
          variables: [
            {name: "newConfig", value: $config}
                                        ]
        },
        {
          operationName: "WhoAmIQuery"
          id: "WhoAmIQuery"
        },
        {
          operationName: "CurrentOid"
          id: "CurrentOid",
          argumentDependencies: [{
            functionFromScript: "getExpression",
            name: "expression"
            fromRequestIds: ["WhoAmIQuery"]
          }]
        },
        {
          query: "mutation UpdateFileMutation(\n  $path: String!\n  $message: String!\n  $content: String!\n  $sha: String\n  $gitHubToken: String!\n) {\n  gitHub(auths: {\n    gitHubOAuthToken: $gitHubToken\n  }) {\n    createOrUpdateFileContent_oneGraph(\n      input: {\n        message: $message\n        path: $path\n        repoName: \"oneblog\"\n        repoOwner: \"onegraph\"\n        branchName: \"essay.dev\"\n        plainContent: $content\n        existingFileSha: $sha\n      }\n    ) {\n      commit {        \n        url\n      }\n    }\n  }\n}\n"
          id: "UpdateFileMutation",
          variables: [{
            name: "gitHubToken",
            value: $gitHubToken

          }]
          argumentDependencies: [{
            functionFromScript: "getExistingOid",
            name: "sha",
            fromRequestIds: ["CurrentOid"]
          },
          {
            functionFromScript: "getPath",
            name: "path",
            fromRequestIds: ["WhoAmIQuery"]
          },
          {
            functionFromScript: "getContent",
            name: "content"
            fromRequestIds: ["Identity"]
          },
          {
            functionFromScript: "getMessage",
            name: "message",
            fromRequestIds: ["WhoAmIQuery"]
          }]
        }
      ]
    }) {
      results {
        request {
          id
        }
        result
      }
    }
  }
}

*/
