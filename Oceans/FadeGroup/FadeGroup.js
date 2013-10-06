"use strict";

var Oceans = Oceans || {};

Oceans.FadeGroup = function (node) {
	this.$node      = null;
	this.$items     = null;
	this.timer      = 0;
	this.startAt    = 0;
	this.easing     = $.easing.easeInOutQuad;
	this.duration   = 1000;
	this.init(node);
};
Oceans.FadeGroup.prototype = new Oceans.CustomElement();
Oceans.FadeGroup.prototype.init = function (node) {
	this.setNode(node);
	this.initItems();
};
Oceans.FadeGroup.prototype.initItems = function () {
	this.$items = this.$node.find('.oceans-fadegroup-item');
	this.$items.css({ opacity: 0 });
};
Oceans.FadeGroup.prototype.clearTimer = function () {
	clearInterval(this.timer);
};
Oceans.FadeGroup.prototype.setTimer = function () {
	this.clearTimer();
	this.timer = setInterval($.proxy(this.onTimer, this), Oceans.interval);
};
Oceans.FadeGroup.prototype.getNow = function () {
	return (new Date()).getTime();
};
Oceans.FadeGroup.prototype.getCurrentTime = function () {
	return Math.max(0, Math.min(this.duration, this.getNow() - this.startAt));
};
Oceans.FadeGroup.prototype.getCurrentRatio = function () {
	return Math.min(1, Math.max(0, this.easing(null, this.getCurrentTime(), 0, 1, this.duration, 1.70158)));
};
Oceans.FadeGroup.prototype.start = function () {
	if (this.$items.length) {
		this.startAt = this.getNow();
		this.setTimer();
	} else {
		this.stop();
		this.onComplete();
	}
};
Oceans.FadeGroup.prototype.stop = function () {
	this.clearTimer();
};
Oceans.FadeGroup.prototype.fade = function (ratio) {
	var _atItem = 1 / this.$items.length;
	var _index  = parseInt(ratio / _atItem);
	var _ratio = (ratio % _atItem * this.$items.length);
	this.$items.each($.proxy(function(index, node){
		if (_index <= index) {
			$(node).css({ 'opacity' : _ratio });
			return false;
		} else {
			$(node).css({ 'opacity' : 1 });
		}
	}, this));
};
Oceans.FadeGroup.prototype.onTimer = function () {
	var ratio = this.getCurrentRatio();
	this.fade(ratio);
	if (ratio >= 1) {
		this.stop();
		this.onComplete();
	}
};
Oceans.FadeGroup.prototype.onComplete = function () {
	this.trigger('complete');
};
