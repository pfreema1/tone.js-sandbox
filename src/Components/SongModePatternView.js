import React from 'react';

const styling = {
  width: '100px',
  height: '70px',
  background: 'white',
  border: '1px solid black',
  color: 'black',
  cursor: 'move'
};

const SongModePatternView = ({ patternName }) => {
  return <div style={styling}>{patternName}</div>;
};

export default SongModePatternView;
