// @flow

import React from 'react';
import ReactMarkdown from 'react-markdown/with-html';
import htmlParser from 'react-markdown/plugins/html-parser';
import type SyntaxHighlighter from 'react-syntax-highlighter';
import GifPlayer from './GifPlayer';
import imageUrl from './imageUrl';
import {Anchor} from 'grommet/components/Anchor';
import {Paragraph} from 'grommet/components/Paragraph';
import {Heading} from 'grommet/components/Heading';
import {Image as GrommetImage} from 'grommet/components/Image';
import {Box} from 'grommet/components/Box';
import {Text} from 'grommet/components/Text';
import emoji from './emoji';

type Props = {
  source: string,
  escapeHtml: boolean,
  SyntaxHighlighter?: ?SyntaxHighlighter,
};

class CodeBlock extends React.PureComponent<
  {
    value: string,
    language: string,
    SyntaxHighlighter?: ?SyntaxHighlighter,
  },
  {
    SyntaxHighlighter: ?SyntaxHighlighter,
  },
> {
  state = {
    SyntaxHighlighter: this.props.SyntaxHighlighter,
  };
  componentDidMount() {
    this.props.language === 'backmatter' || this.state.SyntaxHighlighter
      ? null
      : Promise.all([
          import('react-syntax-highlighter/dist/esm/light'),
          import('react-syntax-highlighter/dist/esm/styles/hljs/github'),
          importLanguage(this.props.language),
        ])
          .then(
            ([
              {default: SyntaxHighlighter},
              {default: style},
              languageImport,
            ]) => {
              if (languageImport && languageImport.default) {
                SyntaxHighlighter.registerLanguage(
                  this.props.language,
                  languageImport.default,
                );
              }
              this.setState({
                SyntaxHighlighter: props => (
                  <SyntaxHighlighter style={style} {...props} />
                ),
              });
            },
          )
          .catch(e => console.error('Error loading syntax highlighter', e));
  }
  render() {
    const {language, value} = this.props;
    if (language === 'backmatter') {
      return null;
    }

    const {SyntaxHighlighter} = this.state;
    if (SyntaxHighlighter) {
      return <SyntaxHighlighter language={language}>{value}</SyntaxHighlighter>;
    }
    return (
      <pre
        style={{
          display: 'block',
          overflowX: 'auto',
          padding: '0.5em',
          color: 'rgb(51, 51, 51)',
          background: 'rgb(248, 248, 248)',
        }}>
        <code className={`language-${language}`}>{value}</code>
      </pre>
    );
  }
}

