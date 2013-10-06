"use strict";

var Oceans = Oceans || {};

Oceans.LineMarker = function (node) {
	this.$node      = null;
	this.$chars     = null;
	this.$lines     = null;
	this.timer      = 0;
	this.startAt    = 0;
	this.easing     = $.easing.easeInOutQuad;
	this.timeAtChar = 32;
	this.duration   = 0;
	this.useSpace   = false;
	this.init(node);
};
Oceans.LineMarker.prototype = new Oceans.CustomElement();
Oceans.LineMarker.prototype.openedClass = 'opened';
Oceans.LineMarker.prototype.init = function (node) {
	this.useSpace = Oceans.browser.isWebkit;
	this.setNode(node);
	this.initChars();
	this.initLines();
};
Oceans.LineMarker.prototype.initChars = function () {
	this.$node.find('mark').each($.proxy(function(index, mark){
		this.splitChars(mark);
	}, this));
	this.$chars = this.$node.find('.char');
};
Oceans.LineMarker.prototype.initLines = function () {
	this.$node.find('mark').each($.proxy(function(index, mark){
		var $line = $('<span class="line">');
		if (!mark.previousSibling) {
			$line.addClass('start');
		}
		if (!mark.nextSibling) {
			$line.addClass('end');
		}
		$(mark).prepend($line);

		var height = 0;
		$(mark).find('.char').each(function(index, node){
			$line.append(node);
			var _height = $line.height();
			if (height && height != _height) {
				$line.addClass('end');
				var _$line = $('<span class="line">');
				_$line.addClass('start');
				if (!mark.nextSibling) {
					_$line.addClass('end');
				}
				$line.after(_$line);
				$line = _$line;
				$line.append(node);
				height = $line.height();
			} else {
				height = _height;
			}
		});
	}, this));

	this.$lines = this.$node.find('.line');
};
Oceans.LineMarker.prototype.splitChars = function (node) {
	var children = node.childNodes;
	var nodes    = [];
	var useSpace = this.useSpace;
	$.each(children, $.proxy(function(index, node){
		if (node.nodeValue) {
			var chars = node.nodeValue.split('');
			$.each(chars, function(index, char){
				var $char = $('<span class="char">').text(char);
				if (useSpace) {
					$char.append($('<span class="space">').text(' '));
				}
				nodes.push($char.get(0));
			});
		} else {
			if (node.nodeType == 1) {
				this.splitChars(node);
			}
			nodes.push(node);
		}
	}, this));
	for (var i = node.childNodes.length - 1, n = 0; i >= n; i--) {
		node.removeChild(node.childNodes[i]);
	}
	$(node).append(nodes);
	return nodes;
};
Oceans.LineMarker.prototype.getWidth = function (index) {
	var ret = 0;
	if (typeof index == 'number') {
		ret = this.$lines.eq(index).outerWidth();
	} else {
		this.$lines.each(function(index, node){
			ret += $(node).outerWidth();
		});
	}
	return ret;
};
Oceans.LineMarker.prototype.clearTimer = function () {
	clearInterval(this.timer);
};
Oceans.LineMarker.prototype.setTimer = function () {
	this.clearTimer();
	this.timer = setInterval($.proxy(this.onTimer, this), Oceans.interval);
};
Oceans.LineMarker.prototype.getNow = function () {
	return (new Date()).getTime();
};
Oceans.LineMarker.prototype.getCurrentTime = function () {
	return Math.max(0, Math.min(this.duration, this.getNow() - this.startAt));
};
Oceans.LineMarker.prototype.getCurrentRatio = function () {
	return Math.min(1, Math.max(0, this.easing(null, this.getCurrentTime(), 0, 1, this.duration, 1.70158)));
};
Oceans.LineMarker.prototype.start = function () {
	if (this.$lines.length) {
		this.duration = this.timeAtChar * this.$chars.length
		this.startAt = this.getNow();
		this.setTimer();
	} else {
		this.stop();
		this.onComplete();
	}
};
Oceans.LineMarker.prototype.stop = function () {
	this.clearTimer();
};
Oceans.LineMarker.prototype.mark = function (ratio) {
	var width  = this.getWidth();
	var value  = width * ratio;
	var offset = 0;
	this.$lines.each($.proxy(function(index, node){
		var width = this.getWidth(index);
		if (value <= offset + width) {
			var _value = value - offset;
			$(node).css({ 'background-position' : _value + 'px 0' });
			return false;
		} else {
			$(node).css({ 'background-position' : (width + 1) + 'px 0' });
			offset += width;
		}
	}, this));
};
Oceans.LineMarker.prototype.onTimer = function () {
	var ratio = this.getCurrentRatio();
	this.mark(ratio);
	if (ratio >= 1) {
		this.stop();
		this.onComplete();
	}
};
Oceans.LineMarker.prototype.onComplete = function () {
	this.trigger('complete');
};
