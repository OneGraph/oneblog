// @flow

import https from 'https';
import graphql from 'babel-plugin-relay/macro';
import {fetchQuery} from 'react-relay/hooks';
import {createEnvironment} from './Environment';
import unified from 'unified';
import parse from 'remark-parse';
import {proxyImage} from './imageProxy';
import Config from './config';

const postQuery = graphql`
  query ogImage_PostQuery(
    $issueNumber: Int!
    $repoName: String!
    $repoOwner: String!
  )
  @persistedQueryConfiguration(
    fixedVariables: {environmentVariable: "REPOSITORY_FIXED_VARIABLES"}
    freeVariables: ["issueNumber"]
    cacheSeconds: 300
  ) {
    repository(name: $repoName, owner: $repoOwner) {
      owner {
        avatarUrl(size: 1200)
      }
      issue(number: $issueNumber) {
        labels(first: 100) {
          nodes {
            name
          }
        }
        body
        assignees(first: 10) {
          nodes {
            avatarUrl(size: 1200)
          }
        }
      }
    }
  }
`;

const markdownParser = unified().use(parse);

function imageFromAst(
  node: any,
): ?({type: 'url', url: string} | {type: 'code', lang: ?string, code: string}) {
  if (node.type === 'image' && node.url) {
    return {type: 'url', url: node.url};
  }
  if (node.type === 'code' && node.lang !== 'backmatter' && node.value) {
    return {type: 'code', lang: node.lang, code: node.value};
  }
  if (node.children && node.children.length) {
    for (const child of node.children) {
      const res = imageFromAst(child);
      if (res) {
        return res;
      }
    }
  }
}

function respondWithCodeImage(
  res,
  {code, lang}: {code: string, lang: ?string},
) {
  const postData = JSON.stringify({
    code,
    settings: {theme: Config.codeTheme, language: lang},
  });
  return new Promise((resolve, reject) => {
    const req = https.request(
      'https://sourcecodeshots.com/api/image',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': postData.length,
        },
      },
      (httpRes) => {
        res.status(httpRes.statusCode);
        for (const k of Object.keys(httpRes.headers)) {
          const lowerK = k.toLowerCase();
          if (lowerK === 'content-type' || lowerK === 'content-length') {
            res.set(k, httpRes.headers[k]);
          }
        }
        httpRes.on('data', (chunk) => {
          res.write(chunk);
        });
        httpRes.on('end', () => {
          res.end();
          resolve();
        });
      },
    );
    req.on('error', (err) => {
      console.error('Error creating code image');
      res.send('Error');
      res.status(500);
      reject(err);
    });
    req.write(postData);
    req.end();
  });
}

export const ogImage = async (req: any, res: any) => {
  const postNumber = parseInt(req.params.postNumber, 10);

  const data = await fetchQuery(createEnvironment(), postQuery, {
    issueNumber: postNumber,
  }).toPromise();

  const issue = data?.repository?.issue;
  if (
    !issue ||
    !issue.labels?.nodes?.length ||
    !issue.labels.nodes.find((l) => l && l.name.toLowerCase() === 'publish')
  ) {
    res.status(404);
    res.send('Could not find issue');
    return;
  }

  const ast = markdownParser.parse(issue.body);
  const bodyImage = imageFromAst(ast);
  if (bodyImage) {
    if (bodyImage.type === 'code') {
      return await respondWithCodeImage(res, bodyImage);
    } else if (bodyImage.type === 'url') {
      return await proxyImage(res, bodyImage.url);
    }
  } else {
    const avatarUrl =
      issue?.assignees?.nodes?.[0]?.avatarUrl ||
      data.repository?.owner?.avatarUrl;

    if (avatarUrl) {
      return await proxyImage(res, avatarUrl);
    } else {
      res.status(500);
      res.send('Error');
    }
  }
};
