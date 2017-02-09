"use strict";

Oceans.CustomElement = function (node) {
	this.$node = null;
	this.init(node);
};
Oceans.CustomElement.prototype = new Oceans.EventInterface();
Oceans.CustomElement.prototype.init = function (node) {
	this.setNode(node);
	this.setEvent();
};
Oceans.CustomElement.prototype.getNode = function () {
	return this.$node;
};
Oceans.CustomElement.prototype.setNode = function (node) {
	if (node) {
		this.$node = $(node).eq(0);
	}
};
Oceans.CustomElement.prototype.setEvent = function () {
};
Oceans.CustomElement.prototype.append = function (node) {
	if (node) {
		this.$node.append(node);
	}
	return this;
};
Oceans.CustomElement.prototype.appendTo = function (node) {
	if (node) {
		this.$node.appendTo(node);
	}
	return this;
};
