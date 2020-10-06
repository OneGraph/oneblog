// @flow

import React from 'react';
import ReactMarkdown from 'react-markdown';
import htmlParser from 'react-markdown/plugins/html-parser';
import HtmlToReact from 'html-to-react';
import Embed from 'react-embed';
import GifPlayer from './GifPlayer';
import imageUrl from './imageUrl';
import {Anchor} from 'grommet/components/Anchor';
import {Paragraph} from 'grommet/components/Paragraph';
import {Heading} from 'grommet/components/Heading';
import {Box} from 'grommet/components/Box';
import {Text} from 'grommet/components/Text';
import {ResponsiveContext} from 'grommet/contexts/ResponsiveContext';
import emoji from './emoji';
import {fetchTokenInfo, defaultThemeColors} from './lib/codeHighlight';
import {isPromise} from 'relay-runtime';
import Config from './config';

import type {TokenInfo} from './lib/codeHighlight';

type Props = {|
  source: string,
  trustedInput: boolean,
|};

class CodeBlock extends React.PureComponent<
  {
    value: string,
    language: string,
  },
  {
    tokenInfo: TokenInfo | Promise<TokenInfo>,
  },
> {
  state = {
    tokenInfo: fetchTokenInfo({
      code: this.props.value,
      language: this.props.language,
    }),
  };

  componentDidMount() {
    const {tokenInfo} = this.state;
    if (isPromise(tokenInfo)) {
      tokenInfo
        .then((res) => this.setState({tokenInfo: res}))
        .catch((e) => {
          console.error('Error fetching token info', e);
        });
    }
  }
  render() {
    const {language, value} = this.props;
    const {tokenInfo} = this.state;

    if (!isPromise(tokenInfo)) {
      return (
        <pre
          style={{
            display: 'block',
            overflowX: 'auto',
            padding: '1em',
            borderRadius: 4,
            color: tokenInfo.foregroundColor,
            background: tokenInfo.backgroundColor,
          }}>
          <code style={{padding: 0}}>
            {tokenInfo.tokens.map((lineTokens, idx) => {
              return (
                <React.Fragment key={idx}>
                  {lineTokens.map((token, tokenIdx) => (
                    <span
                      key={tokenIdx}
                      style={{
                        color: token.foregroundColor,
                      }}>
                      {token.text}
                    </span>
                  ))}
                  {idx === tokenInfo.tokens.length - 1 ? null : '\n'}
                </React.Fragment>
              );
            })}
          </code>
        </pre>
      );
    }

    return (
      <pre
        style={{
          display: 'block',
          overflowX: 'auto',
          padding: '1em',
          borderRadius: 4,
          color:
            defaultThemeColors[Config.codeTheme]?.foregroundColor || '#fff',
          background:
            defaultThemeColors[Config.codeTheme]?.backgroundColor || '#000',
        }}>
        <code className={`language-${language}`}>{value}</code>
      </pre>
    );
  }
}

function PlainImage(imageProps) {
  const {isRss, src, ...props} = imageProps;
  return (
    <Box as="span" align="center" justify="center" style={{display: 'flex'}}>
      {/*eslint-disable-next-line jsx-a11y/alt-text*/}
      <img style={{maxWidth: '100%'}} src={imageUrl({src})} {...props} />
      {props.isRss ? <br /> : null}
      {props.title ? (
        <Text
          style={{display: 'block'}}
          size="xsmall"
          margin="small"
          weight={300}
          color="dark-1"
          textAlign="center">
          {props.isRss ? <em>{props.title}</em> : props.title}
        </Text>
      ) : null}
    </Box>
  );
}

function isGif(src: string) {
  const srcUrl = new URL(src);
  return srcUrl.pathname.endsWith('gif');
}

function Image(props) {
  if (props.src && isGif(props.src)) {
    return <GifPlayer style={{maxWidth: '100%'}} src={props.src} />;
  }
  return <PlainImage {...props} />;
}

function P(props) {
  return <Paragraph fill={true} {...props} />;
}

