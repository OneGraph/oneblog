// @flow

import config from './config';

export function newIssueUrl(): string {
  const url = new URL(
    `https://github.com/${config.repoOwner}/${config.repoName}/issues/new`,
  );
  url.searchParams.set('labels', 'Publish');
  const defaultAuthor = config.defaultLogin || config.repoOwner;
  if (defaultAuthor) {
    url.searchParams.set('assignees', defaultAuthor);
  }
  return url.toString();
}

export function editIssueUrl({issueNumber}: {issueNumber: number}): string {
  return `https://github.com/${config.repoOwner}/${config.repoName}/issues/${issueNumber}`;
}
