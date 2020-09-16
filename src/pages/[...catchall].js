// @flow

import React from 'react';
import config from '../config';
import DefaultErrorPage from 'next/error';

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

// workaround for netlify (res.redirect is broken)
function redirect(res, statusOrUrl, url) {
  if (typeof statusOrUrl === 'string') {
    url = statusOrUrl;
    statusOrUrl = 307;
  }
  if (typeof statusOrUrl !== 'number' || typeof url !== 'string') {
    throw new Error(
      `Invalid redirect arguments. Please use a single argument URL, e.g. res.redirect('/destination') or use a status code and URL, e.g. res.redirect(307, '/destination').`,
    );
  }
  res.writeHead(statusOrUrl, {Location: url});
  res.end();
  return res;
}

export async function getServerSideProps(context: any) {
  const path = context.params.catchall?.[context.params.catchall.length - 1];

  const mediumRedirectIssueNumber = await findMediumRedirect(path);
  if (mediumRedirectIssueNumber) {
    redirect(context.res, 301, `/post/${mediumRedirectIssueNumber}`);
  }
  return {props: {}};
}

const Page = () => {
  return <DefaultErrorPage statusCode={404} />;
};

export default Page;
