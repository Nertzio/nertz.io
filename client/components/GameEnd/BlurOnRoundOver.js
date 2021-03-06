import React from 'react';
import {connect} from 'react-redux';
import {Blur} from '../Common';

const BlurOnRoundOver = ({ children, isRoundOver }) => {

  return (
    <Blur isActive={isRoundOver} strength={10}>
      {() => children}
    </Blur>
  )
}

const mapState = state => ({
  isRoundOver: state.game.isNertzCalled,
})

export default connect(mapState)(BlurOnRoundOver);
