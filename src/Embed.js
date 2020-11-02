// @flow

// Version of https://github.com/streamich/react-embed that also renders on the server

import React from 'react';
import ReactPlayer from 'react-player/lazy';

type Uri = {
  url: string,
  hostname: string,
  pathname: string,
  search: string,
  hash: string,
};

function parseUrl(url: string): Uri | null {
  try {
    const {hostname, pathname, search, hash} = new URL(url);
    return {
      url,
      hostname,
      pathname,
      search,
      hash,
    };
  } catch (error) {
    console.error('Unable to parse url', url);
    return null;
  }
}

function Tweet({id, fallback}: {id: string, fallback: React$Element<any>}) {
  const ref = React.useRef();
  const [renderFallback, setRenderFallback] = React.useState(true);
  React.useEffect(() => {
    let canceled = false;
    import('scriptjs').then(({default: scriptjs}) => {
      scriptjs('https://platform.twitter.com/widgets.js', 'tw', () => {
        if (!canceled) {
          try {
            window.twttr.widgets.createTweet(id, ref.current).then(() => {
              setRenderFallback(false);
            });
          } catch (e) {
            console.error(e);
          }
        }
      });
    });
    return () => {
      canceled = true;
    };
  }, [id, setRenderFallback]);
  return (
    <div ref={ref} style={{maxWidth: '100%'}}>
      {renderFallback ? fallback : null}
    </div>
  );
}

function YouTube({uri, fallback}) {
  let videoId;

  const searchMatch = uri.search.match(/v=([^&]+)(&|$)/);
  const urlMatch = uri.pathname.replace('/', '');

  if (searchMatch) {
    videoId = searchMatch[1];
  } else if (urlMatch) {
    videoId = urlMatch;
  }

  if (!videoId) {
    return fallback;
  }

  return (
    <iframe
      title={uri.url}
      type="text/html"
      width="100%"
      height="360"
      src={`https://www.youtube.com/embed/${videoId}`}
      frameBorder="0"></iframe>
  );
}

function SoundCloud({uri}) {
  return (
    <iframe
      title={uri.url}
      width="100%"
      height="200"
      scrolling="no"
      frameBorder="no"
      style={{margin: 0, padding: 0}}
      src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(
        uri.url,
      )}`}
    />
  );
}

function JsFiddle({uri, fallback}) {
  const steps = uri.pathname.split('/');
  if (steps.length < 2) {
    return fallback;
  }

  let id = steps[1];
  if (steps[2]) {
    id += `/${steps[2]}`;
  }

  return (
    <iframe
      title={uri.url}
      width="100%"
      height="400"
      src={`https://jsfiddle.net/${id}/embedded/result/`}
      frameBorder="0"
      allowFullScreen
    />
  );
}

