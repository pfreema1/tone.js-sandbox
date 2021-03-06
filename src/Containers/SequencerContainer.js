import React, { Component } from 'react';
import { connect } from 'react-redux';
import Trigger from './Trigger';
import { ContextMenuTrigger } from 'react-contextmenu';
import '../react-contextmenu.css';
import './SequencerContainer.css';
import SequencerComponent from '../Components/SequencerComponent';
import { Tooltip } from 'react-tippy';
import TriggerHoverComponent from '../Components/TriggerHoverComponent';

/*****************************/

class SequencerContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isEditingTrigger: false,
      menuItemClicked: null
    };
  }

  handleMenuItemClick = (id, itemNum, e) => {
    let triggerBeingEditedId = id;

    this.setState({ isEditingTrigger: true, menuItemClicked: itemNum });

    this.props.dispatch({
      type: 'EDITING_TRIGGER',
      isEditingTrigger: true,
      triggerBeingEditedId: triggerBeingEditedId,
      sequencerBeingEditedId: this.props.sequencerId
    });
  };

  handleDialogClose = () => {
    this.setState({ isEditingTrigger: false });

    this.props.dispatch({
      type: 'EDITING_TRIGGER',
      isEditingTrigger: false,
      triggerBeingEditedId: null,
      sequencerBeingEditedId: null
    });
  };

  handleSliceMenuItemClick = (id, e) => {
    console.log('sliced!');

    let triggerBeingEditedId = id;

    this.props.dispatch({
      type: 'TRIGGER_SLICED',
      isEditingTrigger: false,
      triggerBeingEditedId: triggerBeingEditedId,
      sequencerBeingEditedId: this.props.sequencerId
    });
  };

  handleUnSliceMenuItemClick = (id, e) => {
    let triggerBeingEditedId = id;

    this.props.dispatch({
      type: 'TRIGGER_UNSLICED',
      triggerBeingEditedId: triggerBeingEditedId,
      sequencerBeingEditedId: this.props.sequencerId
    });
  };

  returnSlicedTriggers = trigger => {
    //get how many triggers we need
    let numOfSlicedTriggers =
      this.props.sequencers[this.props.sequencerId].triggers[trigger.id]
        .sliceAmount * 4;
    let arrayOfWidths = [];
    let heightStr = 100 / (numOfSlicedTriggers / 2) + '%';

    for (let i = 0; i < numOfSlicedTriggers; i++) {
      arrayOfWidths.push(Math.floor(100 / (numOfSlicedTriggers / 2)));
    }

    return (
      <ContextMenuTrigger
        key={trigger.id}
        id={'triggerMenu' + this.props.sequencerId}
        //this is passed in as data to MenuItem
        attributes={{ id: trigger.id }}
        collect={props => props}
        holdToDisplay={1000}
        disable={true}
      >
        <Tooltip
          html={
            <TriggerHoverComponent
              handleMenuItemClick={this.handleMenuItemClick}
              handleSliceMenuItemClick={this.handleSliceMenuItemClick}
              handleUnSliceMenuItemClick={this.handleUnSliceMenuItemClick}
              triggerId={trigger.id}
            />
          }
          position="bottom"
          trigger="mouseenter"
          interactive="true"
          unmountHTMLWhenHide="true"
          hideOnClick="false"
        >
          <div className="sequencer__sliced-trigger-container">
            {arrayOfWidths.map((width, index) => {
              let widthStr = width + '%';

              return (
                <Trigger
                  sequencerId={this.props.sequencerId}
                  parentTriggerId={trigger.id}
                  id={index}
                  key={index}
                  width={widthStr}
                  height={heightStr}
                  isSlicee={true}
                  barStarter={index % 4 === 0 ? true : false}
                />
              );
            })}
          </div>
        </Tooltip>
      </ContextMenuTrigger>
    );
  };

  returnTriggersToRender = sequencerToRender => {
    let triggerStartIndex = this.props.currentPatternIndex * 16;
    let triggerEndIndex = triggerStartIndex + 16;

    return sequencerToRender.triggers.filter(trigger => {
      return trigger.id >= triggerStartIndex && trigger.id < triggerEndIndex;
    });
  };

  render() {
    let sequencerToRender = this.props.sequencers[this.props.sequencerId];

    if (!sequencerToRender) {
      return null;
    }

    return (
      <SequencerComponent
        sequencerId={this.props.sequencerId}
        sequencerToRender={sequencerToRender}
        handleMenuItemClick={this.handleMenuItemClick}
        handleSliceMenuItemClick={this.handleSliceMenuItemClick}
        handleUnSliceMenuItemClick={this.handleUnSliceMenuItemClick}
        isEditingTrigger={this.state.isEditingTrigger}
        handleDialogClose={this.handleDialogClose}
        menuItemClicked={this.state.menuItemClicked}
        returnSlicedTriggers={this.returnSlicedTriggers}
        currentPatternIndex={this.props.currentPatternIndex}
        triggersToRender={this.returnTriggersToRender(sequencerToRender)}
      />
    );
  }
}

/*****************************/

const mapStateToProps = state => {
  return {
    sequencers: state.sequencers,
    currentPatternIndex: state.currentPatternIndex
  };
};

export default connect(mapStateToProps)(SequencerContainer);
