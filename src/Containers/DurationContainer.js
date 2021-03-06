import React, { Component } from 'react';
import { connect } from 'react-redux';
import './DurationContainer.css';
import DurationTriggerComponent from '../Components/DurationTriggerComponent';

class DurationContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      durationValAsPercentArr: [],
      triggersToRender: [],
      isSlicee: null
    };
  }

  componentDidMount() {
    this.setupDurationUI(this.props);
  }

  componentWillReceiveProps(nextProps) {
    // bugfix!  make sure to check =/!= to null instead of just checking falsy (id of 0 will make bugs!)
    if (nextProps.triggerBeingEditedId !== null) {
      this.setupDurationUI(nextProps);
    }
  }

  setupDurationUI = props => {
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

    //create array of duration values
    const durationValAsPercentArr = triggersToRender.map((trigger, index) => {
      return this.convertDurationStrToPercentNum(trigger.duration);
    });

    this.setState({
      durationValAsPercentArr: durationValAsPercentArr,
      triggersToRender: triggersToRender,
      isSlicee: isSlicee
    });
  };

  convertDurationStrToPercentNum = durationStr => {
    let IValueNum = parseInt(durationStr.slice(0, durationStr.length - 1), 10);

    return Math.round(IValueNum / 192 * 100);
  };

  // function sig:  function(event: object) => void
  // binded value and triggerId (prepended)
  handleDragStop = (value, triggerId, e) => {
    // convert value to duration string
    let newDurationStr = Math.round(value * 0.01 * 192) + 'i';

    this.props.dispatch({
      type: 'CHANGE_NOTE_DURATION',
      triggerId: triggerId,
      newDurationStr: newDurationStr,
      isSlicee: this.state.isSlicee,
      parentTriggerId: this.props.triggerBeingEditedId
    });
  };

  // function sig:  function(event: object, newValue: number) => void
  // binded triggerId (its prepended)
  handleSliderChange = (triggerId, e, value) => {
    let newDurationArr = [...this.state.durationValAsPercentArr];

    newDurationArr[triggerId] = value;

    this.setState({
      durationValAsPercentArr: newDurationArr
    });
  };

  render() {
    const { triggersToRender, isSlicee, durationValAsPercentArr } = this.state;
    return (
      <div>
        {/* <h1>Set Trigger Duration</h1> */}
        <div>
          {triggersToRender.map((trigger, index) => {
            return (
              <DurationTriggerComponent
                key={index}
                index={index}
                isTriggered={trigger.isTriggered}
                isSlicee={isSlicee}
                handleDragStop={this.handleDragStop}
                durationValAsPercentArr={durationValAsPercentArr}
                triggerBeingEditedId={this.props.triggerBeingEditedId}
                handleSliderChange={this.handleSliderChange}
              />
            );
          })}
        </div>
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

export default connect(mapStateToProps)(DurationContainer);
