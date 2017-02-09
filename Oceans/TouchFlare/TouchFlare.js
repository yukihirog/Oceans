"use strict";

var Oceans = Oceans || {};

Oceans.TouchFlare = function (conf) {
	this.$node      = null;
	this.$field     = null;
	this.$container = null;
	this.currents   = [];
	this.isStop     = false;
	this.mode       = '';
	this.init(conf);
};
Oceans.TouchFlare.prototype = new Oceans.CustomElement();
Oceans.TouchFlare.prototype.templateField = '<div class="oceans-touchflare"></div>';
Oceans.TouchFlare.prototype.template = '<div class="oceans-touchflare-flare"></div>';
Oceans.TouchFlare.prototype.init = function (conf) {
	this.setConf(conf);
	this.setContainer(conf);
	this.setNode(conf);

	if (!this.$field.css('pointer-events')) {
		this.$field.remove();
		return;
	}

	this.setEvent();
};
Oceans.TouchFlare.prototype.setConf = function (conf) {
	if (conf) {
		this.isStop = !!conf.isStop;
	}
};
Oceans.TouchFlare.prototype.setContainer = function (conf) {
	if (conf && conf.container) {
		this.$container = $(conf.container);
	} else {
		this.$container = $('body').eq(0);
	}
};
Oceans.TouchFlare.prototype.setNode = function (conf) {
	if (conf && conf.templateField) {
		this.$field = $(conf.templateField);
	} else {
		this.$field = $(this.templateField);
	}

	this.$container.append(this.$field);

	if (conf && conf.template) {
		this.$node = $(conf.template);
	} else {
		this.$node = $(this.template);
	}
};
Oceans.TouchFlare.prototype.setEvent = function () {
	$(document.documentElement)
		.on('mousedown.TouchFlare touchstart.TouchFlare', $.proxy(this.onTouchStart, this))
		.on('mouseup.TouchFlare mouseout.TouchFlare touchend.TouchFlare', $.proxy(this.onTouchEnd, this))
	;
	$(document)
		.on('contextmenu.TouchFlare', $.proxy(this.onTouchEnd, this))
	;
	this.$node
		.on('animationend', $.proxy(this.onAnimationEnd, this))
	;
};
Oceans.TouchFlare.prototype.flareStart = function (point) {
	var $clone = this.$node.clone(true);
	$clone.css(point);
	this.$field.append($clone);
	this.currents.push($clone);
	this.trigger('flarestarted', $clone);
};
Oceans.TouchFlare.prototype.flareEnd = function ($target) {
	if (!$target) {
		$target = this.currents;
	}

	if ($target) {
		$.each($target, function(index, node){
			$(node).addClass('oceans-touchflare-end');
		});
		this.trigger('flareended', $target);
	}

	if ($target === this.currents) {
		this.currents = [];
	}
};
Oceans.TouchFlare.prototype.removeFlare = function (node) {
	if (node) {
		$(node).remove();
		this.$current = null;
		this.trigger('flareremoved', $(node));
	}
};
Oceans.TouchFlare.prototype.eventToPoint = function (e) {
	var _e = e;

	if (e.originalEvent && e.originalEvent.touches && e.originalEvent.touches.length) {
		_e = e.originalEvent.touches[0];
	}

	return {
		left : _e.clientX,
		top  : _e.clientY
	};
};
Oceans.TouchFlare.prototype.onTouchStart = function (e) {
	var point = this.eventToPoint(e);

	if (e.type == 'touchstart') {
		this.mode = 'touch';
	}

	if (e.type == 'touchstart' || this.mode != 'touch') {
		this.flareStart(point);
		this.trigger('touchstart', this);
	}
};
Oceans.TouchFlare.prototype.onTouchEnd = function (e) {
	this.flareEnd();
	this.trigger('touchend', this);
};
Oceans.TouchFlare.prototype.onAnimationEnd = function (e) {
	var $target = $(e.target);
	if ($target.is('.oceans-touchflare-end')) {
		this.removeFlare(e.target);
		this.trigger('animationend', $target);
	} else 	if (!this.isStop) {
		this.flareEnd($target);
	}
};
