// @flow

import React from "react";
import graphql from "babel-plugin-relay/macro";
import {
  createFragmentContainer,
  type RelayProp,
  commitMutation
} from "react-relay";
import ReactMarkdown from "react-markdown";
import formatDate from "date-fns/format";
// $FlowFixMe: https://facebook.github.io/create-react-app/docs/adding-images-fonts-and-files
import { ReactComponent as EmojiIcon } from "./emojiIcon.svg";
// $FlowFixMe: https://facebook.github.io/create-react-app/docs/adding-images-fonts-and-files
import { ReactComponent as AddIcon } from "./addIcon.svg";
import Tippy from "@tippy.js/react";
import "tippy.js/themes/light-border.css";

import type { Post_post } from "./__generated__/Post_post.graphql";

const addReactionMutation = graphql`
  mutation Post_AddReactionMutation($input: GitHubAddReactionInput!) {
    gitHub {
      addReaction(input: $input) {
        reaction {
          content
          user {
            login
          }
        }
      }
    }
  }
`;

const removeReactionMutation = graphql`
  mutation Post_RemoveReactionMutation($input: GitHubRemoveReactionInput!) {
    gitHub {
      removeReaction(input: $input) {
        reaction {
          content
          user {
            login
          }
        }
      }
    }
  }
`;

function reactionUpdater({ store, viewerHasReacted, postId, content }) {
  const reactionGroup = store
    .get(postId)
    .getLinkedRecords("reactionGroups")
    .find(r => r.getValue("content") === content);
  reactionGroup.setValue(viewerHasReacted, "viewerHasReacted");
  const users = reactionGroup.getLinkedRecord("users");
  users.setValue(
    Math.max(0, users.getValue("totalCount") + (viewerHasReacted ? 1 : -1)),
    "totalCount"
  );
}

async function addReaction({ environment, content, postId }) {
  const variables = {
    input: {
      content,
      subjectId: postId
    }
  };
  return new Promise((resolve, reject) => {
    commitMutation(environment, {
      mutation: addReactionMutation,
      variables,
      onCompleted: (response, errors) => resolve({ response, errors }),
      onError: err => reject(err),
      optimisticUpdater: store =>
        reactionUpdater({ store, viewerHasReacted: true, content, postId }),
      updater: (store, data) =>
        reactionUpdater({ store, viewerHasReacted: true, content, postId })
    });
  });
}

async function removeReaction({ environment, content, postId }) {
  const variables = {
    input: {
      content,
      subjectId: postId
    }
  };
  return new Promise((resolve, reject) => {
    commitMutation(environment, {
      mutation: removeReactionMutation,
      variables,
      onCompleted: (response, errors) => resolve({ response, errors }),
      onError: err => reject(err),
      optimisticUpdater: store =>
        reactionUpdater({ store, viewerHasReacted: false, content, postId }),
      updater: (store, data) =>
        reactionUpdater({ store, viewerHasReacted: false, content, postId })
    });
  });
}

function emojiForContent(content) {
  switch (content) {
    case "THUMBS_UP":
      return "👍";
    case "THUMBS_DOWN":
      return "👎";
    case "LAUGH":
      return "😄";
    case "HOORAY":
      return "🎉";
    case "CONFUSED":
      return "😕";
    case "HEART":
      return "❤️";
    case "ROCKET":
      return "🚀";
    case "EYES":
      return "👀";
    default:
      return null;
  }
}

const reactions = [
  "THUMBS_UP",
  "THUMBS_DOWN",
  "LAUGH",
  "HOORAY",
  "CONFUSED",
  "HEART",
  "ROCKET",
  "EYES"
];

const EmojiPicker = ({ viewerReactions, onSelect, onDeselect }) => {
  const reactionContent = reaction => {
    const isSelected = viewerReactions.includes(reaction);
    return (
      <button
        style={{
          cursor: "pointer",
          outline: "none",
          fontSize: 20,
          padding: "0 5px",
          backgroundColor: isSelected ? "#ddefff" : "",
          border: isSelected ? "1px solid #e1e4e8" : "1px solid transparent"
        }}
        key={reaction}
        onClick={() => (isSelected ? onDeselect(reaction) : onSelect(reaction))}
      >
        <span role="img">{emojiForContent(reaction)}</span>
      </button>
    );
  };
  return (
    <>
      <p style={{ textAlign: "left", margin: "5px 0 0" }}>Pick your reaction</p>
      <div style={{ height: 1, background: "#ddd", margin: "5px 0" }} />
      <div>
        {reactions.slice(0, 4).map(reaction => reactionContent(reaction))}
      </div>
      <div>{reactions.slice(4).map(reaction => reactionContent(reaction))}</div>
    </>
  );
};

