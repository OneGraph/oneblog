import graphql from 'babel-plugin-relay/macro';

export const query = graphql`
  query LoginQuery_Query($repoName: String!, $repoOwner: String!)
  @persistedQueryConfiguration(
    fixedVariables: {environmentVariable: "REPOSITORY_FIXED_VARIABLES"}
  ) {
    gitHub {
      ...Avatar_gitHub @arguments(repoName: $repoName, repoOwner: $repoOwner)
    }
  }
`;
