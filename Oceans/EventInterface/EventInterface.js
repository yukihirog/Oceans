"use strict";

Oceans.EventInterface = function () {
};
Oceans.EventInterface.prototype.on = function (type, func) {
	return jQuery(this).on(type, func);
};
Oceans.EventInterface.prototype.one = function (type, func) {
	return jQuery(this).one(type, func);
};
Oceans.EventInterface.prototype.off = function (type, func) {
	return jQuery(this).off(type, func);
};
Oceans.EventInterface.prototype.trigger = function (type, data) {
	return jQuery(this).trigger(type, data);
};
