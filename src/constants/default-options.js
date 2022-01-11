const defaultOptions = {
  type: 'layer',
  maxLeaves: 255,
  circleSpiralSwitchover: 10,
  circleOptions: {
    distanceBetweenPoints: 50,
    leavesOffset: [0, 0],
  },
  spiralOptions: {
    legLengthStart: 25,
    legLengthFactor: 2,
    leavesSeparation: 30,
    leavesOffset: [0, 0],
  },
  spiderLegsAreVisible: true,
  spiderLegsWidth: 1,
  spiderLegsColor: 'rgba(100, 100, 100, .7)',
  spiderLeavesLayout: null, // default is cluster style layout
  spiderLeavesPaint: null, // default is cluster style paint
}

export default defaultOptions;
