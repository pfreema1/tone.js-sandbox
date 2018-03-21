import React from 'react';

const styling = {
  // width: '100px',
  // height: '70px',
  background: 'RGBA(26, 26, 26, 1.00)',
  border: '1px solid black',
  color: 'black',
  cursor: 'move',
  transition: 'all 0.5s',
  // margin: '15px',
  position: 'relative',
  borderRadius: '2px'
};

const SongModePatternView = ({
  patternName,
  patternHeight,
  patternWidth,
  arrayOfPositions,
  triggerWidth,
  triggerHeight
}) => {
  return (
    <div
      id={patternName}
      style={{
        ...styling,
        height: patternHeight + 'px',
        width: patternWidth + 'px'
      }}
    >
      {arrayOfPositions.map(pos => {
        return (
          <div
            style={{
              background: 'red',
              position: 'absolute',
              top: pos.top * 100 + '%',
              left: pos.left * 100 + '%',
              width: triggerWidth * 100 + '%',
              height: triggerHeight * 100 + '%',
              borderRadius: '2px'
            }}
          />
        );
      })}
    </div>
  );
};

export default SongModePatternView;
