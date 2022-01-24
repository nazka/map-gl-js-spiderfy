const defaultOptions = {
  maxLeaves: 255,
  minZoomLevel: 0,
  zoomIncrement: 2,
  closeOnLeafClick: true,
  circleSpiralSwitchover: 10,
  circleOptions: {
    leavesSeparation: 50,
    leavesOffset: [0, 0],
  },
  spiralOptions: {
    legLengthStart: 25,
    legLengthFactor: 2.2,
    leavesSeparation: 30,
    leavesOffset: [0, 0],
  },
  spiderLegsAreHidden: false,
  spiderLegsWidth: 1,
  spiderLegsColor: 'rgba(100, 100, 100, .7)',
  spiderLeavesLayout: null, // default is cluster style layout
  spiderLeavesPaint: null, // default is cluster style paint
}

export default defaultOptions;
