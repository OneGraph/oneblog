# Build a blog powered by GitHub issues

This repo powers the OneGraph Product Updates blog at [onegraph.com/changelog](https://www.onegraph.com/changelog).

All of the posts on the changelog are stored as [issues on this very repo](https://github.com/OneGraph/onegraph-changelog/issues?utf8=%E2%9C%93&q=is%3Aissue+label%3Apublish+).

When you visit the page at [onegraph.com/changelog](https://www.onegraph.com/changelog), a GraphQL query fetches the issues from GitHub via OneGraph's persisted queries and renders them as blog posts.

The persisted queries are stored with authentication credentials for GitHub that allows them to make authenticated requests. Persisting the queries locks them down so that they can't be made to send arbitrary requests to GitHub.

If you'd like to learn more about persisted queries, email [persist@onegraph.com](mailto:persist@onegraph.com) or hop in our [Spectrum chat](https://onegraph.com/chat).

## Setup

Use an existing OneGraph app or sign up sign up at [OneGraph](https://www.onegraph.com) to create a new app. Update the `/.env` file to update the `RAZZLE_ONEGRAPH_APP_ID` with your app's id. This would also be a good time to replace `REPOSITORY_FIXED_VARIABLES` in the `/.env` file with the repo name and owner for the repo you'd like to back your blog (it uses this repo's issues by default).

Remove the generated files (they're tied to the OneGraph app they were generated with)

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

To create the token that's stored with the persisted query, you'll need to get a OneGraph token with GitHub credentials. Go the "Server-side Auth" tab in the OneGraph dashboard for your app, click the "Create Token" button, and add GitHub to the services. Export `OG_GITHUB_TOKEN` when you run the Relay compiler.

You'll also need to get an API token for OneGraph itself to store persisted queries. Go to the "Persisted queries" tab on the OneGraph dashboard, scroll down, and click "Create token". This will create a scoped token for your app that can create persisted queries on your behalf. Use the token as `OG_DASHBOARD_ACCESS_TOKEN` below.

In another terminal window, start the relay compiler

```
OG_GITHUB_TOKEN='<your-github-token>' \
  OG_DASHBOARD_ACCESS_TOKEN='<your-onegraph-access-token>' \
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

### Deploying with Firebase

The project can use Firebase Hosting for static files and a Firebase Function to do server-side rendering.

The Firebase config lives in `/firebase.json` and `/.firebaserc`. You'll want to edit `/.firebaserc` to use your firebase project.

To deploy

```
yarn build
yarn deploy:firebase
```

If you see an error when you visit the site, make sure the site's origin is listed in the CORS origins for your app on the OneGraph dashboard.

To see it in action, visit [https://onechangelog.web.app](https://onechangelog.web.app).

### Deploying with Zeit

The project can be deployed with Now v2. The config lives in `/now.json`.

To deploy

```
yarn build
yarn deploy:now
```

If you see an error when you visit the site, make sure the site's origin is listed in the CORS origins for your app on the OneGraph dashboard.

To see it in action, visit [https://onechangelog.now.sh](https://onechangelog.now.sh).

### Deploying with Netlify

The project can be deployed with Netlify and Netlify functions. The config lives in `/netlify.toml` and the functions live in `/netlify-functions`.

To deploy

```
yarn deploy:netlify
```

If everything looks good at the preview site, deploy to production

```
yarn deploy:netlify --prod
```

If you see an error when you visit the site, make sure the site's origin is listed in the CORS origins for your app on the OneGraph dashboard.

To see it in action, visit [https://onechangelog.netlify.com](https://onechangelog.netlify.com).

### Deploying with Fly.io

The project can be deployed with [Fly.io](https://fly.io). Create a new app at [Fly.io](https://fly.io), then update the `/fly.toml` file to use your app.

You'll need to have the flyctl installed on your machine. Install the cli with

```
curl https://get.fly.io/flyctl.sh | sh
```

Then run

```
yarn deploy:fly
```

That will build a Docker image and upload it to Fly.io. You do not have to have Docker running on your machine. If it is not running Fly.io, will build the Docker file for you with their hosted builders.

If you see an error when you visit the site, make sure the site's origin is listed in the CORS origins for your app on the OneGraph dashboard.

To see it in action, visit [https://onechangelog.fly.dev](https://onechangelog.fly.dev).

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

The server uses [Razzle](https://github.com/jaredpalmer/razzle) to allow us to render the content on the server. This helps with SEO and allows people to view the blog with Javascript turned off.

Most of the work for the server-side rendering happens in `/src/server.js`.

When a request comes in to the server, the server creates a mock Relay environment and prefetches the query for the route using `fetchQuery` from `relay-runtime`. This populates the record source that Relay uses to render.

React renders the app to a string, which is sent to the client.

On the client, React rehydates the app. To prevent Relay from showing a loading state, we inject the serialized record source in a global `window.__RELAY_BOOTSTRAP_DATA__` variable. That data is stored in the environment before Relay makes its first query. The `dataFrom` prop (which will move to `fetchConfig` in the next Relay release) on the QueryRenderer is set to "STORE_THEN_NETWORK" so that it uses the data from the store instead of showing a loading state.
