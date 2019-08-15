// @flow

import React from "react";
import ReactMarkdown from "react-markdown";
import SyntaxHighlighter from "react-syntax-highlighter";
import style from "react-syntax-highlighter/dist/esm/styles/hljs/github";

type Props = {
  source: string
};

class CodeBlock extends React.PureComponent<{
  value: string,
  language: string
}> {
  render() {
    const { language, value } = this.props;

    return (
      <SyntaxHighlighter style={style} language={language}>
        {value}
      </SyntaxHighlighter>
    );
  }
}

export default class MarkdownRenderer extends React.PureComponent<Props> {
  render() {
    return (
      <ReactMarkdown
        source={this.props.source}
        renderers={{
          code: CodeBlock
        }}
      />
    );
  }
}