function ParagraphWrapper(props) {
  const size = React.useContext(ResponsiveContext);

  const isLink =
    props.children &&
    props.children.length === 1 &&
    props.children[0].type === Link;

  if (isLink) {
    const link = props.children[0];
    const isSelfLink =
      link.props.href &&
      link.props.children &&
      link.props.children.length === 1 &&
      link.props.children[0].props &&
      link.props.children[0].props.value === link.props.href;
    if (isSelfLink) {
      return (
        <Embed
          url={link.props.href}
          fallback={<P {...props} />}
          renderVoid={() => <P {...props} />}
          renderWrap={(x) => (
            // Don't try to center on mobile -- bug with twitter embed will cause it to shift to the right
            <Box
              margin={{vertical: 'medium'}}
              align={size === 'small' ? null : 'center'}>
              {x}
            </Box>
          )}
        />
      );
    }
  }

  return <P {...props} />;
}

export function emojify(s: string): string {
  let startIndex = s.indexOf(':');
  if (startIndex === -1) {
    return s;
  }
  let endIndex = s.indexOf(':', startIndex + 1);
  if (endIndex === -1) {
    return s;
  }
  let emojified = s.substr(0, startIndex);

  while (startIndex !== -1 && endIndex !== -1) {
    const candidate = s.substring(startIndex + 1, endIndex);
    if (emoji.hasOwnProperty(candidate)) {
      emojified += emoji[candidate];
      startIndex = s.indexOf(':', endIndex + 1);
      if (startIndex === -1) {
        emojified += s.substring(endIndex + 1);
        endIndex = -1;
      } else {
        emojified += s.substring(endIndex + 1, startIndex);
        endIndex = s.indexOf(':', startIndex + 1);
      }
    } else {
      // Unsupported char name (or random colons in the string)
      emojified += s.substring(startIndex, endIndex);
      startIndex = endIndex;
      endIndex = s.indexOf(':', startIndex + 1);
    }
  }

  if (startIndex !== -1) {
    emojified += s.substr(startIndex);
  }

  return emojified;
}

function Link(props) {
  return <Anchor {...props} />;
}

const defaultRenderers = {
  blockquote(props) {
    return (
      <Text color="dark-3">
        <blockquote {...props} />
      </Text>
    );
  },
  text(props) {
    const text = props.children;
    return emojify(text);
  },
  inlineCode(props) {
    return (
      <code
        style={{
          padding: '.2em .4em',
          borderRadius: 6,
          background: 'rgba(27,31,35,.05)',
        }}
        {...props}
      />
    );
  },
  code(props) {
    if (props.language === 'backmatter') {
      return null;
    }
    return <CodeBlock {...props} />;
  },
  image: Image,
  paragraph: ParagraphWrapper,
  heading(props) {
    return <Heading {...props} level={props.level + 1} />;
  },
  link: Link,
  linkReference(props) {
    return <Anchor {...props} />;
  },
};

const processNodeDefinitions = new HtmlToReact.ProcessNodeDefinitions(React);

const parseHtml = htmlParser({
  isValidNode: (node) => node.type !== 'script',
  processingInstructions: [
    {
      shouldProcessNode: function (node) {
        return node.name === 'img';
      },
      processNode: function (node, children) {
        return <Image {...node.attribs} />;
      },
    },
    {
      shouldProcessNode: function (node) {
        return true;
      },
      processNode: processNodeDefinitions.processDefaultNode,
    },
  ],
});

export default class MarkdownRenderer extends React.PureComponent<Props> {
  render() {
    return (
      <ReactMarkdown
        escapeHtml={this.props.trustedInput ? false : true}
        source={this.props.source}
        renderers={defaultRenderers}
        astPlugins={this.props.trustedInput ? [parseHtml] : []}
      />
    );
  }
}

export class RssMarkdownRenderer extends React.PureComponent<Props> {
  render() {
    const {trustedInput} = this.props;
    return (
      <ReactMarkdown
        trustedInput={trustedInput}
        astPlugins={trustedInput ? [parseHtml] : []}
        source={this.props.source}
        renderers={{
          ...defaultRenderers,
          image(props) {
            return <PlainImage isRss={true} {...props} />;
          },
          heading(props) {
            const {level, ...restProps} = props;
            return <Heading level={level + 2} {...restProps} />;
          },
        }}
      />
    );
  }
}
