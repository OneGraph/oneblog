// @flow

import React from 'react';
import './gifplayer.css';
import imageUrl from './imageUrl';
import base64Encode from './base64Encode';

export default function GifPlayer({src: origSrc, ...props}: {src: string}) {
  const [playing, setPlaying] = React.useState(false);
  const src = imageUrl({src: origSrc, firstFrame: !playing});

  return (
    <span
      className={'gif-player' + (playing ? ' playing' : '')}
      onClick={() => setPlaying(!playing)}>
      <span className="play-button" />
      <img {...props} src={src} />
    </span>
  );
}
