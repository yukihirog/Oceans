"use strict";

Oceans.NetworkChecker =function (){
	this.isOnline = navigator.onLine || false;
	this.init();
};
Oceans.NetworkChecker.prototype = new Oceans.EventInterface();
Oceans.NetworkChecker.prototype.init = function(){
	this.setEvent();
};
Oceans.NetworkChecker.prototype.setStatus = function(status){
	var _status = status || false;
	if (this.isOnline !== _status) {
		this.isOnline = _status;
		$(this).trigger('change.Oceans.NetworkChecker');
	}
};
Oceans.NetworkChecker.prototype.getStatus = function(){
	return this.isOnline;
};
Oceans.NetworkChecker.prototype.setEvent = function(){
	$(window)
		.on('offline.Oceans.NetworkChecker online.Oceans.NetworkChecker', $.proxy(this.onChange, this))
	;
};
Oceans.NetworkChecker.prototype.removeEvent = function(){
	$(window).on('offline.Oceans.NetworkChecker online.Oceans.NetworkChecker');
};
Oceans.NetworkChecker.prototype.onChange = function(e){
	this.setStatus(navigator.onLine);
};
