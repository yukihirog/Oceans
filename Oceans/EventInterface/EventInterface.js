"use strict";

Oceans.EventInterface = function () {
};
Oceans.EventInterface.prototype.on = function (type, func) {
	jQuery(this).on(type, func);
};
Oceans.EventInterface.prototype.one = function (type, func) {
	jQuery(this).one(type, func);
};
Oceans.EventInterface.prototype.off = function (type, func) {
	jQuery(this).off(type, func);
};
Oceans.EventInterface.prototype.trigger = function (type, data) {
	jQuery(this).trigger(type, data);
};
