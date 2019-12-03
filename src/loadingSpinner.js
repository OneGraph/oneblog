import React from 'react';

const svg = props => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    preserveAspectRatio="xMidYMid"
    style={{background: 'none'}}
    {...props}>
    <circle
      cx="50"
      cy="50"
      fill="none"
      stroke="#82bbe4"
      strokeWidth="8"
      r="24"
      strokeDasharray="112 40"
      transform="rotate(138.553 50 50)">
      <animateTransform
        attributeName="transform"
        type="rotate"
        calcMode="linear"
        values="0 50 50;360 50 50"
        keyTimes="0;1"
        dur="1s"
        begin="0s"
        repeatCount="indefinite"></animateTransform>
    </circle>
  </svg>
);

export default svg;
