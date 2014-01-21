"use strict";

var Oceans = {
	$                : jQuery,
	$viewport        : jQuery(window),
	$document        : jQuery(document),
	$scroll          : jQuery(document.documentElement),
	browser          : {},
	transparentImage : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQIW2NkAAIAAAoAAggA9GkAAAAASUVORK5CYII=',
	isLoaded         : false,
	scrollOffset     : { x : 0, y : -58 },
	duration         : 400,
	interval         : 1000 / 60,
	easing           : 'swing'
};

(function(browser){
	var ua = navigator.userAgent;
	browser.isWindows      = ua.indexOf('Windows') !== -1;
	browser.isMac          = ua.indexOf('Mac')     !== -1;
	browser.isIE           = ua.indexOf('MSIE')    !== -1;
	browser.isWebkit       = ua.indexOf('WebKit')  !== -1;
	browser.isSafari       = ua.indexOf('Apple')   !== -1 && ua.indexOf('Chrome') === -1;
	browser.isFirefox      = ua.indexOf('Firefox') !== -1;
	browser.isAndroid      = ua.indexOf('Android') !== -1;
	browser.isIOS          = !!ua.match(/iPhone|iPad|iPod/);
	browser.isWindowsPhone = !!ua.match(/Windows\s*Phone/);
	browser.isBlackBerry   = !!ua.match(/BlackBerry/);
	browser.isSmartDevice  = browser.isAndroid || browser.isIOS || browser.isWindowsPhone || browser.isBlackBerry;
	browser.isTablet       = browser.isSmartDevice && ((browser.isIOS && !!ua.match(/iPad/)) || (browser.isAndroid && (ua.match(/SC\-01C/) || !ua.match(/Mobile/))));
	browser.isSmartphone   = browser.isSmartDevice && !browser.isTablet;
})(Oceans.browser);

Oceans.scrollTo = function (x, y, isAnimate) {
	x = Math.max(0, x + this.scrollOffset.x);
	y = Math.max(0, y + this.scrollOffset.y);
	if (isAnimate) {
		this.$scroll.animate({ scrollLeft : x, scrollTop : y }, this.duration, this.easing);
	} else {
		this.$viewport.get(0).scrollTo(x, y);
	}
};

Oceans.scrollBy = function (x, y) {
	this.$viewport.get(0).scrollBy(x, y);
};

Oceans.scrollToNode = function (node, isAnimate) {
	if (node) {
		var $node = $(node);
		if ($node.length) {
			var pos = $node.offset();
			this.scrollTo(pos.left, pos.top, isAnimate);
		}
	}
};

Oceans.fixAndroid = function () {
	if (this.browser.isAndroid) {
		this.$('head').eq(0).append('<style>body *{background-image:url(' + this.transparentImage + ');zoom:1;}</style>');
	}
};

Oceans.hideLocationBar = function () {
	this.scrollBy(0, 0);
};

Oceans.fixSmartphone = function () {
	if (this.browser.isAndroid) {
		this.fixAndroid();
	}
	if (this.browser.isSmartDevice) {
		this.hideLocationBar();
	}
};

Oceans.$(function($){
	Oceans.isLoaded = true;
	Oceans.$scroll = Oceans.browser.isWebkit ? Oceans.$document.find('body').eq(0) : $(Oceans.$document.get(0).documentElement);
});
