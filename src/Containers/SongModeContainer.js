import React, { Component } from 'react';
import { connect } from 'react-redux';
import Drawer from 'material-ui/Drawer';
import SongModePatternSelectContainer from './SongModePatternSelectContainer';
import SongBuilderContainer from './SongBuilderContainer';
import dragArrow from '../icons/arrowDragIndicator.svg';
import './SongModeContainer.css';

const styling = {
  top: '100px' //height of toolbar
};

class SongModeContainer extends Component {
  render() {
    return (
      <Drawer
        containerStyle={styling}
        width={'100%'}
        open={this.props.UiMode === 'song'}
      >
        <SongModePatternSelectContainer />
        <div
          // style={{
          //   display: 'flex',
          //   justifyContent: 'center',
          //   alignItems: 'center',
          //   margin: '0px'
          // }}
          className="song-mode__arrow-wrapper"
        >
          <img
            // style={{ width: '25px', height: '25px' }}
            src={dragArrow}
            alt="drag arrow"
          />
        </div>
        <SongBuilderContainer />
      </Drawer>
    );
  }
}

function mapStateToProps(state) {
  return {
    UiMode: state.UiMode
  };
}

export default connect(mapStateToProps)(SongModeContainer);
