// @flow

import React from 'react';
import config from '../../config';
import {fetchQuery} from 'react-relay';
import {useRouter} from 'next/router';
import {query, PostRoot} from '../../PostRoot';
import {getStaticPaths as generateStaticPaths} from '../../staticPaths';
import {createEnvironment} from '../../Environment';

const MEDIUM_REGEX = /[0-9a-f]{8,16}$/;

function getMediumId(path) {
  if (!path) {
    return null;
  }
  const match = path.match(MEDIUM_REGEX);

  if (match && match[0]) {
    return match[0];
  }
  return null;
}

async function findMediumRedirect(path): Promise<?number> {
  const mediumId = getMediumId(path);
  if (mediumId) {
    try {
      const res = await fetch(
        `https://medium-oneblog-importer-o3e76jeu3q-uc.a.run.app/redirects/${config.repoOwner}/${config.repoName}/${mediumId}`,
      );
      const json = await res.json();
      if (json.status === 'found' && json.issue && json.issue.number) {
        return json.issue.number;
      }
    } catch (e) {
      console.error('Error finding Medium redirect', e);
      return null;
    }
  }
}

export async function getStaticProps(context: any) {
  const slug = context.params.slug;
  const path = slug[slug.length - 1];
  const mediumRedirectIssueNumber = await findMediumRedirect(path);
  let issueNumber;
  if (mediumRedirectIssueNumber) {
    issueNumber = mediumRedirectIssueNumber;
  } else {
    const issueNumberString = context.params.slug[0];
    if (issueNumberString) {
      issueNumber = parseInt(issueNumberString, 10);
    }
  }
  if (!issueNumber) {
    return {props: {}};
  }
  const environment = createEnvironment();
  await fetchQuery(environment, query, {issueNumber});
  return {
    revalidate: 600,
    props: {
      issueNumber,
      initialRecords: environment
        .getStore()
        .getSource()
        .toJSON(),
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
    query: {slug},
  } = useRouter();

  const issueNumber =
    staticIssueNumber || (slug?.[0] ? parseInt(slug[0], 10) : null);

  if (!issueNumber) {
    return null;
  }

  return <PostRoot issueNumber={issueNumber} />;
};

export default Page;
