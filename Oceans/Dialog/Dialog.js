"use strict";

var Oceans = Oceans || {};

Oceans.Dialog = function (node) {
	this.$node   = null;
	this.$body   = null;
	this.easing  = 'easeInOutQuad';
	this.duraion = 200;
	this.init(node);
};
Oceans.Dialog.prototype = new Oceans.CustomElement();
Oceans.Dialog.instances = {};
Oceans.Dialog.getInstances = function(name){
	if (!Oceans.Dialog.instances[name]) {
		Oceans.Dialog.instances[name] = new Oceans.Dialog($('#' + name));
	}
	return Oceans.Dialog.instances[name];
};
Oceans.Dialog.open = function(name){
	this.getInstances(name).open();
};
Oceans.Dialog.prototype.init = function (node) {
	this.setNode(node);
	this.initBody();
	this.setEvent();
};
Oceans.Dialog.prototype.initBody = function () {
	this.$node.css({ opacity : 0 });
	this.$body = this.$node.find('.dialog-body');
	this.$body.append('<span class="dialog-close"></span>');
};
Oceans.Dialog.prototype.setEvent = function () {
	this.$node
		.on('click', $.proxy(this.onClick, this))
		.on('click', '.dialog-close', $.proxy(this.onCloseClick, this))
	;
};
Oceans.Dialog.prototype.open = function () {
	this.$node.stop().css({ display : 'block' }).animate({ opacity: 1 }, this.duraion, this.easing);
	this.trigger('beforeopen');
};
Oceans.Dialog.prototype.close = function () {
	this.$node.stop().animate({ opacity: 0 }, this.duraion, this.easing, $.proxy(this.onClose, this));
	this.trigger('beforeclose');
};
Oceans.Dialog.prototype.onClick = function (e) {
	if (this.$node.is(e.target)) {
		e.preventDefault();
		this.close();
	}
};
Oceans.Dialog.prototype.onCloseClick = function (e) {
	e.preventDefault();
	this.close();
};
Oceans.Dialog.prototype.onClose = function (e) {
	this.$node.css({ display : 'none' });
};
