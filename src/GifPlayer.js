// @flow

import React from 'react';
import './gifplayer.css';

export default function GifPlayer({src: origSrc, ...props}: {src: string}) {
  const [playing, setPlaying] = React.useState(false);
  const src = playing
    ? `/image-proxy/${encodeURIComponent(origSrc)}`
    : `/first-frame/${encodeURIComponent(origSrc)}`;

  return (
    <span
      className={'gif-player' + (playing ? ' playing' : '')}
      onClick={() => setPlaying(!playing)}>
      <span className="play-button" />
      <img {...props} src={src} />
    </span>
  );
}
