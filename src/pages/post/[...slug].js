// @flow

import React from 'react';
import {fetchQuery} from 'react-relay/hooks';
import {useRouter} from 'next/router';
import {query, PostRoot} from '../../PostRoot';
import {getStaticPaths as generateStaticPaths} from '../../staticPaths';
import {createEnvironment} from '../../Environment';
import DefaultErrorPage from 'next/error';
import {tokenInfosFromMarkdowns} from '../../lib/codeHighlight';

export async function getStaticProps(context: any) {
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
  await fetchQuery(environment, query, {issueNumber}).toPromise();

  let tokenInfos = {};

  try {
    tokenInfos = await tokenInfosFromMarkdowns({markdowns});
  } catch (e) {
    console.error('Error fetching tokenInfos for highlighting code', e);
  }

  return {
    revalidate: 600,
    props: {
      issueNumber,
      initialRecords: environment.getStore().getSource().toJSON(),
      tokenInfos,
    },
  };
}

export async function getStaticPaths() {
  const paths = await generateStaticPaths();
  return {
    paths,
    fallback: true,
  };
}

const Page = ({issueNumber: staticIssueNumber}: {issueNumber: ?number}) => {
  const {
    isFallback,
    query: {slug},
  } = useRouter();

  const issueNumber =
    staticIssueNumber || (slug?.[0] ? parseInt(slug[0], 10) : null);

  if (!issueNumber) {
    if (isFallback) {
      return null;
    } else {
      return <DefaultErrorPage statusCode={404} />;
    }
  }

  return <PostRoot issueNumber={issueNumber} />;
};

export default Page;
