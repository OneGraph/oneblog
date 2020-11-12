// @flow

import React from 'react';
import ReactMarkdown from 'react-markdown';
import htmlParser from 'react-markdown/plugins/html-parser';
import HtmlToReact from 'html-to-react';
import Embed from './Embed';
import GifPlayer from './GifPlayer';
import imageUrl from './imageUrl';
import {Anchor} from 'grommet/components/Anchor';
import {Paragraph} from 'grommet/components/Paragraph';
import {Heading} from 'grommet/components/Heading';
import {Box} from 'grommet/components/Box';
import {Text} from 'grommet/components/Text';
import {ResponsiveContext} from 'grommet/contexts/ResponsiveContext';
import {Table, TableHeader, TableBody, TableRow, TableCell} from 'grommet';
import emoji from './emoji';
import {fetchTokenInfo, defaultThemeColors} from './lib/codeHighlight';
import {isPromise} from 'relay-runtime';
import Tippy from '@tippyjs/react';
import {slugify} from './Post';
import ConfigContext from './ConfigContext';

import type {TokenInfo} from './lib/codeHighlight';
import type {StatelessFunctionalComponent, Node} from 'react';

type Props = {|
  source: string,
  trustedInput: boolean,
  addHeadingIds?: ?boolean,
  HashLink?: StatelessFunctionalComponent<{
    hash: string,
    children?: Node,
  }>,
|};

type CodeBlockProps = {|value: string, language: string, theme: string|};

export class CodeBlock extends React.PureComponent<
  CodeBlockProps,
  {
    tokenInfo: TokenInfo | Promise<TokenInfo>,
  },
> {
  state = {
    tokenInfo: fetchTokenInfo({
      code: this.props.value,
      language: this.props.language,
      theme: this.props.theme,
    }),
  };

  _updateTokenInfo = (tokenInfo: TokenInfo | Promise<TokenInfo>) => {
    if (isPromise(tokenInfo)) {
      tokenInfo
        .then((res) => {
          this.setState((prevState) => {
            if (prevState.tokenInfo === tokenInfo) {
              return {tokenInfo: res};
            } else {
              return prevState;
            }
          });
        })
        .catch((e) => {
          console.error('Error fetching token info', e);
        });
    }
  };

  componentDidMount() {
    this._updateTokenInfo(this.state.tokenInfo);
  }

  componentDidUpdate(prevProps: CodeBlockProps) {
    if (
      this.props.value !== prevProps.value ||
      this.props.language !== prevProps.language ||
      this.props.theme !== prevProps.theme
    ) {
      const tokenInfo = fetchTokenInfo({
        code: this.props.value,
        language: this.props.language,
        theme: this.props.theme,
      });
      this.setState({
        tokenInfo,
      });
      this._updateTokenInfo(tokenInfo);
    }
  }

  render() {
    const {language, value, theme} = this.props;
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
          color: defaultThemeColors[theme]?.foregroundColor || '#fff',
          background: defaultThemeColors[theme]?.backgroundColor || '#000',
        }}>
        <code className={`language-${language}`}>{value}</code>
      </pre>
    );
  }
}

