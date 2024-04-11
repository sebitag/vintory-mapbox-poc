import * as React from 'react';

function Pin({ size = 20 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        backgroundColor: '#3366ff90',
        borderRadius: 10,
        cursor: 'pointer',
      }}
    />
  );
}

export default React.memo(Pin);
