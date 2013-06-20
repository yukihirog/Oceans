"use strict";

var jQuery   = jQuery   || function () {},
    Oceans   = Oceans   || {
		$                : jQuery,
		$viewport        : jQuery(window),
		$document        : jQuery(document),
		browser          : {},
		transparentImage : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQIW2NkAAIAAAoAAggA9GkAAAAASUVORK5CYII='
	};

Oceans.browser.isWebkit     = navigator.userAgent.indexOf('WebKit')  !== -1;
Oceans.browser.isAndroid    = navigator.userAgent.indexOf('Android') !== -1;
Oceans.browser.isIOS        = !!navigator.userAgent.match(/iPhone|iPad|iPod/);
Oceans.browser.isSmartphone = Oceans.browser.isAndroid || Oceans.browser.isIOS;

Oceans.fixAndroid = function () {
	if (this.browser.isAndroid) {
		this.$('head').eq(0).append('<style>body *{background-image:url(' + this.transparentImage + ');zoom:1;}</style>');
	}
};

Oceans.fixScrollPosition = function () {
	this.$viewport.get(0).scrollBy(0, 0);
};

Oceans.fixSmartphone = function () {
	if (this.browser.isAndroid) {
		this.fixAndroid();
	}
	if (this.browser.isSmartphone) {
		this.fixScrollPosition();
	}
};
