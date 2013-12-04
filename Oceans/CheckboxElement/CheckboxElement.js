"use strict";

Oceans.CheckboxElement = function (node) {
	this.$node  = null;
	this.$field = null;
	this.init(node);
};
Oceans.CheckboxElement.prototype = new Oceans.CustomElement();
Oceans.CheckboxElement.prototype.init = function (node) {
	this.$field = $(node);

	var $label = this.$field.parents('label');
	if (!$label.length) {
		this.$field.wrap('<label class="oceans-checkbox-element"></label>');
		$label = this.$field.parents('label')
	} else {
		$label.addClass('oceans-checkbox-element');
	}

	this.setNode($label);

	this.$node.prepend('<span class="check-mark"></span>');

	this.setDisplayValue();

	this.$field.on('change', $.proxy(this.onChange, this));
};
Oceans.CheckboxElement.prototype.setDisplayValue = function () {
	if (this.$field.prop('checked')) {
		this.$node.addClass('checked');
	} else {
		this.$node.removeClass('checked');
	}
};
Oceans.CheckboxElement.prototype.onChange = function (e) {
	this.setDisplayValue();
};
