function Deffereds(beforeStart){
	this.items = [];
	this.dfd   = null;
	this.init(beforeStart);
};
Deffereds.prototype.init = function(beforeStart){
	this.createDfd();
	if (typeof beforeStart === 'function') {
		beforeStart();
	}
};
Deffereds.prototype.createDfd = function(){
	this.dfd = new $.Deferred();
};
Deffereds.prototype.clear = function(){
	this.items = [];
	this.dfd   = null;
};
Deffereds.prototype.dispose = function(){
	this.clear();
};
Deffereds.prototype.reset = function(){
	this.clear();
	this.createDfd();
};
Deffereds.prototype.indexOf = function(item){
	return $.inArray(item, this.items);
};
Deffereds.prototype.add = function(item){
	if (item instanceof Array) {
		for (var i = 0, n = item.length; i < n; i++) {
			this.add(item[i]);
		}
	} else {
		if (!this.has(item)) {
			this.items.push(item);
			item.always($.proxy(this.onItemComplete, this));
		}
	}
	return this;
};
Deffereds.prototype.has = function(item){
	return this.indexOf(item) != -1;
};
Deffereds.prototype.remove = function(item){
	if (item instanceof Array) {
		for (var i = 0, n = item.length; i < n; i++) {
			this.remove(item[i]);
		}
	} else {
		var i = -1;
		while ((i = this.indexOf(item)) != -1) {
			this.items.splice(i, 1);
		}
	}
	return this;
};
Deffereds.prototype.always = function(){
	this.dfd.always.apply(this.dfd, arguments);
	return this;
};
Deffereds.prototype.done = function(){
	this.dfd.done.apply(this.dfd, arguments);
	return this;
};
Deffereds.prototype.fail = function(){
	this.dfd.fail.apply(this.dfd, arguments);
	return this;
};
Deffereds.prototype.notify = function(args){
	this.dfd.notify(args);
	return this;
};
Deffereds.prototype.notifyWith = function(context, args){
	this.dfd.notifyWith(context, args);
	return this;
};
Deffereds.prototype.pipe = function(done, fail, progress){
	this.dfd.pipe(done, fail, progress);
	return this;
};
Deffereds.prototype.progress = function(func){
	this.dfd.progress(func);
	return this;
};
Deffereds.prototype.promise = function(target){
	return this.dfd.promise(target);
};
Deffereds.prototype.reject = function(args){
	this.dfd.reject(args);
	return this;
};
Deffereds.prototype.rejectWith = function(context, args){
	this.dfd.rejectWith(context, args);
	return this;
};
Deffereds.prototype.resolve = function(args){
	this.dfd.resolve(args);
	return this;
};
Deffereds.prototype.resolveWith = function(context, args){
	this.dfd.resolveWith(context, args);
	return this;
};
Deffereds.prototype.state = function(){
	var rejected = false;

	for (var i = 0, n = this.items.length; i < n; i++) {
		switch (this.items[i].state()) {
			case 'pending':
				return 'pending';
			break;
			case 'rejected':
				rejected = true;
			break;
		}
	}

	if (rejected) {
		return 'rejected';
	} else {
		return 'resolved';
	}
};
Deffereds.prototype.then = function(done, fail, progress){
	this.dfd.then(done, fail, progress);
	return this;
};
Deffereds.prototype.promise = function(type, target){
	return this.dfd.promise(type, target);
};
Deffereds.prototype.onItemComplete = function(){
	switch (this.state()) {
		case 'pending':
			return;
		break;
		case 'rejected':
			this.dfd.reject();
		break;
		case 'resolved':
			this.dfd.resolve();
		break;
	}
	this.reset();
};
