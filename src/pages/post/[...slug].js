// @flow

import React from 'react';
import {fetchQuery} from 'react-relay/hooks';
import {useRouter} from 'next/router';
import {query, PostRoot} from '../../PostRoot';
import {getStaticPaths as generateStaticPaths} from '../../staticPaths';
import {createEnvironment} from '../../Environment';
import DefaultErrorPage from 'next/error';
import {tokenInfosFromMarkdowns} from '../../lib/codeHighlight';
import {withOverrides} from '../../config';
import {subdomainFromReq} from '../../lib/subdomain';

export async function getServerSideProps(context: any) {
  let issueNumber;
  const issueNumberString = context.params.slug[0];
  if (issueNumberString) {
    issueNumber = parseInt(issueNumberString, 10);
  }
  if (!issueNumber) {
    return {props: {}};
  }
  const markdowns = [];
  const environment = createEnvironment({
    registerMarkdown: function (m) {
      markdowns.push(m);
    },
  });
  const subdomain = subdomainFromReq(context.req);
  if (!subdomain) {
    return {props: {}};
  }
  try {
    const result = await fetchQuery(environment, query, {
      issueNumber,
      subdomain,
    }).toPromise();

    const author = result?.gitHub?.subdomainAuthor;
    const config = withOverrides({author, subdomain});

    let tokenInfos = {};

    try {
      tokenInfos = await tokenInfosFromMarkdowns({
        markdowns,
        theme: config.codeTheme,
      });
    } catch (e) {
      console.error('Error fetching tokenInfos for highlighting code', e);
    }

    context.res.setHeader(
      'Cache-Control',
      's-maxage=600, stale-while-revalidate',
    );

    return {
      props: {
        issueNumber,
        initialRecords: environment.getStore().getSource().toJSON(),
        tokenInfos,
        subdomain,
        author,
      },
    };
  } catch (e) {
    return {
      props: {
        is404: !!e.source?.errors?.[0]?.message?.match(/could not resolve/i),
        issueNumber,
        subdomain,
      },
    };
  }
}

// export async function getStaticPaths() {
//   const paths = await generateStaticPaths();
//   return {
//     paths,
//     fallback: 'blocking',
//   };
// }

const Page = ({
  issueNumber: staticIssueNumber,
  subdomain,
  is404,
}: {
  issueNumber: ?number,
  subdomain: ?string,
  is404?: ?boolean,
}) => {
  const {
    isFallback,
    query: {slug},
  } = useRouter();

  if (is404) {
    return <DefaultErrorPage statusCode={404} />;
  }

  const issueNumber =
    staticIssueNumber || (slug?.[0] ? parseInt(slug[0], 10) : null);

  if (!issueNumber || !subdomain) {
    if (isFallback) {
      return null;
    } else {
      return <DefaultErrorPage statusCode={404} />;
    }
  }

  return <PostRoot subdomain={subdomain} issueNumber={issueNumber} />;
};

export default Page;
