This repo powers the OneGraph Product Updates blog at [onegraph.com/changelog](https://www.onegraph.com/changelog).

All of the posts on the changelog are stored as [issues on this very repo](https://github.com/OneGraph/onegraph-changelog/issues?utf8=%E2%9C%93&q=is%3Aissue+label%3Apublish+).

When you visit the page at onegraph.com/changelog, a GraphQL query fetches the issues from GitHub via OneGraph's persisted queries and renders them as blog posts.

The persisted queries are stored with authentication credentials for GitHub that allows them to make authenticated requests. Persisting the queries locks them down so that they can't be made to send arbitrary requests to GitHub.

If you'd like to learn more about persisted queries, email [persit@onegraph.com](mailto:persist@onegraph.com) or hop in our [Spectrum chat](https://onegraph.com/chat).

## Setup

Install dependencies

```
yarn install
```

Start the server

```
yarn start
```

This project uses Relay as its GraphQL client because of its high-quality compiler and great support for persisted queries.

To create the token that's stored with the persisted query, you'll need to get a OneGraph token with GitHub credentials. Create a new app at [onegraph.com](https://www.onegraph.com), go the "Server-side Auth", click the "Create Token" button, and add GitHub to the services. Export `OG_GITHUB_TOKEN` when you run the Relay compiler.

You'll also need to get an API token for OneGraph itself to store persisted queries. At the moment, there is no built-in way to do this, so you'll have to go to onegraph.com, open the network tab in the developer tools, refresh the page, find the first request to `/dynamic`, and copy the Bearer token from the Authentication header.

In another terminal window, start the relay compiler

```
OG_GITHUB_TOKEN=':your-github-token' OG_DASHBOARD_ACCESS_TOKEN=':your-onegraph-access-token' yarn relay --watch
```

## Deploying

The project comes with setups for deploying to Google's Firebase, Zeit's Now, and Netlify.

For each of these, you'll have to add the site that you're deploying from to the CORS origins on the OneGraph dashboard.

### Deploying with Firebase

The project can use Firebase Hosting for static files and a Firebase Function to do server-side rendering.

The Firebase config lives in `/firebase.json` and `/.firebaserc`. You'll want to edit `/.firebaserc to use your firebase project.

To deploy

```
yarn build
yarn deploy:firebase
```

If you see an error when you visit the site, make sure the site's origin is listed in the CORS origins for your app on the OneGraph dashboard.

### Deploying with Zeit

The project can be deployed with Now v2. The config lives in `/now.json`.

To deploy

```
yarn build
yarn deploy:now
```

If you see an error when you visit the site, make sure the site's origin is listed in the CORS origins for your app on the OneGraph dashboard.

### Deploying with Netlify

The project can be deployed with Netlify and Netlify functions. The config lives in `/netlify.toml` and the functions live in `/netlify-functions`.

To deploy

```
yarn build
yarn build:netlify-functions
yarn deploy:netlify
```

If everything looks good at the preview site (note that you might have to add )

```
yarn deploy:netlify --prod
```

If you see an error when you visit the site, make sure the site's origin is listed in the CORS origins for your app on the OneGraph dashboard.

## Project setup

### Client

The client is an ordinary React app. The best to place to start is /src/App.js.

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

React renders the app to a string, which is sent as HTML.

On the client, React rehydates the app. To prevent Relay from showing a loading state, we inject the serialized record source in a global `window.__RELAY_BOOTSTRAP_DATA__` variable. That data is stored in the environment before Relay makes its first query. The `dataFrom` (which will move to `fetchConfig` in the next Relay release) prop on the QueryRenderer is set to "STORE_THEN_NETWORK" so that it uses the data from the store instead of showing a loading state.
