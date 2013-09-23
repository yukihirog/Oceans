"use strict";

var Oceans = Oceans || {};

Oceans.Timer = function (func, time) {
	this.type     = 'Timeout';
	this.time     = 0;
	this.timer_id = 0;
	this.init(func, time);
};
Oceans.Timer.prototype.init = function (func, time) {
	this.time = time || 0;
	if (typeof func === 'function') {
		this.on('timer', func);
		this.start();
	}
};
Oceans.Timer.prototype.start = function () {
	this.stop();
	this.timer_id = window['set' + this.type]($.proxy(this.onTimer, this), this.time);
};
Oceans.Timer.prototype.stop = function () {
	this.clear();
};
Oceans.Timer.prototype.clear = function () {
	window['clear' + this.type](this.timer_id);
};
Oceans.Timer.prototype.on = function (type, func) {
	$(this).on(type, func);
};
Oceans.Timer.prototype.off = function (type, func) {
	$(this).off(type, func);
};
Oceans.Timer.prototype.trigger = function (type) {
	$(this).trigger(type);
};
Oceans.Timer.prototype.onTimer = function () {
	this.trigger('timer');
};