type Props = {
  relay: RelayProp,
  isLoggedIn: boolean,
  post: Post_post,
  login: any,
  logout: any
};

const Post = ({ relay, post, isLoggedIn, login, logout }: Props) => {
  const [showReactionPopover, setShowReactionPopover] = React.useState(false);
  const popoverInstance = React.useRef();

  const handleAddReaction = () => {
    if (isLoggedIn) {
      console.log("logged in!");
    } else {
      login();
    }
  };
  const usedReactions = (post.reactionGroups || []).filter(
    g => g.users.totalCount > 0
  );
  return (
    <section
      style={{
        width: 704,
        margin: 32,
        marginBottom: 0,
        paddingBottom: 0,
        borderRadius: 2,
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0,0,0,0.24)"
      }}
    >
      <div style={{ padding: 32, paddingTop: 16 }}>
        <h2>{post.title}</h2>

        <span style={{ fontSize: "0.8em", fontWeight: "300" }}>
          {formatDate(new Date(post.createdAt), "MMM Do, YYYY")}
        </span>
        <div>
          <ReactMarkdown source={post.body} escapeHtml={false} />
        </div>
      </div>
      <div style={{ borderTop: "1px solid rgba(0,0,0,0.12)", padding: 32 }}>
        {(post.assignees.nodes || []).map(node =>
          node ? (
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                alt={node.name}
                src={node.avatarUrl}
                style={{ width: 45, height: 45, borderRadius: "50%" }}
              />
              <span style={{ marginLeft: 8, fontWeight: "600" }}>
                {node.name}
              </span>
            </div>
          ) : null
        )}
      </div>
      <div
        style={{
          borderTop: "1px solid rgba(0,0,0,0.12)",
          fontSize: 24,
          display: "flex",
          alignItems: "center"
        }}
      >
        {usedReactions.map(g => (
          <span
            style={{
              padding: "8px 16px",
              borderRight: "1px solid rgba(0,0,0,0.12)",
              display: "flex",
              alignItems: "center"
            }}
          >
            {emojiForContent(g.content)}{" "}
            <span style={{ fontSize: 12, marginLeft: 12 }}>
              {g.users.totalCount}
            </span>
          </span>
        ))}
        <Tippy
          onCreate={instance => (popoverInstance.current = instance)}
          arrow={true}
          trigger="click"
          theme="light-border"
          inertia={true}
          interactive={true}
          animateFill={false}
          interactiveBorder={10}
          duration={[300, 75]}
          content={
            <div>
              <EmojiPicker
                viewerReactions={usedReactions
                  .filter(x => x.viewerHasReacted)
                  .map(x => x.content)}
                onDeselect={content => {
                  popoverInstance.current && popoverInstance.current.hide();
                  removeReaction({
                    environment: relay.environment,
                    content,
                    postId: post.id
                  });
                }}
                onSelect={content => {
                  popoverInstance.current && popoverInstance.current.hide();
                  addReaction({
                    environment: relay.environment,
                    content,
                    postId: post.id
                  });
                }}
              />
            </div>
          }
        >
          <span
            style={{ padding: "8px 16px" }}
            className="add-reaction-emoji"
            onClick={() => setShowReactionPopover(!showReactionPopover)}
            // onClick={handleAddReaction}
          >
            <AddIcon width="12" />
            <EmojiIcon width="24" style={{ stroke: "rgba(0,0,0,0)" }} />
          </span>
        </Tippy>
      </div>
    </section>
  );
};

export default createFragmentContainer(Post, {
  post: graphql`
    fragment Post_post on GitHubIssue {
      id
      title
      body
      createdAt
      author {
        login
        avatarUrl
      }
      updatedAt
      assignees(first: 10) {
        nodes {
          name
          login
          avatarUrl
        }
      }
      reactionGroups {
        content
        viewerHasReacted
        users {
          totalCount
        }
      }
      comments {
        totalCount
      }
    }
  `
});