function Imgur({id, uri, fallback}) {
  const src = `https://imgur.com/a/${id}/embed?pub=true&w=340`;
  const [height, setHeight] = React.useState(250);
  React.useEffect(() => {
    function onMessage({data}) {
      try {
        const json = JSON.parse(data);
        if (json.message !== 'resize_imgur') return;
        if (typeof json.href !== 'string') return;
        if (json.href !== src) return;
        if (typeof json.height !== 'number') return;
        setHeight(json.height);
      } catch {}
    }
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [src, setHeight]);
  return (
    <div style={{border: '1px solid #E5E9F2', borderRadius: '8px'}}>
      <iframe
        title={uri.url}
        scrolling="no"
        frameBorder="0"
        src={src}
        style={{
          width: '100%',
          display: 'block',
          overflow: 'hidden',
          borderRadius: '8px',
          height,
        }}
      />
    </div>
  );
}

function Instagram({uri}) {
  const src = uri.url.endsWith('/') ? `${uri.url}embed` : `${uri.url}/embed`;
  return (
    <div style={{border: '1px solid #E5E9F2', borderRadius: '8px'}}>
      <iframe
        title={uri.url}
        width="320"
        height="460"
        src={src}
        style={{borderRadius: '8px'}}
        frameBorder="0"></iframe>
    </div>
  );
}

function Gist({id, uri, fallback}) {
  const fileArg = uri.hash ? `?file=${uri.hash.substr(1)}` : '';
  const scriptUrl = `https://gist.github.com/${id}.js${fileArg}`;

  const ref = React.useRef<HTMLIFrameElement | null>(null);
  const [iframeId] = React.useState(String(Math.random()));
  React.useEffect(() => {
    const iframe = ref.current;
    if (!iframe) {
      return;
    }
    const doc: Document =
      // $FlowFixMe
      iframe.document ||
      iframe.contentDocument ||
      // $FlowFixMe
      iframe.contentWidow?.document;
    if (!doc) {
      return;
    }
    const iframeHtml = `
      <html>
        <head>
          <base target="_parent">
        </head>
        <body style="margin:0" onload="parent.document.getElementById('${iframe.id}').style.height=document.body.querySelector('.gist').scrollHeight + 'px'">
          <script type="text/javascript" src="${scriptUrl}"></script>
        </body>
      </html>`;
    doc.open();
    doc.writeln(iframeHtml);
    doc.close();
  }, [scriptUrl, uri]);
  return (
    <iframe
      title={uri.url}
      id={iframeId}
      ref={ref}
      width="100%"
      scrolling="no"
      frameBorder={0}
    />
  );
}

function Replit({uri, fallback}) {
  const steps = uri.pathname.split('/');
  if (steps.length !== 3) {
    return null;
  }
  const id = `${steps[1]}/${steps[2]}`;

  return (
    <iframe
      title={uri.url}
      height="700px"
      width="100%"
      frameBorder="no"
      allowFullScreen
      src={`https://repl.it/${id}?lite=true`}
      scrolling="no"
    />
  );
}

function Figma({uri}) {
  return (
    <div style={{border: '1px solid #E5E9F2', borderRadius: 8, width: '100%'}}>
      <iframe
        title={uri.url}
        style={{borderRadius: 8}}
        src={`https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(
          uri.url,
        )}`}
        width="100%"
        height="450"
        frameBorder="0"
        allowFullScreen
      />
    </div>
  );
}

const latlngRegex = /@([-0-9.]+),([-0-9.]+)(?:[^-0-9.]|$)/;

function GoogleMaps({uri, fallback}) {
  const matches = uri.url.match(latlngRegex);
  if (!matches) {
    return fallback;
  }
  // eslint-disable-next-line no-unused-vars
  const [omit, lat, lng] = matches;
  return (
    <div style={{borderRadius: 8, width: '100%'}}>
      <iframe
        title={uri.url}
        width="100%"
        height="360"
        style={{borderRadius: 8}}
        frameborder="0"
        allowFullScreen
        src={`https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d21948.472927059174!2d${encodeURIComponent(
          lng,
        )}!3d${encodeURIComponent(
          lat,
        )}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sch!4v1551898961513`}
      />
    </div>
  );
}

function Google({uri, fallback}) {
  const steps = uri.pathname.split('/');
  if (steps[1] === 'maps' && steps.length <= 3) {
    return <GoogleMaps uri={uri} fallback={fallback} />;
  }
  return fallback;
}

function Gfycat({uri, fallback}) {
  const steps = uri.pathname.split('/');
  if (steps.length < 2) {
    return fallback;
  }
  if (!steps[1] || typeof steps[1] !== 'string') {
    return fallback;
  }
  const slugs = steps[1].split('-');
  const id = slugs[0];
  return (
    <iframe
      title={uri.url}
      src={`https://gfycat.com/ifr/${id}`}
      width="100%"
      height="500px"
      frameBorder="0"
      scrolling="no"
      allowFullScreen
    />
  );
}

const AUDIO_EXTENSIONS = /\.(m4a|mp4a|mpga|mp2|mp2a|mp3|m2a|m3a|wav|weba|aac|oga|spx)($|\?)/i;

function defaultBlock(uri) {
  if (ReactPlayer.canPlay(uri.url)) {
    const isAudio = AUDIO_EXTENSIONS.test(uri.url);
    return (
      <ReactPlayer
        width="100%"
        height={isAudio ? 64 : 360}
        controls={true}
        url={uri.url}
      />
    );
  }
  return null;
}

function blockForUri(uri: Uri, fallback: React$Element<any>) {
  switch (uri.hostname) {
    case 'twitter.com': {
      const segments = uri.pathname.split('/');
      const id = segments[segments.length - 1];
      if (id) {
        return <Tweet id={id} fallback={fallback} />;
      }
      return defaultBlock(uri);
    }
    case 'www.youtube.com':
    case 'youtu.be':
    case 'youtube.com':
      return <YouTube uri={uri} fallback={fallback} />;
    case 'soundcloud.com':
      return <SoundCloud uri={uri} />;
    case 'jsfiddle.net':
      return <JsFiddle uri={uri} fallback={fallback} />;
    case 'imgur.com': {
      if (typeof window === 'undefined') {
        return null;
      }
      const matches = uri.url.match(/\/(?:a|gallery)\/([^/]+)(?:\/|$)/);
      if (matches) {
        return <Imgur uri={uri} id={matches[1]} fallback={fallback} />;
      }
      return defaultBlock(uri);
    }
    case 'www.instagram.com':
      return <Instagram uri={uri} fallback={fallback} />;

    case 'gist.github.com': {
      const steps = uri.pathname.split('/');
      if (steps.length < 3) {
        return defaultBlock(uri);
      }
      return <Gist id={steps[2]} uri={uri} fallback={fallback} />;
    }
    case 'repl.it':
      return <Replit uri={uri} fallback={fallback} />;
    case 'www.figma.com':
      return <Figma uri={uri} fallback={fallback} />;
    case 'www.google.com':
      return <Google uri={uri} fallback={fallback} />;
    case 'gfycat.com':
      return <Gfycat uri={uri} fallback={fallback} />;
    default:
      return defaultBlock(uri);
  }
}

export default function Embed({
  url,
  fallback,
  renderVoid,
  renderWrap,
}: {
  url: string,
  fallback: React$Element<any>,
  renderVoid: () => React$Element<any>,
  renderWrap: (children: any) => React$Element<any>,
}) {
  const uri = parseUrl(url);
  if (!uri) {
    return renderVoid();
  }
  const block = blockForUri(uri, fallback);
  if (!block) {
    return renderVoid();
  }
  return renderWrap(block);
}
