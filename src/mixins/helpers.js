'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactTransitionEvents from 'react/lib/ReactTransitionEvents';
import {getTrackCSS, getTrackLeft, getTrackAnimateCSS} from './trackHelper';
import assign from 'object-assign';

const nodeListToArray = nodeList => Array.prototype.slice.call(nodeList);
const getNestedImages = containerElem => ReactDOM.findDOMNode(containerElem).querySelectorAll('img');

var helpers = {
  _loadedImgCount: 0,
  initialize: function (props) {
    var slideCount = React.Children.count(props.children);
    var slideList = ReactDOM.findDOMNode(this.refs.list);
    var listWidth = this.getWidth(slideList);
    var trackWidth = this.getWidth(ReactDOM.findDOMNode(this.refs.track));
    var slideWidth = 0;
    if (props.centerMode && props.centerSingleImg) {
      slideWidth = this.getActiveImageWidth() + this.props.centerImgPaddings * 2;
    } else {
      slideWidth = (listWidth - this.getPaddings(slideList)) / props.slidesToShow;
    }

    var currentSlide = props.rtl ? slideCount - 1 - props.initialSlide : props.initialSlide;

    this.setState({
      slideCount: slideCount,
      slideWidth: slideWidth,
      listWidth: listWidth,
      trackWidth: trackWidth,
      currentSlide: currentSlide,
      _isMounted: true,
      activeSlideImageWidth: this.getActiveImageWidth(),
      activeSlideImageHeight: this.getActiveImageHeight()
    }, function () {

      var targetLeft = getTrackLeft(assign({
        slideIndex: this.state.currentSlide,
        trackRef: this.refs.track
      }, props, this.state));
      // getCSS function needs previously set state
      var trackStyle = getTrackCSS(assign({left: targetLeft}, props, this.state));

      this.setState({
        trackStyle: trackStyle
      });

      this.autoPlay(); // once we're set up, trigger the initial autoplay.
    });
  },
  update: function (props) {
    // This method has mostly same code as initialize method.
    // Refactor it
    var slideCount = React.Children.count(props.children);
    var slideList = ReactDOM.findDOMNode(this.refs.list);
    var listWidth = this.getWidth(slideList);
    var trackWidth = this.getWidth(ReactDOM.findDOMNode(this.refs.track));
    var slideWidth = 0;
    if (props.centerMode && props.centerSingleImg) {
      slideWidth = this.getActiveImageWidth() + this.props.centerImgPaddings * 2;
    } else if (typeof props.slideListPadding !== 'undefined') {
      slideWidth = (this.getWidth(ReactDOM.findDOMNode(slideList)) - props.slideListPadding * 2)/props.slidesToShow;
    } else {
      slideWidth = this.getWidth(ReactDOM.findDOMNode(slideList))/props.slidesToShow;
    }


    // pause slider if autoplay is set to false
    if(!props.autoplay)
      this.pause();

    this.setState({
      slideCount: slideCount,
      slideWidth: slideWidth,
      listWidth: listWidth,
      trackWidth: trackWidth,
      activeSlideImageWidth: this.getActiveImageWidth(),
      activeSlideImageHeight: this.getActiveImageHeight()
    }, function () {

      var targetLeft = getTrackLeft(assign({
        slideIndex: this.state.currentSlide,
        trackRef: this.refs.track
      }, props, this.state));
      // getCSS function needs previously set state
      var trackStyle = getTrackCSS(assign({left: targetLeft}, props, this.state));

      this.setState({trackStyle: trackStyle});
    });
  },
  getWidth: function getWidth(elem) {
    return elem.getBoundingClientRect().width || elem.offsetWidth;
  },
  getPaddings: function (elem) {
    return parseFloat(getComputedStyle(ReactDOM.findDOMNode(elem)).paddingLeft) +
      parseFloat(getComputedStyle(ReactDOM.findDOMNode(elem)).paddingRight);
  },
  onImageLoad: function (callback) {
    this._loadedImgCount = 0;
    const imgEls = nodeListToArray(getNestedImages(this));
    const loadedImages = imgEls.filter(el => el.complete && el.naturalWidth !== 0 && el.naturalHeight !== 0);

    if (loadedImages.length < imgEls.length) {
      imgEls.forEach(el => {
        el.onload = () => {
          this._loadedImgCount += 1;
          if (this._loadedImgCount === (imgEls.length - loadedImages.length)) {
            callback();
            this.setState({
              isImagesLoaded: true
            })
          }
        }
      });
    } else {
      callback();
      this.setState({
        isImagesLoaded: true
      })
    }
  },
  adaptHeight: function () {
    if (this.props.adaptiveHeight) {
      var selector = '[data-index="' + this.state.currentSlide +'"]';
      if (this.refs.list) {
        var slickList = ReactDOM.findDOMNode(this.refs.list);
        slickList.style.height = slickList.querySelector(selector).offsetHeight + 'px';
      }
    }
  },
  getCurrentSlide: function () {
    var selector = '[data-index="' + this.state.currentSlide +'"]';
    var slickList = ReactDOM.findDOMNode(this.refs.list);
    return slickList.querySelector(selector);
  },
  getCurrentSlideImg: function () {
    var selector = '[data-index="' + this.state.currentSlide +'"] img';
    var slickList = ReactDOM.findDOMNode(this.refs.list);
    return slickList.querySelector(selector);
  },
  getActiveImageHeight: function () {
    if (this.refs.list) {
      return this.getCurrentSlideImg() && this.getCurrentSlideImg().getBoundingClientRect().height ||
        this.getCurrentSlideImg() && this.getCurrentSlideImg().naturalHeight ||
        this.getCurrentSlide() && this.getCurrentSlide().getBoundingClientRect().height;
    }
    return 0;
  },
  getActiveImageWidth: function () {
    if (this.refs.list) {
      return this.getCurrentSlideImg() && this.getCurrentSlideImg().getBoundingClientRect().width ||
        this.getCurrentSlideImg() && this.getCurrentSlideImg().naturalWidth ||
        this.getCurrentSlide() && this.getCurrentSlide().getBoundingClientRect().width ||
          0;
    }
    return 0;
  },
  slideHandler: function (index) {
    // Functionality of animateSlide and postSlide is merged into this function
    // console.log('slideHandler', index);
    var targetSlide, currentSlide;
    var targetLeft, currentLeft;
    var callback;

    if (this.props.waitForAnimate && this.state.animating) {
      return;
    }
    this.pause();
    targetSlide = index;
    if (targetSlide < 0) {
      if(this.props.infinite === false) {
        currentSlide = 0;
      } else if (this.state.slideCount % this.props.slidesToScroll !== 0) {
        currentSlide = this.state.slideCount - (this.state.slideCount % this.props.slidesToScroll);
      } else {
        currentSlide = this.state.slideCount + targetSlide;
      }
    } else if (targetSlide >= this.state.slideCount) {
      if(this.props.infinite === false) {
        currentSlide = this.state.slideCount - this.props.slidesToShow;
      } else if (this.state.slideCount % this.props.slidesToScroll !== 0) {
        currentSlide = 0;
      } else {
        currentSlide = targetSlide - this.state.slideCount;
      }
    } else {
      currentSlide = targetSlide;
    }

    targetLeft = getTrackLeft(assign({
      slideIndex: targetSlide,
      trackRef: this.refs.track
    }, this.props, this.state));

    currentLeft = getTrackLeft(assign({
      slideIndex: currentSlide,
      trackRef: this.refs.track
    }, this.props, this.state));

    if (this.props.infinite === false) {
      targetLeft = currentLeft;
    }

    if (this.props.beforeChange) {
      this.props.beforeChange(this.state.currentSlide, currentSlide);
    }

    if (this.props.lazyLoad) {
      var loaded = true;
      var slidesToLoad = [];
      for (var i = targetSlide; i < targetSlide + this.props.slidesToShow; i++ ) {
        loaded = loaded && (this.state.lazyLoadedList.indexOf(i) >= 0);
        if (!loaded) {
          slidesToLoad.push(i);
        }
      }
      if (!loaded) {
        this.setState({
          lazyLoadedList: this.state.lazyLoadedList.concat(slidesToLoad)
        });
      }
    }

    // Slide Transition happens here.
    // animated transition happens to target Slide and
    // non - animated transition happens to current Slide
    // If CSS transitions are false, directly go the current slide.

    if (this.props.useCSS === false) {

      this.setState({
        currentSlide: currentSlide,
        trackStyle: getTrackCSS(assign({left: currentLeft}, this.props, this.state))
      }, function () {
        if (this.props.afterChange) {
          this.props.afterChange(currentSlide);
        }
      });

    } else {

      var nextStateChanges = {
        animating: false,
        currentSlide: currentSlide,
        trackStyle: getTrackCSS(assign({left: currentLeft}, this.props, this.state)),
        swipeLeft: null
      };

      callback = () => {
        const timeOffset = +new Date() - this.date;
        if (timeOffset < this.props.speed - 100) {
          if (this.props.devMode === true) {
            console.warn(`react-slick: animation is was interrupted: should be ${this.props.speed}, but was ${timeOffset}`)
          }
          return false;
        }
        this.setState(nextStateChanges);
        if (this.props.afterChange) {
          this.props.afterChange(currentSlide);
        }
        ReactTransitionEvents.removeEndEventListener(ReactDOM.findDOMNode(this.refs.track), callback);
      };
      this.date = +new Date();
      this.setState({
        animating: true,
        currentSlide: currentSlide,
        trackStyle: getTrackAnimateCSS(assign({left: targetLeft}, this.props, this.state))
      }, function () {
        ReactTransitionEvents.addEndEventListener(ReactDOM.findDOMNode(this.refs.track), callback);
      });

    }
    if (!this.state.paused) {
      this.autoPlay();
    }
  },
  swipeDirection: function (touchObject) {
    var xDist, yDist, r, swipeAngle;

    xDist = touchObject.startX - touchObject.curX;
    yDist = touchObject.startY - touchObject.curY;
    r = Math.atan2(yDist, xDist);

    swipeAngle = Math.round(r * 180 / Math.PI);
    if (swipeAngle < 0) {
        swipeAngle = 360 - Math.abs(swipeAngle);
    }
    if ((swipeAngle <= 45) && (swipeAngle >= 0) || (swipeAngle <= 360) && (swipeAngle >= 315)) {
        return (this.props.rtl === false ? 'left' : 'right');
    }
    if ((swipeAngle >= 135) && (swipeAngle <= 225)) {
        return (this.props.rtl === false ? 'right' : 'left');
    }

    return 'vertical';
  },
  autoPlay: function () {
    if (this.state.autoPlayTimer) {
      return;
    }
    var play = () => {
      if (this.state.mounted) {
        const nextIndex = this.props.rtl ?
          this.state.currentSlide - this.props.slidesToScroll :
          this.state.currentSlide + this.props.slidesToScroll;
        this.slideHandler(nextIndex);
      }
    };
    if (this.props.autoplay) {
      this.setState({
        autoPlayTimer: window.setInterval(play, this.props.autoplaySpeed)
      });
    }
  },
  pause: function () {
    if (this.state.autoPlayTimer) {
      window.clearInterval(this.state.autoPlayTimer);
      this.setState({
        autoPlayTimer: null
      });
    }
  }
};

export default helpers;
