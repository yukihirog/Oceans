"use strict";

var Oceans = {
	$                : jQuery,
	$viewport        : jQuery(window),
	$document        : jQuery(document),
	$scroll          : jQuery(document.documentElement),
	browser          : {},
	transparentImage : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQIW2NkAAIAAAoAAggA9GkAAAAASUVORK5CYII=',
	isLoaded         : false,
	scrollOffset     : { x : 0, y : -20 },
	duration         : 400,
	interval         : 1000 / 60,
	easing           : 'swing'
};

(function(browser){
	var ua = navigator.userAgent;
	browser.isIE         = ua.indexOf('MSIE')    !== -1;
	browser.isWebkit     = ua.indexOf('WebKit')  !== -1;
	browser.isAndroid    = ua.indexOf('Android') !== -1;
	browser.isIOS        = !!ua.match(/iPhone|iPad|iPod/);
	browser.isSmartphone = browser.isAndroid || browser.isIOS;
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
	if (this.browser.isSmartphone) {
		this.hideLocationBar();
	}
};

jQuery(function($){
	Oceans.isLoaded = true;
	Oceans.$scroll = Oceans.browser.isWebkit ? Oceans.$document.find('body').eq(0) : $(Oceans.$document.get(0).documentElement);
});
