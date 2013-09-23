"use strict";

Oceans.Indicator = function (option) {
	this.$node        = null;
	this.$bar         = null;
	this.direction    = '';
	this.min          = 0;
	this.max          = 1;
	this.value        = 0;
	this.controllable = false;
	this.isDrag       = false;
	this.from         = 0;
	this.init(option);
};
Oceans.Indicator.prototype = new Oceans.CustomElement();
Oceans.Indicator.prototype.Event = {
	CHANGE     : 'change.Oceans_Indicator',
	RESIZE     : 'resize.Oceans_Indicator',
	MOUSEDOWN  : 'mousedown.Oceans_Indicator',
	MOUSEUP    : 'mouseup.Oceans_Indicator',
	MOUSEMOVE  : 'mousemove.Oceans_Indicator',
	TOUCHSTART : 'touchstart.Oceans_Indicator',
	TOUCHMOVE  : 'touchmove.Oceans_Indicator',
	TOUCHEND   : 'touchend.Oceans_Indicator'
};
Oceans.Indicator.prototype.template = [
	'<div class="oceans-indicator"><div class="bar"></div></div>'
].join('');
Oceans.Indicator.prototype.defaults = {
	node         : null,
	direction    : 'vertical',
	min          : 0,
	max          : 1,
	value        : 0,
	controllable : true,
	parent       : null,
	onChange     : null
};
Oceans.Indicator.prototype.init = function (option) {
	this.setOption(Oceans.$.extend(this.defaults, option));
	this.render();
	Oceans.$viewport.on(this.Event.RESIZE, Oceans.$.proxy(this.render, this));
};
Oceans.Indicator.prototype.setOption = function (option) {
	this.setNode(option && option.node ? option.node : this.template);
	this.$bar  = this.getNode().find('.bar');

	if (option) {
		if (typeof option.direction === 'string') {
			this.setDirection(option.direction);
		}
		if (typeof option.min === 'number') {
			this.setMin(option.min);
		}
		if (typeof option.max === 'number') {
			this.setMax(option.max);
		}
		if (typeof option.value === 'number') {
			this.setValue(option.value);
		}
		if (typeof option.controllable === 'boolean') {
			this.setControllable(option.controllable);
		}
		if (option.parent) {
			this.appendTo(option.parent);
		}
		if (typeof option.onChange === 'function') {
			this.on(this.Event.CHANGE, option.onChange);
		}
	}
};
Oceans.Indicator.prototype.append = function (node) {
	this.$node.append(node);
	this.render();
	return this;
};
Oceans.Indicator.prototype.appendTo = function (node) {
	this.$node.appendTo(node);
	this.render();
	return this;
};
Oceans.Indicator.prototype.show = function () {
	this.$node.show();
};
Oceans.Indicator.prototype.hide = function () {
	this.$node.hide();
};
Oceans.Indicator.prototype.render = function () {
	var style = {};
	style[this.getPositionProp()] = this.getBarPosition();
	this.$bar.css(style);
};
Oceans.Indicator.prototype.inRange = function (value) {
	return Math.max(this.getMin(), Math.min(this.getMax(), value));
};
Oceans.Indicator.prototype.addControllEvent = function () {
	this.$node
		.on(this.Event.MOUSEDOWN, Oceans.$.proxy(this.onTouch, this));
	this.$bar
		.on(this.Event.MOUSEDOWN,  Oceans.$.proxy(this.onDragStart, this))
		.on(this.Event.TOUCHSTART, Oceans.$.proxy(this.onDragStart, this));
};
Oceans.Indicator.prototype.removeControllEvent = function () {
	this.$node
		.off(this.Event.MOUSEDOWN);
	this.$bar
		.off(this.Event.MOUSEDOWN,  Oceans.$.proxy(this.onDragStart, this))
		.off(this.Event.TOUCHSTART, Oceans.$.proxy(this.onDragStart, this));
	Oceans.$document
		.off(this.Event.MOUSEMOVE, Oceans.$.proxy(this.onDragMove, this))
		.off(this.Event.MOUSEUP,   Oceans.$.proxy(this.onDragEnd, this))
		.off(this.Event.TOUCHMOVE, Oceans.$.proxy(this.onDragMove, this))
		.off(this.Event.TOUCHEND,  Oceans.$.proxy(this.onDragEnd, this));
};
Oceans.Indicator.prototype.getDirection = function () {
	return this.direction;
};
Oceans.Indicator.prototype.setDirection = function (direction) {
	direction = (direction === 'vertical') ? direction : 'horizontal';
    var style = {};
	if (this.getDirection() !== direction) {
		style[this.getPositionProp()] = '';
		this.$bar.css(style);
		this.direction = direction;
		this.$node.attr('data-direction', this.direction);
		this.render();
	}
};
Oceans.Indicator.prototype.getControllable = function () {
	return this.controllable;
};
Oceans.Indicator.prototype.setControllable = function (is) {
	is = is ? true : false;
	if (this.getControllable() !== is) {
		this.controllable = is;
		if (this.getControllable()) {
			this.addControllEvent();
		} else {
			this.removeControllEvent();
		}
	}
};
Oceans.Indicator.prototype.getPositionProp = function () {
	if (this.getDirection() === 'vertical') {
		return 'top';
	} else {
		return 'left';
	}
};
Oceans.Indicator.prototype.getSizeProp = function () {
	if (this.getDirection() === 'vertical') {
		return 'height';
	} else {
		return 'width';
	}
};
Oceans.Indicator.prototype.getBarPosition = function () {
	var size    = this.getSize(),
	    barSize = this.getBarSize(),
	    ratio   = this.getRatio();
	return parseInt((size - barSize) * ratio, 10);
};
Oceans.Indicator.prototype.getSize = function () {
	if (this.getSizeProp() === 'height') {
		return this.getHeight();
	} else {
		return this.getWidth();
	}
};
Oceans.Indicator.prototype.getHeight = function () {
	return this.$node.height();
};
Oceans.Indicator.prototype.getWidth = function () {
	return this.$node.width();
};
Oceans.Indicator.prototype.getBarSize = function () {
	if (this.getSizeProp() === 'height') {
		return this.getBarHeight();
	} else {
		return this.getBarWidth();
	}
};
Oceans.Indicator.prototype.getBarHeight = function () {
	return this.$bar.outerHeight();
};
Oceans.Indicator.prototype.getBarWidth = function () {
	return this.$bar.outerWidth();
};
Oceans.Indicator.prototype.setBarSize = function (size) {
	if (this.getSizeProp() === 'height') {
		this.setBarHeight(size);
	} else {
		this.setBarWidth(size);
	}
};
Oceans.Indicator.prototype.setBarHeight = function (size) {
	this.$bar.height(size);
	this.render();
};
Oceans.Indicator.prototype.setBarWidth = function (size) {
	this.$bar.width(size);
	this.render();
};
Oceans.Indicator.prototype.getRatio = function () {
	var min      = this.getMin(),
	    max      = this.getMax(),
	    value    = this.getValue(),
	    distance = max - min;
	if (distance !== 0) {
		return Math.max(0, Math.min(1, (value - min) / distance));
	} else {
		return 0;
	}
};
Oceans.Indicator.prototype.getValue = function () {
	return this.value;
};
Oceans.Indicator.prototype.setValue = function (value, silent) {
	value = this.inRange(value);
	if (this.value !== value) {
		this.value = value;
		if (!silent) {
			this.onChange();
		}
	}
};
Oceans.Indicator.prototype.getMin = function () {
	return this.min;
};
Oceans.Indicator.prototype.setMin = function (value) {
	value = Math.min(this.getMax(), value);
	if (this.min !== value) {
		this.min = value;
		if (this.getValue() < this.getMin()) {
			this.setValue(this.getMin())
		} else {
			this.onChange();
		}
	}
};
Oceans.Indicator.prototype.getMax = function () {
	return this.max;
};
Oceans.Indicator.prototype.setMax = function (value) {
	value = Math.max(this.getMin(), value);
	if (this.max !== value) {
		this.max = value;
		if (this.getValue() > this.getMax()) {
			this.setValue(this.getMax())
		} else {
			this.onChange();
		}
	}
};
Oceans.Indicator.prototype.getTouchPoint = function (e) {
	var touchPoint = 0;
	if (e.type.indexOf('touch') !== -1) {
		if (this.getPositionProp() === 'top') {
			touchPoint = e.originalEvent.touches[0].pageY - this.$node.offset().top;
		} else {
			touchPoint = e.originalEvent.touches[0].pageX - this.$node.offset().left;
		}
	} else {
		if (this.getPositionProp() === 'top') {
			touchPoint = e.pageY - this.$node.offset().top;
		} else {
			touchPoint = e.pageX - this.$node.offset().left;
		}
	}
	return touchPoint;
};
Oceans.Indicator.prototype.moveToTouchPoint = function (e) {
	var touchPoint = this.getTouchPoint(e),
	    size       = this.getSize(),
	    barSize    = this.getBarSize(),
	    min        = this.getMin(),
	    max        = this.getMax(),
	    ratio      = (touchPoint - barSize / 2) / (size - barSize);
	this.setValue((max - min) * ratio + min);
};
Oceans.Indicator.prototype.onChange = function () {
	this.render();
	this.trigger('change', this.getValue());
};
Oceans.Indicator.prototype.onTouch = function (e) {
	if (e.target === this.$bar.get(0) || this.$bar.find(e.target).length) {
		return;
	}
	this.moveToTouchPoint(e);
};
Oceans.Indicator.prototype.onDragStart = function (e) {
	e.preventDefault();
	var touchPoint = this.getTouchPoint(e);
	this.from   = touchPoint;
	this.latest = this.getValue();
	Oceans.$document
		.on(this.Event.MOUSEMOVE, Oceans.$.proxy(this.onDragMove, this))
		.on(this.Event.MOUSEUP,   Oceans.$.proxy(this.onDragEnd,  this))
		.on(this.Event.TOUCHMOVE, Oceans.$.proxy(this.onDragMove, this))
		.on(this.Event.TOUCHEND,  Oceans.$.proxy(this.onDragEnd,  this));
};
Oceans.Indicator.prototype.onDragMove = function (e) {
	e.preventDefault();
	this.isDrag = true;
	var touchPoint = this.getTouchPoint(e),
	    distance   = touchPoint - this.from;
	this.setValue(this.latest + (this.getMax() - this.getMin()) * (distance / this.getSize()));
};
Oceans.Indicator.prototype.onDragEnd = function (e) {
	if (this.isDrag) {
		e.preventDefault();
		this.isDrag = false;
		this.from   = 0;
	}

	Oceans.$document
		.off(this.Event.MOUSEMOVE, Oceans.$.proxy(this.onDragMove, this))
		.off(this.Event.MOUSEUP,   Oceans.$.proxy(this.onDragEnd,  this))
		.off(this.Event.TOUCHMOVE, Oceans.$.proxy(this.onDragMove, this))
		.off(this.Event.TOUCHEND,  Oceans.$.proxy(this.onDragEnd,  this));
};

Oceans.Indicator.Option = function (option) {
	this.node         = null;
	this.direction    = 'vertical';
	this.min          = 0;
	this.max          = 1;
	this.value        = 0;
	this.controllable = true;
	this.parent       = null;
	this.onChange     = null;
	this.init(option);
};
Oceans.Indicator.Option.prototype.init = function (option) {
	this.setOption(option);
};
Oceans.Indicator.Option.prototype.setOption = function (option) {
	if (option) {
		if (typeof option.node) {
			this.node = option.node;
		}
		if (typeof option.direction === 'string') {
			this.setDirection(option.direction);
		}
		if (typeof option.min === 'number') {
			this.setMin(option.min);
		}
		if (typeof option.max === 'number') {
			this.setMax(option.max);
		}
		if (typeof option.value === 'number') {
			this.setValue(option.value);
		}
		if (typeof option.controllable === 'boolean') {
			this.setControllable(option.controllable);
		}
		if (option.parent) {
			this.appendTo(option.parent);
		}
		if (typeof option.onChange === 'function') {
			this.on(this.Event.CHANGE, option.onChange);
		}
	}
};