function PlainImage(imageProps) {
  const {isRss, src, ...props} = imageProps;
  return (
    <Box as="span" style={{display: 'block'}}>
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

function Image(props) {
  if (props.src && props.src.endsWith('gif')) {
    return <GifPlayer style={{maxWidth: '100%'}} src={props.src} />;
  }
  return <PlainImage {...props} />;
}

function P(props) {
  return <Paragraph fill={true} {...props} />;
}

const parseHtml = htmlParser({
  isValidNode: node => node.type !== 'script',
});

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

const defaultRenderers = ({SyntaxHighlighter}) => ({
  text(props) {
    const text = props.children;
    return emojify(text);
  },
  code(props) {
    return <CodeBlock SyntaxHighlighter={SyntaxHighlighter} {...props} />;
  },
  image: Image,
  paragraph: P,
  heading: Heading,
  link(props) {
    return <Anchor {...props} />;
  },
  linkReference(props) {
    return <Anchor {...props} />;
  },
});

export default class MarkdownRenderer extends React.PureComponent<Props> {
  render() {
    const {escapeHtml = true, SyntaxHighlighter} = this.props;
    return (
      <ReactMarkdown
        escapeHtml={this.props.escapeHtml}
        source={this.props.source}
        renderers={defaultRenderers({SyntaxHighlighter})}
        astPlugins={this.props.escapeHtml ? [parseHtml] : []}
      />
    );
  }
}

export class RssMarkdownRenderer extends React.PureComponent<Props> {
  render() {
    const {escapeHtml = true, SyntaxHighlighter} = this.props;
    return (
      <ReactMarkdown
        escapeHtml={this.props.escapeHtml}
        source={this.props.source}
        renderers={{
          ...defaultRenderers({SyntaxHighlighter}),
          image(props) {
            return <PlainImage isRss={true} {...props} />;
          },
          heading(props) {
            const {level, ...restProps} = props;
            return <Heading level={level + 2} {...restProps} />;
          },
        }}
        astPlugins={this.props.escapeHtml ? [parseHtml] : []}
      />
    );
  }
}

function importLanguage(
  language: ?string,
): ?Promise<?{default: (hljs: any) => any}> {
  if (!language) {
    return null;
  }
  switch (language) {
    case '1c':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/1c');
    case 'abnf':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/abnf');
    case 'accesslog':
      return import(
        'react-syntax-highlighter/dist/esm/languages/hljs/accesslog'
      );
    case 'actionscript':
      return import(
        'react-syntax-highlighter/dist/esm/languages/hljs/actionscript'
      );
    case 'ada':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/ada');
    case 'angelscript':
      return import(
        'react-syntax-highlighter/dist/esm/languages/hljs/angelscript'
      );
    case 'apache':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/apache');
    case 'applescript':
      return import(
        'react-syntax-highlighter/dist/esm/languages/hljs/applescript'
      );
    case 'arcade':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/arcade');
    case 'arduino':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/arduino');
    case 'armasm':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/armasm');
    case 'asciidoc':
      return import(
        'react-syntax-highlighter/dist/esm/languages/hljs/asciidoc'
      );
    case 'aspectj':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/aspectj');
    case 'autohotkey':
      return import(
        'react-syntax-highlighter/dist/esm/languages/hljs/autohotkey'
      );
    case 'autoit':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/autoit');
    case 'avrasm':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/avrasm');
    case 'awk':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/awk');
    case 'axapta':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/axapta');
    case 'bash':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/bash');
    case 'basic':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/basic');
    case 'bnf':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/bnf');
    case 'brainfuck':
      return import(
        'react-syntax-highlighter/dist/esm/languages/hljs/brainfuck'
      );
    case 'cal':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/cal');
    case 'capnproto':
      return import(
        'react-syntax-highlighter/dist/esm/languages/hljs/capnproto'
      );
    case 'ceylon':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/ceylon');
    case 'clean':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/clean');
    case 'clojureRepl':
      return import(
        'react-syntax-highlighter/dist/esm/languages/hljs/clojure-repl'
      );
    case 'clojure':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/clojure');
    case 'cmake':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/cmake');
    case 'coffeescript':
      return import(
        'react-syntax-highlighter/dist/esm/languages/hljs/coffeescript'
      );
    case 'coq':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/coq');
    case 'cos':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/cos');
    case 'cpp':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/cpp');
    case 'crmsh':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/crmsh');
    case 'crystal':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/crystal');
    case 'cs':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/cs');
    case 'csp':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/csp');
    case 'css':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/css');
    case 'd':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/d');
    case 'dart':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/dart');
    case 'delphi':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/delphi');
    case 'diff':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/diff');
    case 'django':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/django');
    case 'dns':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/dns');
    case 'dockerfile':
      return import(
        'react-syntax-highlighter/dist/esm/languages/hljs/dockerfile'
      );
    case 'dos':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/dos');
    case 'dsconfig':
      return import(
        'react-syntax-highlighter/dist/esm/languages/hljs/dsconfig'
      );
    case 'dts':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/dts');
    case 'dust':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/dust');
    case 'ebnf':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/ebnf');
    case 'elixir':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/elixir');
    case 'elm':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/elm');
    case 'erb':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/erb');
    case 'erlangRepl':
      return import(
        'react-syntax-highlighter/dist/esm/languages/hljs/erlang-repl'
      );
    case 'erlang':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/erlang');
    case 'excel':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/excel');
    case 'fix':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/fix');
    case 'flix':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/flix');
    case 'fortran':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/fortran');
    case 'fsharp':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/fsharp');
    case 'gams':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/gams');
    case 'gauss':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/gauss');
    case 'gcode':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/gcode');
    case 'gherkin':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/gherkin');
    case 'glsl':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/glsl');
    case 'gml':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/gml');
    case 'go':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/go');
    case 'golo':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/golo');
    case 'gradle':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/gradle');
    case 'graphql':
      return import('highlightjs-graphql').then(graphql => ({
        default: graphql.definer,
      }));
    case 'groovy':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/groovy');
    case 'haml':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/haml');
    case 'handlebars':
      return import(
        'react-syntax-highlighter/dist/esm/languages/hljs/handlebars'
      );
    case 'haskell':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/haskell');
    case 'haxe':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/haxe');
    case 'hsp':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/hsp');
    case 'htmlbars':
      return import(
        'react-syntax-highlighter/dist/esm/languages/hljs/htmlbars'
      );
    case 'http':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/http');
    case 'hy':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/hy');
    case 'inform7':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/inform7');
    case 'ini':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/ini');
    case 'irpf90':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/irpf90');
    case 'isbl':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/isbl');
    case 'java':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/java');
    case 'js':
    case 'jsx':
    case 'javascript':
      return import(
        'react-syntax-highlighter/dist/esm/languages/hljs/javascript'
      );
    case 'jbossCli':
      return import(
        'react-syntax-highlighter/dist/esm/languages/hljs/jboss-cli'
      );
    case 'json':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/json');
    case 'juliaRepl':
      return import(
        'react-syntax-highlighter/dist/esm/languages/hljs/julia-repl'
      );
    case 'julia':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/julia');
    case 'kotlin':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/kotlin');
    case 'lasso':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/lasso');
    case 'ldif':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/ldif');
    case 'leaf':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/leaf');
    case 'less':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/less');
    case 'lisp':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/lisp');
    case 'livecodeserver':
      return import(
        'react-syntax-highlighter/dist/esm/languages/hljs/livecodeserver'
      );
    case 'livescript':
      return import(
        'react-syntax-highlighter/dist/esm/languages/hljs/livescript'
      );
    case 'llvm':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/llvm');
    case 'lsl':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/lsl');
    case 'lua':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/lua');
    case 'makefile':
      return import(
        'react-syntax-highlighter/dist/esm/languages/hljs/makefile'
      );
    case 'markdown':
      return import(
        'react-syntax-highlighter/dist/esm/languages/hljs/markdown'
      );
    case 'mathematica':
      return import(
        'react-syntax-highlighter/dist/esm/languages/hljs/mathematica'
      );
    case 'matlab':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/matlab');
    case 'maxima':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/maxima');
    case 'mel':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/mel');
    case 'mercury':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/mercury');
    case 'mipsasm':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/mipsasm');
    case 'mizar':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/mizar');
    case 'mojolicious':
      return import(
        'react-syntax-highlighter/dist/esm/languages/hljs/mojolicious'
      );
    case 'monkey':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/monkey');
    case 'moonscript':
      return import(
        'react-syntax-highlighter/dist/esm/languages/hljs/moonscript'
      );
    case 'n1ql':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/n1ql');
    case 'nginx':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/nginx');
    case 'nimrod':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/nimrod');
    case 'nix':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/nix');
    case 'nsis':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/nsis');
    case 'objectivec':
      return import(
        'react-syntax-highlighter/dist/esm/languages/hljs/objectivec'
      );
    case 'ocaml':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/ocaml');
    case 'openscad':
      return import(
        'react-syntax-highlighter/dist/esm/languages/hljs/openscad'
      );
    case 'oxygene':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/oxygene');
    case 'parser3':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/parser3');
    case 'perl':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/perl');
    case 'pf':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/pf');
    case 'pgsql':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/pgsql');
    case 'php':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/php');
    case 'txt':
    case 'plaintext':
      return import(
        'react-syntax-highlighter/dist/esm/languages/hljs/plaintext'
      );
    case 'pony':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/pony');
    case 'powershell':
      return import(
        'react-syntax-highlighter/dist/esm/languages/hljs/powershell'
      );
    case 'processing':
      return import(
        'react-syntax-highlighter/dist/esm/languages/hljs/processing'
      );
    case 'profile':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/profile');
    case 'prolog':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/prolog');
    case 'properties':
      return import(
        'react-syntax-highlighter/dist/esm/languages/hljs/properties'
      );
    case 'protobuf':
      return import(
        'react-syntax-highlighter/dist/esm/languages/hljs/protobuf'
      );
    case 'puppet':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/puppet');
    case 'purebasic':
      return import(
        'react-syntax-highlighter/dist/esm/languages/hljs/purebasic'
      );
    case 'python':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/python');
    case 'q':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/q');
    case 'qml':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/qml');
    case 'r':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/r');
    case 'reasonml':
      return import(
        'react-syntax-highlighter/dist/esm/languages/hljs/reasonml'
      );
    case 'rib':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/rib');
    case 'roboconf':
      return import(
        'react-syntax-highlighter/dist/esm/languages/hljs/roboconf'
      );
    case 'routeros':
      return import(
        'react-syntax-highlighter/dist/esm/languages/hljs/routeros'
      );
    case 'rsl':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/rsl');
    case 'ruby':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/ruby');
    case 'ruleslanguage':
      return import(
        'react-syntax-highlighter/dist/esm/languages/hljs/ruleslanguage'
      );
    case 'rust':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/rust');
    case 'sas':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/sas');
    case 'scala':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/scala');
    case 'scheme':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/scheme');
    case 'scilab':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/scilab');
    case 'scss':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/scss');
    case 'console':
    case 'shell':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/shell');
    case 'smali':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/smali');
    case 'smalltalk':
      return import(
        'react-syntax-highlighter/dist/esm/languages/hljs/smalltalk'
      );
    case 'sml':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/sml');
    case 'sqf':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/sqf');
    case 'sql':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/sql');
    case 'stan':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/stan');
    case 'stata':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/stata');
    case 'step21':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/step21');
    case 'stylus':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/stylus');
    case 'subunit':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/subunit');
    case 'swift':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/swift');
    case 'taggerscript':
      return import(
        'react-syntax-highlighter/dist/esm/languages/hljs/taggerscript'
      );
    case 'tap':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/tap');
    case 'tcl':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/tcl');
    case 'tex':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/tex');
    case 'thrift':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/thrift');
    case 'tp':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/tp');
    case 'twig':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/twig');
    case 'ts':
    case 'typescript':
      return import(
        'react-syntax-highlighter/dist/esm/languages/hljs/typescript'
      );
    case 'vala':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/vala');
    case 'vbnet':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/vbnet');
    case 'vbscriptHtml':
      return import(
        'react-syntax-highlighter/dist/esm/languages/hljs/vbscript-html'
      );
    case 'vbscript':
      return import(
        'react-syntax-highlighter/dist/esm/languages/hljs/vbscript'
      );
    case 'verilog':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/verilog');
    case 'vhdl':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/vhdl');
    case 'vim':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/vim');
    case 'x86asm':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/x86asm');
    case 'xl':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/xl');
    case 'xml':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/xml');
    case 'xquery':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/xquery');
    case 'yaml':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/yaml');
    case 'zephir':
      return import('react-syntax-highlighter/dist/esm/languages/hljs/zephir');
    default:
      console.error('Unknown language ' + language);
      return Promise.resolve(null);
  }
}
