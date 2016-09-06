'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _ReactTransitionEvents = require('react/lib/ReactTransitionEvents');

var _ReactTransitionEvents2 = _interopRequireDefault(_ReactTransitionEvents);

var _trackHelper = require('./trackHelper');

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var nodeListToArray = function nodeListToArray(nodeList) {
  return Array.prototype.slice.call(nodeList);
};
var getNestedImages = function getNestedImages(containerElem) {
  return _reactDom2.default.findDOMNode(containerElem).querySelectorAll('img');
};

var helpers = {
  _loadedImgCount: 0,
  initialize: function initialize(props) {
    var slideCount = _react2.default.Children.count(props.children);
    var slideList = _reactDom2.default.findDOMNode(this.refs.list);
    var listWidth = this.getWidth(slideList);
    var trackWidth = this.getWidth(_reactDom2.default.findDOMNode(this.refs.track));
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

      var targetLeft = (0, _trackHelper.getTrackLeft)((0, _objectAssign2.default)({
        slideIndex: this.state.currentSlide,
        trackRef: this.refs.track
      }, props, this.state));
      // getCSS function needs previously set state
      var trackStyle = (0, _trackHelper.getTrackCSS)((0, _objectAssign2.default)({ left: targetLeft }, props, this.state));

      this.setState({
        trackStyle: trackStyle
      });

      this.autoPlay(); // once we're set up, trigger the initial autoplay.
    });
  },
  update: function update(props) {
    // This method has mostly same code as initialize method.
    // Refactor it
    var slideCount = _react2.default.Children.count(props.children);
    var slideList = _reactDom2.default.findDOMNode(this.refs.list);
    var listWidth = this.getWidth(slideList);
    var trackWidth = this.getWidth(_reactDom2.default.findDOMNode(this.refs.track));
    var slideWidth = 0;
    if (props.centerMode && props.centerSingleImg) {
      slideWidth = this.getActiveImageWidth() + this.props.centerImgPaddings * 2;
    } else if (typeof props.slideListPadding !== 'undefined') {
      slideWidth = (this.getWidth(_reactDom2.default.findDOMNode(slideList)) - props.slideListPadding * 2) / props.slidesToShow;
    } else {
      slideWidth = this.getWidth(_reactDom2.default.findDOMNode(slideList)) / props.slidesToShow;
    }

    // pause slider if autoplay is set to false
    if (!props.autoplay) this.pause();

    this.setState({
      slideCount: slideCount,
      slideWidth: slideWidth,
      listWidth: listWidth,
      trackWidth: trackWidth,
      activeSlideImageWidth: this.getActiveImageWidth(),
      activeSlideImageHeight: this.getActiveImageHeight()
    }, function () {

      var targetLeft = (0, _trackHelper.getTrackLeft)((0, _objectAssign2.default)({
        slideIndex: this.state.currentSlide,
        trackRef: this.refs.track
      }, props, this.state));
      // getCSS function needs previously set state
      var trackStyle = (0, _trackHelper.getTrackCSS)((0, _objectAssign2.default)({ left: targetLeft }, props, this.state));

      this.setState({ trackStyle: trackStyle });
    });
  },
  getWidth: function getWidth(elem) {
    return elem.getBoundingClientRect().width || elem.offsetWidth;
  },
  getPaddings: function getPaddings(elem) {
    return parseFloat(getComputedStyle(_reactDom2.default.findDOMNode(elem)).paddingLeft) + parseFloat(getComputedStyle(_reactDom2.default.findDOMNode(elem)).paddingRight);
  },
  onImageLoad: function onImageLoad(callback) {
    var _this = this;

    this._loadedImgCount = 0;
    var imgEls = nodeListToArray(getNestedImages(this));
    var loadedImages = imgEls.filter(function (el) {
      return el.complete && el.naturalWidth !== 0 && el.naturalHeight !== 0;
    });

    if (loadedImages.length < imgEls.length) {
      imgEls.forEach(function (el) {
        el.onload = function () {
          _this._loadedImgCount += 1;
          if (_this._loadedImgCount === imgEls.length - loadedImages.length) {
            callback();
            _this.setState({
              isImagesLoaded: true
            });
          }
        };
      });
    } else {
      callback();
      this.setState({
        isImagesLoaded: true
      });
    }
  },
  adaptHeight: function adaptHeight() {
    if (this.props.adaptiveHeight) {
      var selector = '[data-index="' + this.state.currentSlide + '"]';
      if (this.refs.list) {
        var slickList = _reactDom2.default.findDOMNode(this.refs.list);
        slickList.style.height = slickList.querySelector(selector).offsetHeight + 'px';
      }
    }
  },
  getCurrentSlide: function getCurrentSlide() {
    var selector = '[data-index="' + this.state.currentSlide + '"]';
    var slickList = _reactDom2.default.findDOMNode(this.refs.list);
    return slickList.querySelector(selector);
  },
  getCurrentSlideImg: function getCurrentSlideImg() {
    var selector = '[data-index="' + this.state.currentSlide + '"] img';
    var slickList = _reactDom2.default.findDOMNode(this.refs.list);
    return slickList.querySelector(selector);
  },
  getActiveImageHeight: function getActiveImageHeight() {
    if (this.refs.list) {
      return this.getCurrentSlideImg() && this.getCurrentSlideImg().getBoundingClientRect().height || this.getCurrentSlideImg() && this.getCurrentSlideImg().naturalHeight || this.getCurrentSlide() && this.getCurrentSlide().getBoundingClientRect().height;
    }
    return 0;
  },
  getActiveImageWidth: function getActiveImageWidth() {
    if (this.refs.list) {
      return this.getCurrentSlideImg() && this.getCurrentSlideImg().getBoundingClientRect().width || this.getCurrentSlideImg() && this.getCurrentSlideImg().naturalWidth || this.getCurrentSlide() && this.getCurrentSlide().getBoundingClientRect().width || 0;
    }
    return 0;
  },
  slideHandler: function slideHandler(index) {
    var _this2 = this;

    // Functionality of animateSlide and postSlide is merged into this function
    // console.log('slideHandler', index);
    var targetSlide, currentSlide;
    var targetLeft, currentLeft;
    var _callback;

    if (this.props.waitForAnimate && this.state.animating) {
      return;
    }
    this.pause();
    targetSlide = index;
    if (targetSlide < 0) {
      if (this.props.infinite === false) {
        currentSlide = 0;
      } else if (this.state.slideCount % this.props.slidesToScroll !== 0) {
        currentSlide = this.state.slideCount - this.state.slideCount % this.props.slidesToScroll;
      } else {
        currentSlide = this.state.slideCount + targetSlide;
      }
    } else if (targetSlide >= this.state.slideCount) {
      if (this.props.infinite === false) {
        currentSlide = this.state.slideCount - this.props.slidesToShow;
      } else if (this.state.slideCount % this.props.slidesToScroll !== 0) {
        currentSlide = 0;
      } else {
        currentSlide = targetSlide - this.state.slideCount;
      }
    } else {
      currentSlide = targetSlide;
    }

    targetLeft = (0, _trackHelper.getTrackLeft)((0, _objectAssign2.default)({
      slideIndex: targetSlide,
      trackRef: this.refs.track
    }, this.props, this.state));

    currentLeft = (0, _trackHelper.getTrackLeft)((0, _objectAssign2.default)({
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
      for (var i = targetSlide; i < targetSlide + this.props.slidesToShow; i++) {
        loaded = loaded && this.state.lazyLoadedList.indexOf(i) >= 0;
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
        trackStyle: (0, _trackHelper.getTrackCSS)((0, _objectAssign2.default)({ left: currentLeft }, this.props, this.state))
      }, function () {
        if (this.props.afterChange) {
          this.props.afterChange(currentSlide);
        }
      });
    } else {

      var nextStateChanges = {
        animating: false,
        currentSlide: currentSlide,
        trackStyle: (0, _trackHelper.getTrackCSS)((0, _objectAssign2.default)({ left: currentLeft }, this.props, this.state)),
        swipeLeft: null
      };

      _callback = function callback() {
        var timeOffset = +new Date() - _this2.date;
        if (timeOffset < _this2.props.speed - 100) {
          if (_this2.props.devMode === true) {
            console.warn('react-slick: animation is was interrupted: should be ' + _this2.props.speed + ', but was ' + timeOffset);
          }
          return false;
        }
        _this2.setState(nextStateChanges);
        if (_this2.props.afterChange) {
          _this2.props.afterChange(currentSlide);
        }
        _ReactTransitionEvents2.default.removeEndEventListener(_reactDom2.default.findDOMNode(_this2.refs.track), _callback);
      };
      this.date = +new Date();
      this.setState({
        animating: true,
        currentSlide: currentSlide,
        trackStyle: (0, _trackHelper.getTrackAnimateCSS)((0, _objectAssign2.default)({ left: targetLeft }, this.props, this.state))
      }, function () {
        _ReactTransitionEvents2.default.addEndEventListener(_reactDom2.default.findDOMNode(this.refs.track), _callback);
      });
    }
    if (!this.state.paused) {
      this.autoPlay();
    }
  },
  swipeDirection: function swipeDirection(touchObject) {
    var xDist, yDist, r, swipeAngle;

    xDist = touchObject.startX - touchObject.curX;
    yDist = touchObject.startY - touchObject.curY;
    r = Math.atan2(yDist, xDist);

    swipeAngle = Math.round(r * 180 / Math.PI);
    if (swipeAngle < 0) {
      swipeAngle = 360 - Math.abs(swipeAngle);
    }
    if (swipeAngle <= 45 && swipeAngle >= 0 || swipeAngle <= 360 && swipeAngle >= 315) {
      return this.props.rtl === false ? 'left' : 'right';
    }
    if (swipeAngle >= 135 && swipeAngle <= 225) {
      return this.props.rtl === false ? 'right' : 'left';
    }

    return 'vertical';
  },
  autoPlay: function autoPlay() {
    var _this3 = this;

    if (this.state.autoPlayTimer) {
      return;
    }
    var play = function play() {
      if (_this3.state.mounted) {
        var nextIndex = _this3.props.rtl ? _this3.state.currentSlide - _this3.props.slidesToScroll : _this3.state.currentSlide + _this3.props.slidesToScroll;
        _this3.slideHandler(nextIndex);
      }
    };
    if (this.props.autoplay) {
      this.setState({
        autoPlayTimer: window.setInterval(play, this.props.autoplaySpeed)
      });
    }
  },
  pause: function pause() {
    if (this.state.autoPlayTimer) {
      window.clearInterval(this.state.autoPlayTimer);
      this.setState({
        autoPlayTimer: null
      });
    }
  }
};

exports.default = helpers;