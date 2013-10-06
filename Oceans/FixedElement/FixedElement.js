"use strict";

var Oceans = Oceans || {};

Oceans.FixedElement = function (node, top, bottom) {
	this.$node   = null;
	this.$top    = null;
	this.$bottom = null;
	this.init(node, top, bottom);
};
Oceans.FixedElement.prototype = new Oceans.CustomElement();
Oceans.FixedElement.prototype.fixedClass = 'fixed';
Oceans.FixedElement.prototype.init = function (node, top, bottom) {
	this.setNode(node);
	this.setTop(top);
	this.setBottom(bottom);
	this.setEvent();
	this.resetLayout();
};
Oceans.FixedElement.prototype.getTop = function () {
	return this.$top;
};
Oceans.FixedElement.prototype.setTop = function (node) {
	if (node) {
		this.$top = $(node);
	} else {
		this.$top = null;
	}
};
Oceans.FixedElement.prototype.getBottom = function () {
	return this.$bottom;
};
Oceans.FixedElement.prototype.setBottom = function (node) {
	if (node) {
		this.$bottom = $(node);
	} else {
		this.$bottom = null;
	}
};
Oceans.FixedElement.prototype.setEvent = function () {
	$(window).on('scroll', $.proxy(this.onScroll, this));
};
Oceans.FixedElement.prototype.resetLayout = function () {
	var top = 0;
	if (this.$top) {
		top = this.$top.offset().top + this.$top.outerHeight();
	}

	var bottom = 0;
	if (this.$bottom) {
		bottom = this.$bottom.offset().top;
	} else {
		bottom = Oceans.$document.outerHeight();
	}

	var scrollLeft = $(window).scrollLeft();
	var scrollTop  = $(window).scrollTop();
	var param = { top : '', left : '' }
	if (scrollTop > top) {
		this.$node.addClass(this.fixedClass);
		var nodeBottom = scrollTop + this.$node.outerHeight();
		if (nodeBottom > bottom) {
			param.top = bottom - nodeBottom;
		} else {
			param.top = 0;
		}

		param.left = -scrollLeft;
	} else {
		this.$node.removeClass(this.fixedClass);
	}

	this.$node.css(param);
};
Oceans.FixedElement.prototype.onScroll = function () {
	this.resetLayout();
};
