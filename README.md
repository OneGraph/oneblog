# Build a blog powered by GitHub issues

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https%3A%2F%2Fgithub.com%2FOneGraph%2Foneblog%2Ftree%2Fnext&env=NEXT_PUBLIC_ONEGRAPH_APP_ID,NEXT_PUBLIC_TITLE,OG_GITHUB_TOKEN,OG_DASHBOARD_ACCESS_TOKEN,VERCEL_URL,VERCEL_GITHUB_ORG,VERCEL_GITHUB_REPO&envDescription=Variables%20needed%20to%20build%20your%20OneBlog&envLink=https%3A%2F%2Fgithub.com%2FOneGraph%2Foneblog%2Ftree%2Fnext%23environment-variables&project-name=oneblog&repo-name=oneblog)

This repo allows you to generate a blog from GitHub issues on a repo. It powers the [OneGraph Product Updates blog](https://www.onegraph.com/changelog), [Stepan Parunashvili's blog](https://stopa.io/), [bdougie.live](https://www.bdougie.live/), and more.

All of the posts are stored as issues on the repo (e.g. [OneGraph/onegraph-changelog](https://github.com/OneGraph/onegraph-changelog/issues?utf8=%E2%9C%93&q=is%3Aissue+label%3Apublish+)).

When you visit the page at [onegraph.com/changelog](https://www.onegraph.com/changelog), a GraphQL query fetches the issues from GitHub via OneGraph's persisted queries and renders them as blog posts.

The persisted queries are stored with authentication credentials for GitHub that allows them to make authenticated requests. Persisting the queries locks them down so that they can't be made to send arbitrary requests to GitHub.

You can learn more about [persisted queries in the docs](https://www.onegraph.com/docs/persisted_queries.html).

## Setup

Use an existing OneGraph app or sign up sign up at [OneGraph](https://www.onegraph.com) to create a new app.

Copy `/.env.example` to `/.env` and set the following environment variables.

### Environment variables

| Environment Variable            | Description                                                                                                                                                                                                                                                                                                                                                                                       |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `OG_GITHUB_TOKEN`               | A server-side access token created on OneGraph, used as the default auth for the persisted queries that will fetch the issues. To create a new one, go the "Server-side Auth" tab in the [OneGraph dashboard](https://www.onegraph.com/dashboard) for your app, click the "Create Token" button, and add GitHub to the services. Keep this token safe, because it has access to your GitHub data. |
| `OG_DASHBOARD_ACCESS_TOKEN`     | An API token that allows you to create persisted queries on OneGraph. Go to the "Persisted queries" tab on the OneGraph dashboard, scroll down, and click "Create token". This will create a scoped token for your app that can create persisted queries on your behalf.                                                                                                                          |
| `NEXT_PUBLIC_ONEGRAPH_APP_ID`   | The id of your OneGraph app. You can get this from the [OneGraph dashboard](https://www.onegraph.com/dashboard)                                                                                                                                                                                                                                                                                   |
| `NEXT_PUBLIC_TITLE`             | The title of your site                                                                                                                                                                                                                                                                                                                                                                            |
| `NEXT_PUBLIC_DESCRIPTION`       | A short description of your site.                                                                                                                                                                                                                                                                                                                                                                 |
| `NEXT_PUBLIC_GITHUB_REPO_OWNER` | The owner of the repo that we should pull issues from (e.g. linus in linus/oneblog). If you're using the Vercel deploy button, you don't need to provide this.                                                                                                                                                                                                                                    |
| `NEXT_PUBLIC_GITHUB_REPO_NAME`  | The name of the repo that we should pull issues from (e.g. oneblog in linus/oneblog). If you're using the Vercel deploy button, you don't need to provide this.                                                                                                                                                                                                                                   |

### Setup relay

Remove the generated files (they're tied to the OneGraph app they were generated with):

```
yarn relay:clean
# which runs rm -r src/__generated__
```

(Note: any time you change the variables in `.env`, it's a good idea to stop the relay compiler, remove the files in `src/__generated__`, and restart the compiler)

Install dependencies

```
yarn install
```

### Run the Relay compiler

This project uses Relay as its GraphQL client because of its high-quality compiler and great support for persisted queries.

In another terminal window, start the relay compiler

```
yarn relay --watch
```

You may need to install [watchman](https://facebook.github.io/watchman/), a file watching service. On mac, do `brew install watchman`. On Windows or Linux, follow the instructions at [https://facebook.github.io/watchman/docs/install.html](https://facebook.github.io/watchman/docs/install.html).

### Start the server

Now that we've generated the relay files, we can start the server.

```
yarn start
```

The project will load at [http://localhost:3000](http://localhost:3000).

## Deploying

The project comes with setups for deploying to Google's Firebase, Zeit's Now, Netlify, and Fly.io.

For each of these, you'll have to add the site that you're deploying to on the CORS origins on the OneGraph dashboard.

### Deploy with Vercel

Use the deploy button to set up a new repo:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https%3A%2F%2Fgithub.com%2FOneGraph%2Foneblog%2Ftree%2Fnext&env=NEXT_PUBLIC_ONEGRAPH_APP_ID,NEXT_PUBLIC_TITLE,OG_GITHUB_TOKEN,OG_DASHBOARD_ACCESS_TOKEN,VERCEL_URL,VERCEL_GITHUB_ORG,VERCEL_GITHUB_REPO&envDescription=Variables%20needed%20to%20build%20your%20OneBlog&envLink=https%3A%2F%2Fgithub.com%2FOneGraph%2Foneblog%2Ftree%2Fnext%23environment-variables&project-name=oneblog&repo-name=oneblog)

If you've already set up the repo, just run the vercel command.

```
# If not installed
# npm i -g vercel

vercel
```

If you see an error when you visit the site, make sure the site's origin is listed in the CORS origins for your app on the OneGraph dashboard.

### Deploying with Firebase

Please open an issue if you'd like help deploying with Firebase.

### Deploying with Netlify

Please open an issue if you'd like help deploying with Netlify.

### Deploying with Fly.io

Please open an issue if you'd like help deploying with Fly.io

## Project setup

### Client

The client is an ordinary React app. The best to place to start is `/src/App.js`.

It uses Grommet as the UI library. Visit [https://v2.grommet.io/components](https://v2.grommet.io/components) to view the documentation for Grommet.

It uses Relay as the GraphQL client. [https://relay.dev/docs/en/graphql-in-relay](https://relay.dev/docs/en/graphql-in-relay) has a good introduction to Relay.

To refresh the GraphQL schema, run `yarn fetch-schema`. That will fetch the schema from OneGraph and add some client-only directives that we use when we persist the queries to OneGraph.

#### How persisting works

The `persistFunction` for the relay compiler is set to `/scripts/persistQuery.js`. Every time a GraphQL query in the project changes, the relay compiler will call that function with the new query.

That function will parse the query and pull out the `@persistedQueryConfiguration` directive to determine if any auth should be stored alongside the query. In the changelog, the queries for fetching posts use persisted auth, but the mutations for adding reactions require the user to log in with OneGraph and use their auth.

The `@persistedQueryConfiguration` directive is stripped from the query and it is uploaded to OneGraph via a GraphQL mutation. Then the id for the persisted query is returned from the function. Relay stores the id in its generated file and it's used the next time the query is sent to the server.

### Server

The server uses [Next.js](https://nextjs.org) to allow us to render the content on the server. This helps with SEO and allows people to view the blog with Javascript turned off.

When a request comes in to the server, the server creates a mock Relay environment and prefetches the query for the route using `fetchQuery` from `relay-runtime`. This populates the record source that Relay uses to render.

React renders the app to a string, which is sent to the client.

On the client, React rehydates the app. To prevent Relay from showing a loading state, we inject the serialized record source with `getStaticProps`. That data is stored in the environment before Relay makes its first query. The `fetchPolicy` opt is set to "store-and-network" so that it uses the data from the store instead of showing a loading state.
