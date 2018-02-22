import React, { Component } from 'react';
import { connect } from 'react-redux';
import Slider from 'material-ui/Slider';
import './Duration.css';
import MockTrigger from './MockTrigger';

class Duration extends Component {
  constructor(props) {
    super(props);

    let { sequencers, triggerBeingEditedId, sequencerBeingEditedId } = props;

    let currentDurationString =
      sequencers[sequencerBeingEditedId].triggers[triggerBeingEditedId]
        .duration;

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
    if (nextProps.triggerBeingEditedId) {
      this.setupDurationUI(nextProps);
    }
  }

  setupDurationUI = props => {
    const { sequencers, triggerBeingEditedId, sequencerBeingEditedId } = props;

    let isSlicee;
    let triggersToRender = [];

    if (
      !sequencers[sequencerBeingEditedId].triggers[triggerBeingEditedId]
        .isSliced
    ) {
      isSlicee = false;

      triggersToRender = triggersToRender.concat(
        sequencers[sequencerBeingEditedId].triggers[triggerBeingEditedId]
      );
    } else {
      isSlicee = true;
      triggersToRender = triggersToRender.concat(
        sequencers[sequencerBeingEditedId].triggers[triggerBeingEditedId]
          .slicedTriggers
      );
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
    let IValueNum = parseInt(durationStr.slice(0, durationStr.length - 1));

    return IValueNum / 192 * 100;
  };

  handleDragStop = (e, value) => {
    console.log('value in setNewDuration:  ', value);
    console.log('diddling id:  ', e.target.id);

    this.props.dispatch({ type: 'CHANGE_NOTE_DURATION' });
  };

  handleSliderChange = (e, value) => {
    console.log('diddling id:  ', e.target.id);
  };

  renderSliders = () => {
    const { triggersToRender, isSlicee, durationValAsPercentArr } = this.state;

    return (
      <div>
        {triggersToRender.map((trigger, index) => {
          return (
            <div key={index} className="duration-container">
              <MockTrigger
                barStarter={index % 4 === 0 ? true : false}
                isTriggered={trigger.isTriggered}
                id={index}
                isSlicee={isSlicee}
              />

              <Slider
                className={
                  'duration-slider ' +
                  (trigger.isTriggered ? '' : 'not-triggered')
                }
                min={0}
                max={100}
                disabled={!trigger.isTriggered}
                onDragStop={this.handleDragStop}
                defaultValue={durationValAsPercentArr[index]}
                onChange={this.handleSliderChange}
                step={1}
              />
              <div>Percentage text here</div>
            </div>
          );
        })}
      </div>
    );
  };

  render() {
    let { triggerBeingEditedId } = this.props;

    return (
      <div>
        <h1>Set Trigger Duration</h1>
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

export default connect(mapStateToProps)(Duration);
