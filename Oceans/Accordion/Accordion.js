"use strict";

var Oceans = Oceans || {};

Oceans.Accordion = function (node) {
	this.$node    = null;
	this.$toggle  = null;
	this.$body    = null;
	this.init(node);
};
Oceans.Accordion.prototype = new Oceans.CustomElement();
Oceans.Accordion.prototype.openedClass = 'opened';
Oceans.Accordion.prototype.init = function (node) {
	this.setNode(node);
	this.setToggle(this.$node.find('.toggle'));
	this.setBody(this.$node.find('.body'));
	this.setEvent();
};
Oceans.Accordion.prototype.getToggle = function () {
	return this.$toggle;
};
Oceans.Accordion.prototype.setToggle = function (node) {
	this.$toggle = $(node);
};
Oceans.Accordion.prototype.getBody = function () {
	return this.$body;
};
Oceans.Accordion.prototype.setBody = function (node) {
	this.$body = $(node);
};
Oceans.Accordion.prototype.setEvent = function () {
	this.$toggle.on('click', $.proxy(this.onToggleClick, this));
};
Oceans.Accordion.prototype.getBodyHeight = function () {
	var ret = 0;
	this.$body.children().each(function(index, node){
		var $node    = $(node);
		var position = $node.css('position');
		if (position === 'static' || position === 'relative') {
			ret += $node.outerHeight(true);
		}
	});
	return ret;
};
Oceans.Accordion.prototype.isOpened = function () {
	return this.$node.hasClass(this.openedClass);
};
Oceans.Accordion.prototype.open = function () {
	if (!this.isOpened()) {
		this.$node.addClass(this.openedClass);
		var height = this.getBodyHeight();
		this.$body.stop().animate({ height : height }, Oceans.duration, Oceans.easing, $.proxy(this.onOpen, this));
	}
};
Oceans.Accordion.prototype.close = function () {
	if (this.isOpened()) {
		this.$node.removeClass(this.openedClass);
		this.$body.stop().animate({ height : 0 }, Oceans.duration, Oceans.easing, $.proxy(this.onClose, this));
	}
};
Oceans.Accordion.prototype.toggle = function () {
	if (this.isOpened()) {
		this.close();
	} else {
		this.open();
	}
};
Oceans.Accordion.prototype.onToggleClick = function (e) {
	e.preventDefault();
	this.toggle();
};
Oceans.Accordion.prototype.onOpen = function () {
	this.trigger('opened');
};
Oceans.Accordion.prototype.onClose = function () {
	this.trigger('closed');
};
