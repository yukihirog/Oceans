"use strict";

Oceans.SelectElement = function (node) {
	this.$node  = null;
	this.$field = null;
	this.init(node);
};
Oceans.SelectElement.prototype = new Oceans.CustomElement();
Oceans.SelectElement.prototype.template = [
'<dl class="oceans-select-element">',
'<dt><span></span></dt>',
'<dd><ul></ul></dd>',
'</dl>'
].join('');
Oceans.SelectElement.prototype.init = function (node) {
	this.setNode($(this.template));

	this.$field = $(node);

	this.$value   = this.$node.find('dt span');
	this.$options = this.$node.find('dd');
	this.$list    = this.$node.find('ul');

	this.setDisplayValue();
	this.setOptions();

	this.$field.after(this.$node).hide();

	this.$field.on('change', $.proxy(this.onChange, this));
	this.$node.on('click', 'dt', $.proxy(this.onToggleClick, this));
	this.$node.on('click', 'li', $.proxy(this.onOptionClick, this));
};
Oceans.SelectElement.prototype.setDisplayValue = function () {
	var field = this.$field.get(0);
	var text = ' ';
	if (field.selectedIndex >= 0) {
		text = $(field.options[field.selectedIndex]).text();
	}
	this.$value.text(text);
};
Oceans.SelectElement.prototype.setOptions = function () {
	this.$field.find('option').each($.proxy(function(index, node){
		var $item = $('<li><span></span></li>');
		$item.find('span').text($(node).text());
		this.$list.append($item);
	}, this));
};
Oceans.SelectElement.prototype.toggleOptions = function () {
	if (this.$options.is(':visible')) {
		this.hideOptions();
	} else {
		this.showOptions();
	}
};
Oceans.SelectElement.prototype.showOptions = function () {
	this.$options.show();
	this.$node.addClass('open');
	$(document).on('click', $.proxy(this.onClick, this));
};
Oceans.SelectElement.prototype.hideOptions = function () {
	this.$options.hide();
	this.$node.removeClass('open');
	$(document).off('click', $.proxy(this.onClick, this));
};
Oceans.SelectElement.prototype.select = function (index) {
	if (this.$field.prop('selectedIndex') != index) {
		this.$field.prop('selectedIndex', index);
		this.$field.trigger('change');
	}
};
Oceans.SelectElement.prototype.onToggleClick = function (e) {
	e.preventDefault();
	this.toggleOptions();
};
Oceans.SelectElement.prototype.onOptionClick = function (e) {
	e.preventDefault();
	this.select($(e.currentTarget).index());
};
Oceans.SelectElement.prototype.onClick = function (e) {
	if (!$(e.target).closest(this.$node).length) {
		this.hideOptions();
	}
};
Oceans.SelectElement.prototype.onChange = function (e) {
	this.setDisplayValue();
	this.hideOptions();
};
