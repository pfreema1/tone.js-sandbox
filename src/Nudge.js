import React, { Component } from 'react';
import { connect } from 'react-redux';
import './Nudge.css';
import MockTriggerContainer from './Containers/MockTriggerContainer';
import NudgeSliderComponent from './Components/NudgeSliderComponent';

class Nudge extends Component {
  constructor(props) {
    super(props);

    this.state = {
      nudgeValueArr: [],
      triggersToRender: [],
      isSlicee: null
    };

    this.totalNudgeRange = this.returnTotalNudgeRange(props);
  }

  componentDidMount() {
    this.setupNudgeUI(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.triggerBeingEditedId !== null) {
      this.setupNudgeUI(nextProps);
    }
  }

  returnTotalNudgeRange = props => {
    const { sequencers, triggerBeingEditedId, sequencerBeingEditedId } = props;
    const parentTrigger =
      sequencers[sequencerBeingEditedId].triggers[triggerBeingEditedId];

    const numOfSlices = 4 * parentTrigger.sliceAmount;

    if (numOfSlices === 0) {
      // trigger is not sliced
      //subtracting 2 because we don't want to be able to trigger on top of previous/next trigger
      return 48 * 2 - 2;
    } else {
      return 48 / numOfSlices * 2 - 2;
    }
  };

  setupNudgeUI = props => {
    const { sequencers, triggerBeingEditedId, sequencerBeingEditedId } = props;
    const parentTrigger =
      sequencers[sequencerBeingEditedId].triggers[triggerBeingEditedId];

    let isSlicee;
    let triggersToRender = [];

    if (!parentTrigger.isSliced) {
      isSlicee = false;
      triggersToRender = triggersToRender.concat(parentTrigger);
    } else {
      isSlicee = true;
      triggersToRender = triggersToRender.concat(parentTrigger.slicedTriggers);
    }

    //create array of nudge values
    const nudgeValueArr = triggersToRender.map((trigger, index) => {
      return trigger.nudgeValue;
    });

    this.setState({
      nudgeValueArr: nudgeValueArr,
      triggersToRender: triggersToRender,
      isSlicee: isSlicee
    });
  };

  // function sig:  function(event: object) => void
  // binded value and triggerId (prepended)
  handleDragStop = (value, triggerId, e) => {
    this.props.dispatch({
      type: 'CHANGE_NOTE_NUDGE',
      triggerId,
      nudgeValue: value,
      isSlicee: this.state.isSlicee,
      parentTriggerId: this.props.triggerBeingEditedId
    });
  };

  // function sig:  function(event: object, newValue: number) => void
  // binded triggerId (its prepended)
  handleSliderChange = (triggerId, e, value) => {
    let newNudgeArr = [...this.state.nudgeValueArr];

    newNudgeArr[triggerId] = value;

    this.setState({
      nudgeValueArr: newNudgeArr
    });
  };

  renderSliders = () => {
    const { triggersToRender, isSlicee, nudgeValueArr } = this.state;
    const { triggerBeingEditedId } = this.props;
    let sliderMinValue;

    return (
      <div>
        {triggersToRender.map((trigger, index) => {
          if (triggerBeingEditedId === 0 && index === 0) {
            sliderMinValue = 0;
          } else {
            sliderMinValue = this.totalNudgeRange / 2 * -1;
          }

          return (
            <div key={index} className="nudge-container">
              <MockTriggerContainer
                barStarter={index % 4 === 0 ? true : false}
                isTriggered={trigger.isTriggered}
                id={index}
                isSlicee={isSlicee}
              />

              <NudgeSliderComponent
                isTriggered={trigger.isTriggered}
                sliderMinValue={sliderMinValue}
                totalNudgeRange={this.totalNudgeRange}
                isSlicee={isSlicee}
                handleDragStop={this.handleDragStop}
                nudgeValueArr={nudgeValueArr}
                index={index}
                triggerBeingEditedId={triggerBeingEditedId}
                handleSliderChange={this.handleSliderChange}
              />
              <div
                className={
                  'nudge-percentage-container ' +
                  (trigger.isTriggered ? '' : 'not-triggered')
                }
              >
                {nudgeValueArr[index]}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  render() {
    return (
      <div>
        <h1>Set Nudge Amount</h1>
        {this.renderSliders()}
      </div>
    );
  }
}

/*****************************/

const mapStateToProps = state => {
  return {
    sequencers: state.sequencers,
    triggerBeingEditedId: state.triggerBeingEditedId,
    sequencerBeingEditedId: state.sequencerBeingEditedId
  };
};

export default connect(mapStateToProps)(Nudge);
