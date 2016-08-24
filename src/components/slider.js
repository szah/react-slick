/* flow */
import React from 'react';
import sizeMe from 'react-sizeme';
import isNil from 'lodash/isNil';
import defaultProps from '../default-props';
import { InnerSlider } from '../inner-slider';
import { currentBreakpoint } from '../helpers/responsive';

type Props = {
  responsive: Boolean,
  size: Object,
  children: Function
}

const Slider = (props: Props) => {
  const { responsive, size, children } = props;

  const breakpoint = currentBreakpoint(size)(responsive);

  const breakpointSettings = breakpoint ?
    responsive.find(br => br.breakpoint === breakpoint).settings : {};

  const settings = {
    ...defaultProps,
    ...props,
    ...breakpointSettings,
  };

  const filteredChildren = children.filter(child => !isNil(child));

  return (
    <InnerSlider {...settings}>
      {filteredChildren}
    </InnerSlider>
  );
};

export default sizeMe()(Slider);
