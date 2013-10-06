"use strict";

var Oceans = Oceans || {};

Oceans.DateFormat = function (format, date) {
	this.date   = null;
	this.format = "";
	this.day  = [
		  'Sunday'
		, 'Monday'
		, 'Tuesday'
		, 'Wednesday'
		, 'Thursday'
		, 'Friday'
		, 'Saturday'
	];
	this.month  = [
		  'January'
		, 'February'
		, 'March'
		, 'April'
		, 'May'
		, 'June'
		, 'July'
		, 'August'
		, 'Septempber'
		, 'October'
		, 'Novomber'
		, 'December'
	];
	this.init(format, date);
};
Oceans.DateFormat.prototype.init = function (format, date) {
	this.setDate(date);
	this.setFormat(format);
};
Oceans.DateFormat.prototype.getDate = function () {
	return this.date;
};
Oceans.DateFormat.prototype.setDate = function (date) {
	this.date   = date   || new Date();
};
Oceans.DateFormat.prototype.getFormat = function () {
	return this.format;
};
Oceans.DateFormat.prototype.setFormat = function (format) {
	this.format = format || "%YYYY/%MM/%DD %hh:%mm:%ss";
};
Oceans.DateFormat.prototype.getFullMonth = function (month) {
	return this.month[month];
};
Oceans.DateFormat.prototype.getShortMonth = function (month) {
	return this.getFullMonth(month).slice(0, 3);
};
Oceans.DateFormat.prototype.getFullDay = function (day) {
	return this.day[day];
};
Oceans.DateFormat.prototype.getShortDay = function (day) {
	return this.getFullDay(day).slice(0, 3);
};
Oceans.DateFormat.prototype.formatZero = function (num) {
	var ret = num;
	ret = ('00' + num).slice(-2);
	return ret;
};
Oceans.DateFormat.prototype.formatPeriod = function (str) {
	var ret = str;
	if (str.length > 3) {
		ret = str.slice(0, 3) + '.';
	}
	return ret;
};
Oceans.DateFormat.prototype.toString = function () {
	var date   = this.getDate();
	var format = this.getFormat();

	var YYYY = date.getFullYear();
	var YY   = ('' + YYYY).slice(-2);

	var _M    = date.getMonth();
	var M     = _M + 1;
	var MM    = this.formatZero(M);
	var MONTH = this.getFullMonth(_M);
	var MON   = this.getShortMonth(_M);
	var MON_  = this.formatPeriod(MONTH);

	var D  = date.getDate();
	var DD = this.formatZero(D);

	var d    = date.getDay();
	var DAY  = this.getFullDay(d);
	var day  = this.getShortDay(d);

	var h  = date.getHours();
	var hh = this.formatZero(h);

	var m  = date.getMinutes();
	var mm = this.formatZero(m);

	var s  = date.getSeconds();
	var ss = this.formatZero(s);

	var param = {
		  YYYY  : YYYY
		, YY    : YY
		, MONTH : MONTH
		, MON   : MON
		, 'MON.': MON_
		, MM    : MM
		, M     : M
		, DD    : DD
		, D     : D
		, DAY   : DAY
		, day   : day
		, d     : d
		, hh    : hh
		, h     : h
		, mm    : mm
		, m     : m
		, ss    : ss
		, s     : s
	};

	return format.replace(/%(YYYY|YY|MONTH|MON\.|MON|MM|M|DAY|day|d|DD|D|hh|h|mm|m|ss|s)/g, function(){
		return param[arguments[1]];
	});
};
