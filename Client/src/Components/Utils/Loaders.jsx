import React from 'react';
import 'ldrs/tailspin';
import 'ldrs/ring';

const Loader = ({ size = "40", stroke = "5", speed = "2", color = "#2E93FF", bgOpacity = "0" }) => {
  return (
    <l-ring
      size={size}
      stroke={stroke}
      bg-opacity={bgOpacity}
      speed={speed}
      color={color}
    ></l-ring>
  );
};

export default Loader;
