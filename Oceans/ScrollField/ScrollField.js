"use strict";

var Oceans = Oceans || {};

Oceans.ScrollField = function (option) {
	this.$node      = null;
	this.$body      = null;
	this.indicator  = null;
	this.isDrag     = false;
	this.direction  = '';
	this.from       = 0;
	this.fromScroll = 0;
	this.swipe      = 0;
	this.latest     = 0;
	this.time       = 0;
	this.autoScroll = 400;
	this.init(option);
};
Oceans.ScrollField.prototype = new Oceans.CustomElement();
Oceans.ScrollField.prototype.Event = {
	CHANGE     : 'change.Oceans_ScrollField',
	RESIZE     : 'resize.Oceans_ScrollField',
	MOUSEDOWN  : 'mousedown.Oceans_ScrollField',
	MOUSEUP    : 'mouseup.Oceans_ScrollField',
	MOUSEMOVE  : 'mousemove.Oceans_ScrollField',
	TOUCHSTART : 'touchstart.Oceans_ScrollField',
	TOUCHMOVE  : 'touchmove.Oceans_ScrollField',
	TOUCHEND   : 'touchend.Oceans_ScrollField',
	WHEEL      : 'mousewheel.Oceans_ScrollField DOMMouseScroll.Oceans_ScrollField'
};
Oceans.ScrollField.prototype.defaults = {
	direction    : 'vertical'
};
Oceans.ScrollField.prototype.template = [
	'<div class="oceans-scrollfield"><div class="body"></div></div>'
].join('');
Oceans.ScrollField.prototype.init = function (option) {
	this.setOption(Oceans.$.extend(this.defaults, option));
	this.$body = this.getNode().find('.body');
	this.$body.css({ overflow : 'hidden' });

	this.indicator = new Oceans.Indicator({
		parent       : this.$node,
		direction    : this.getDirection(),
		min          : 0,
		max          : this.getScrollableSize(),
		value        : this.getScroll(),
		controllable : true,
		onChange     : Oceans.$.proxy(this.onChange, this)
	});
	this.resetIndicator();

	this.$body
		.on(this.Event.WHEEL,      Oceans.$.proxy(this.onWheel, this))
		.on(this.Event.TOUCHSTART, Oceans.$.proxy(this.onSwipeStart, this));

	Oceans.$viewport.on(this.Event.RESIZE, Oceans.$.proxy(this.resetIndicator, this));
};
Oceans.ScrollField.prototype.setOption = function (option) {
	this.setNode(option && option.node ? option.node : this.template);
	if (option) {
		if (typeof option.direction === 'string') {
			this.setDirection(option.direction);
		}
	}
};
Oceans.ScrollField.prototype.getDirection = function () {
	return this.direction;
};
Oceans.ScrollField.prototype.setDirection = function (direction) {
	direction = (direction === 'vertical') ? direction : 'horizontal';
    var style = {};
	if (this.getDirection() !== direction) {
		this.direction = direction;
		if (this.indicator) {
			this.indicator.setDirection(this.getDirection());
		}
	}
};
Oceans.ScrollField.prototype.getPositionProp = function () {
	if (this.getDirection() === 'vertical') {
		return 'top';
	} else {
		return 'left';
	}
};
Oceans.ScrollField.prototype.getSizeProp = function () {
	if (this.getDirection() === 'vertical') {
		return 'height';
	} else {
		return 'width';
	}
};
Oceans.ScrollField.prototype.getScrollProp = function () {
	if (this.getDirection() === 'vertical') {
		return 'scrollTop';
	} else {
		return 'scrollLeft';
	}
};
Oceans.ScrollField.prototype.append = function (node) {
	this.$body.append(node);
	this.resetIndicator();
	return this;
};
Oceans.ScrollField.prototype.appendTo = function (node) {
	this.$node.appendTo(node);
	this.resetIndicator();
	return this;
};
Oceans.ScrollField.prototype.resetIndicator = function () {
	var scrollable = this.getScrollableSize(),
	    viewport   = this.getViewSize(),
	    content    = this.getContentSize(),
	    size       = this.indicator.getSize() || viewport,
	    barSize    = size * viewport / content;

	if (scrollable) {
		this.indicator.show();
		this.indicator.setMax(scrollable);
		this.indicator.setBarSize(barSize);
	} else {
		this.indicator.hide();
	}
};
Oceans.ScrollField.prototype.getScroll = function () {
	return this.$body.prop(this.getScrollProp());
};
Oceans.ScrollField.prototype.setScroll = function (value) {
	if (value !== this.getScroll()) {
		this.$body.prop(this.getScrollProp(), value);
	}
};
Oceans.ScrollField.prototype.getScrollableSize = function () {
	return Math.max(0, this.getContentSize() - this.getViewSize());
};
Oceans.ScrollField.prototype.getViewSize = function () {
	return this.$body[this.getSizeProp()]();
};
Oceans.ScrollField.prototype.getContentSize = function () {
	return this.$body.prop('scroll' + this.getSizeProp().replace(/^[a-z]/, function(alpha){ return alpha.toUpperCase() }));
};
Oceans.ScrollField.prototype.getTouchPoint = function (e) {
	var touchPoint = 0;
	if (this.getDirection() === 'vertical') {
		touchPoint = e.originalEvent.touches[0].pageY;
	} else {
		touchPoint = e.originalEvent.touches[0].pageX;
	}
	return touchPoint;
};
Oceans.ScrollField.prototype.isScrollable = function (plusMinus) {
	if (this.getContentSize() < this.getViewSize()) {
		return false;
	}
	if (typeof plusMinus == 'number' && plusMinus > 0) {
		return this.getScroll() < this.getScrollableSize();
	} else if (typeof plusMinus == 'number' && plusMinus < 0) {
		return this.getScroll() > 0;
	} else {
		return true;
	}
};
Oceans.ScrollField.prototype.onChange = function (e, value) {
	this.setScroll(parseInt(value, 10));
};
Oceans.ScrollField.prototype.onWheel = function (e) {
	var delta = e.originalEvent ? (e.originalEvent.detail || -1 * e.originalEvent.wheelDelta || 0) : 0,
	    value = delta > 0 ? 20 : -20;
	if (this.isScrollable(delta)) {
		e.preventDefault();
		this.indicator.setValue(this.indicator.getValue() + value);
	}
};
Oceans.ScrollField.prototype.onSwipeStart = function (e) {
	if (this.isScrollable()) {
		this.$body.stop();

		var touchPoint = this.getTouchPoint(e);
		this.from       = touchPoint;
		this.fromScroll = this.getScroll();
		this.swipe      = 0;
		this.latest     = 0;
		this.time       = (new Date()).getTime();

		Oceans.$document
			.on(this.Event.TOUCHMOVE, Oceans.$.proxy(this.onSwipeMove, this))
			.on(this.Event.TOUCHEND,  Oceans.$.proxy(this.onSwipeEnd,  this));
	}
};
Oceans.ScrollField.prototype.onSwipeMove = function (e) {
	var touchPoint = this.getTouchPoint(e),
	    distance = touchPoint - this.from,
	    time = (new Date()).getTime() - this.time;

	if (this.isScrollable(-1 * distance)) {
		e.preventDefault();

		this.isDrag     = true;
		this.indicator.setValue(this.fromScroll - distance);
		this.latest = touchPoint - this.from;

		if (time > this.autoScroll) {
			this.time   = (new Date()).getTime();
			this.swipe  = touchPoint - this.from;
		}
	}
};
Oceans.ScrollField.prototype.onSwipeEnd = function (e) {
	if (this.isDrag) {
		e.preventDefault();
		this.isDrag = false;
		var time = (new Date()).getTime() - this.time;
		if (time < this.autoScroll) {
			var style = {};
			style[this.getScrollProp()] = this.getScroll() - (this.latest - this.swipe) * (this.autoScroll / time);
			this.$body.stop().animate(style, {
				duration : this.autoScroll,
				easing   : 'easeOutQuad',
				step     : Oceans.$.proxy(function (value) {
					this.indicator.setValue(value, 'silent');
					this.indicator.render();
				}, this)
			});
		}
		Oceans.$document
			.off(this.Event.TOUCHMOVE, Oceans.$.proxy(this.onSwipeMove, this))
			.off(this.Event.TOUCHEND,  Oceans.$.proxy(this.onSwipeEnd,  this));
	}
};