function PlainImage(imageProps) {
  const {isRss, src, ...props} = imageProps;
  return (
    <Box
      margin={{vertical: 'medium'}}
      as="span"
      align="center"
      justify="center"
      style={{display: 'flex'}}>
      {/*eslint-disable-next-line jsx-a11y/alt-text*/}
      <img
        style={{maxWidth: '100%'}}
        // Don't proxy image if it's served on an RSS feed to avoid CORs errors
        src={isRss ? src : imageUrl({src})}
        {...props}
      />
      {isRss ? <br /> : null}
      {props.title ? (
        <Text
          style={{display: 'block'}}
          size="xsmall"
          margin="small"
          weight={300}
          color="dark-1"
          textAlign="center">
          {isRss ? <em>{props.title}</em> : props.title}
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
  if (props.src && isGif(props.src) && !props.isRss) {
    return (
      <Box margin={{vertical: 'medium'}}>
        <GifPlayer style={{maxWidth: '100%'}} src={props.src} />
      </Box>
    );
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

const HashLinkContext = React.createContext<?StatelessFunctionalComponent<{
  hash: string,
  children?: Node,
}>>(null);

function Link(props) {
  const HashLink = React.useContext(HashLinkContext);
  if (props.href && props.href.startsWith('#') && HashLink) {
    return <HashLink hash={props.href}>{props.children}</HashLink>;
  }
  return <Anchor {...props} />;
}

function Code(props) {
  const {config} = React.useContext(ConfigContext);
  if (props.language === 'backmatter') {
    return null;
  }
  return (
    <Box margin={{vertical: 'small'}}>
      <CodeBlock theme={config.codeTheme} {...props} />
    </Box>
  );
}

function flatten(text, child) {
  return typeof child === 'string'
    ? text + child
    : React.Children.toArray(child.props.children).reduce(flatten, text);
}

function headingSlug(props) {
  const children = React.Children.toArray(props.children);
  const text = children.reduce(flatten, '');
  return slugify(text.toLowerCase());
}

const defaultRenderers = ({
  isRss,
  addHeadingIds,
}: {
  isRss?: ?boolean,
  addHeadingIds?: ?boolean,
  HashLink?: ?StatelessFunctionalComponent<{
    hash: string,
    children?: Node,
  }>,
}) => {
  const footnoteRefs = {};
  return {
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
          }}>
          {props.children}
        </code>
      );
    },
    code: Code,
    image: Image,
    paragraph: ParagraphWrapper,
    heading(props) {
      return (
        <Heading
          id={addHeadingIds ? headingSlug(props) : undefined}
          {...props}
          level={props.level + 1}
        />
      );
    },
    link: Link,
    linkReference(props) {
      return <div {...props} />;
    },
    table: Table,
    tableHead: TableHeader,
    tableBody: TableBody,
    tableRow: TableRow,
    tableCell: TableCell,
    footnoteReference: function FootnoteReference(props) {
      // This should be ok because we will always call these in the same order
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const ref = footnoteRefs[props.identifier] || React.useRef();
      footnoteRefs[props.identifier] = ref;
      return (
        <sup
          style={{
            lineHeight: 0,
            cursor: 'pointer',
            fontSize: '0.8em',
          }}
          ref={ref}>
          {Object.keys(footnoteRefs).indexOf(props.identifier) + 1}
        </sup>
      );
    },
    footnoteDefinition: function footnoteDefinition(props) {
      // This should be ok because we will always call these in the same order
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const ref = footnoteRefs[props.identifier] || React.useRef();
      footnoteRefs[props.identifier] = ref;
      if (isRss) {
        return (
          <Box direction="row">
            <sup
              style={{
                cursor: 'pointer',
              }}>
              {Object.keys(footnoteRefs).indexOf(props.identifier) + 1}
            </sup>
            {props.children}
          </Box>
        );
      }
      return (
        <Tippy
          arrow={false}
          theme="light-border"
          trigger="mouseenter focus click"
          inertia={true}
          interactive={true}
          interactiveBorder={10}
          duration={[75, 75]}
          delay={500}
          content={
            <Box style={{transform: 'scale(0.8)'}}>
              <Text size="small">{props.children}</Text>
            </Box>
          }
          reference={ref}
        />
      );
    },
  };
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
      <HashLinkContext.Provider value={this.props.HashLink}>
        <ReactMarkdown
          escapeHtml={this.props.trustedInput ? false : true}
          source={this.props.source}
          renderers={defaultRenderers({
            isRss: false,
            addHeadingIds: this.props.addHeadingIds,
          })}
          astPlugins={this.props.trustedInput ? [parseHtml] : []}
          parserOptions={{footnotes: true}}
        />
      </HashLinkContext.Provider>
    );
  }
}

export class RssMarkdownRenderer extends React.PureComponent<Props> {
  render() {
    const {trustedInput} = this.props;
    return (
      <ReactMarkdown
        escapeHtml={this.props.trustedInput ? false : true}
        astPlugins={trustedInput ? [parseHtml] : []}
        parserOptions={{footnotes: true}}
        source={this.props.source}
        renderers={{
          ...defaultRenderers({isRss: true}),
          image(props) {
            return <PlainImage isRss={true} {...props} />;
          },
          heading(props) {
            const {level, ...restProps} = props;
            return (
              <Heading
                id={headingSlug(props)}
                level={level + 2}
                {...restProps}
              />
            );
          },
        }}
      />
    );
  }
}
