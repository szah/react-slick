import React, { Component } from 'react';
import {InnerSlider} from './inner-slider';
import defaultProps from './default-props';
import SizeMe from 'react-sizeme';
import compose from 'lodash/partialRight';
import assign from 'lodash/assign';

// getCurrentBreakpoint :: Number => Array<Object> | Null => Number
const getCurrentBreakpoint = size => breakpoints => {
  if (Array.isArray(breakpoints)) {
    return breakpoints.reduce((acc, val) => {
      if (val < size.width && val > acc) {
        return val;
      }
      return acc;
    }, 0);
  }

  return null;
};

// getBreakpoints :: Array | Null => Array<Object> | Null
const getBreakpoints = responsive => {
  if (Array.isArray(responsive)) {
    return responsive.map(resp => resp.breakpoint);
  }

  return null;
};

const currentBreakpoint = size => compose(getCurrentBreakpoint(size), getBreakpoints);

const Slider = props => {
  const { responsive, size, children } = props;

  const breakpoint = currentBreakpoint(size)(responsive);

  const breakpointSettings = breakpoint ?
    responsive.find(br => br.breakpoint === breakpoint).settings : {};

  const settings = assign({}, defaultProps, props, breakpointSettings);
  const filteredChildren = children.filter(child => child !== void(0) && child !== null);

  return (
    <InnerSlider {...settings}>
      {filteredChildren}
    </InnerSlider>
  )
};

export default SizeMe()(Slider);
