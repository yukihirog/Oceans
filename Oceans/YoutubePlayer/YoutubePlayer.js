"use strict";

var Oceans = Oceans || {};

if (window.onYouTubePlayerReady) {
	window._onYouTubePlayerReady = window.onYouTubePlayerReady;
}
var onYouTubePlayerReady = function (playerapiid){
	var instance = Oceans.YoutubePlayer.get(playerapiid);
	if (instance) {
		instance.trigger('apiReady');
	}
	if (window._onYouTubePlayerReady) {
		window._onYouTubePlayerReady(playerapiid);
	}
};

Oceans.YoutubePlayer = function (options) {
	this.$node     = null;
	this.id        = '';
	this.videoId   = '';
	this.player    = null;
	this.autoplay  = false;
	this.chromless = false;
	this.init(options);
};
Oceans.YoutubePlayer.idNum = 0;
Oceans.YoutubePlayer.instances = {};
Oceans.YoutubePlayer.onStateChange = {};
Oceans.YoutubePlayer.onPlaybackQualityChange = {};
Oceans.YoutubePlayer.onError = {};
Oceans.YoutubePlayer.create = function(options){
	if (!options) {
		options = {};
	}
	if (!options.id) {
		var id = Oceans.YoutubePlayer.idNum++;
		options.id = 'Oceans_YoutubePlayer_' + id;
	}
	var instance = new Oceans.YoutubePlayer(options);
	this.instances[instance.id] = instance;
	return instance;
};
Oceans.YoutubePlayer.remove = function(id){
	delete this.instances[id];
};
Oceans.YoutubePlayer.get = function(id){
	if (this.instances[id]) {
		return this.instances[id];
	}
};
Oceans.YoutubePlayer.dispose = function(){
	for (var id in this.instances) {
		var instance = this.get(id);
		if (instance instanceof this) {
			instance.dispose();
		}
	}
};

Oceans.YoutubePlayer.prototype = new Oceans.EventInterface();
Oceans.YoutubePlayer.prototype.STATE_NOT_STARTED = -1;
Oceans.YoutubePlayer.prototype.STATE_ENDED       = 0;
Oceans.YoutubePlayer.prototype.STATE_PLAYING     = 1;
Oceans.YoutubePlayer.prototype.STATE_PAUSED      = 2;
Oceans.YoutubePlayer.prototype.STATE_BUFFER      = 3;
Oceans.YoutubePlayer.prototype.STATE_BUFFERED    = 5;
Oceans.YoutubePlayer.prototype.init = function (options) {
	if (options) {
		this.autoplay  = options.autoplay ? true : false;
		this.chromless = options.chromless ? true : false;
		this.setId(options.id);
		this.setVideoId(options.videoId);
	}
};
Oceans.YoutubePlayer.prototype.dispose = function () {
	this.trigger('dispsose');
	this.off();
	if (this.id) {
		Oceans.YoutubePlayer.remove(this.id);
		Oceans.YoutubePlayer.onStateChange[this.id]           = $.noop;
		Oceans.YoutubePlayer.onPlaybackQualityChange[this.id] = $.noop;
		Oceans.YoutubePlayer.onError[this.id]                 = $.noop;
		this.id = '';
	}
	if (this.player) {
		this.stop();
		this.player = null;
	}
	if (this.$node) {
		this.$node.remove();
		this.$node = null;
	}
};
Oceans.YoutubePlayer.prototype.setId = function (id) {
	this.id = id;
};
Oceans.YoutubePlayer.prototype.setVideoId = function (id) {
	this.videoId = id;
};
Oceans.YoutubePlayer.prototype.getURL = function () {
	return '//www.youtube.com/v/' + encodeURIComponent(this.videoId) + '?enablejsapi=1&playerapiid=' + encodeURIComponent(this.id);
};
Oceans.YoutubePlayer.prototype.getHTML = function () {
	var url  = this.getURL().replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
	var html = '<object data="' + url + '" type="application/x-shockwave-flash"><param name="movie" value="' + url + '"></param><param name="allowScriptAccess" value="always"></param></object>'
	return html;
};
Oceans.YoutubePlayer.prototype.createNode = function () {
	this.$node = $(this.getHTML())
	this.on('apiReady', $.proxy(this.onAPIReady, this));
	return this.$node;
};
Oceans.YoutubePlayer.prototype.appendTo = function (node) {
	if (node && this.$node) {
		this.$node.appendTo(node);
	}
};
Oceans.YoutubePlayer.prototype.play = function () {
	if (this.player) {
		this.player.playVideo();
	}
};
Oceans.YoutubePlayer.prototype.pause = function () {
	if (this.player) {
		this.player.pauseVideo();
	}
};
Oceans.YoutubePlayer.prototype.stop = function () {
	if (this.player) {
		this.player.stopVideo();
	}
};
Oceans.YoutubePlayer.prototype.seekTo = function (seconds, allowSeekAhead) {
	if (this.player) {
		this.player.seekTo(seconds, allowSeekAhead);
	}
};
Oceans.YoutubePlayer.prototype.mute = function () {
	if (this.player) {
		this.player.mute();
	}
};
Oceans.YoutubePlayer.prototype.unMute = function () {
	if (this.player) {
		this.player.unMute();
	}
};
Oceans.YoutubePlayer.prototype.isMute = function () {
	if (this.player) {
		return this.player.isMute();
	} else {
		return false;
	}
};
Oceans.YoutubePlayer.prototype.setVolume = function (volume) {
	if (this.player) {
		this.player.setVolume(volume);
	}
};
Oceans.YoutubePlayer.prototype.getVolume = function () {
	if (this.player) {
		return this.player.getVolume();
	} else {
		return 0;
	}
};
Oceans.YoutubePlayer.prototype.setSize = function (width, height) {
	if (this.player) {
		this.player.setSize(width, height);
	}
};
Oceans.YoutubePlayer.prototype.getVideoBytesLoaded = function () {
	if (this.player) {
		return this.player.getVideoBytesLoaded();
	} else {
		return 0;
	}
};
Oceans.YoutubePlayer.prototype.getVideoBytesTotal = function () {
	if (this.player) {
		return this.player.getVideoBytesTotal();
	} else {
		return 0;
	}
};
Oceans.YoutubePlayer.prototype.getVideoStartBytes = function () {
	if (this.player) {
		return this.player.getVideoStartBytes();
	} else {
		return 0;
	}
};
Oceans.YoutubePlayer.prototype.getPlayerState = function () {
	if (this.player) {
		return this.player.getPlayerState();
	} else {
		return this.STATE_NOT_STARTED;
	}
};
Oceans.YoutubePlayer.prototype.getCurrentTime = function () {
	if (this.player) {
		return this.player.getCurrentTime();
	} else {
		return 0;
	}
};
Oceans.YoutubePlayer.prototype.getPlaybackQuality = function () {
	if (this.player) {
		return this.player.getPlaybackQuality();
	} else {
		return '';
	}
};
Oceans.YoutubePlayer.prototype.setPlaybackQuality = function (suggestedQuality) {
	if (this.player) {
		this.player.setPlaybackQuality(suggestedQuality);
	}
};
Oceans.YoutubePlayer.prototype.getAvailableQualityLevels = function () {
	if (this.player) {
		return this.player.getAvailableQualityLevels();
	} else {
		return [];
	}
};
Oceans.YoutubePlayer.prototype.getDuration = function () {
	if (this.player) {
		return this.player.getDuration();
	} else {
		return 0;
	}
};
Oceans.YoutubePlayer.prototype.getWebUrl = function () {
	return 'https://www.youtube.com/watch?v=' + encodeURIComponent(this.videoId);
};
Oceans.YoutubePlayer.prototype.getVideoUrl = function () {
	if (this.player) {
		return this.player.getVideoUrl();
	} else {
		return '//www.youtube.com/embed/' + encodeURIComponent(this.videoId) + '?feature=player_embedded';
	}
};
Oceans.YoutubePlayer.prototype.getVideoEmbedCode = function () {
	if (this.player) {
		return this.player.getVideoEmbedCode();
	} else {
		return '<iframe width="640" height="360" src="' + this.getVideoUrl().replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;') + '" frameborder="0" allowfullscreen></iframe> ';
	}
};
Oceans.YoutubePlayer.prototype.setPlayer = function (player) {
	this.player = player;
	Oceans.YoutubePlayer.onStateChange[this.id]           = $.proxy(this.onStateChange, this);
	Oceans.YoutubePlayer.onPlaybackQualityChange[this.id] = $.proxy(this.onPlaybackQualityChange, this);
	Oceans.YoutubePlayer.onError[this.id]                 = $.proxy(this.onError, this);
	this.player.addEventListener('onStateChange',           'Oceans.YoutubePlayer.onStateChange.'           + this.id);
	this.player.addEventListener('onPlaybackQualityChange', 'Oceans.YoutubePlayer.onPlaybackQualityChange.' + this.id);
	this.player.addEventListener('onError',                 'Oceans.YoutubePlayer.onError.'                 + this.id);
	if (this.chromless) {
		this.player.cueVideoById(this.videoId);
	}
};
Oceans.YoutubePlayer.prototype.onAPIReady = function () {
	if (this.id) {
		this.setPlayer(this.$node.get(0));
		this.trigger('ready');
		if (this.autoplay) {
			if (!this.chromless) {
				this.play();
			} else {
				this.one('buffered', $.proxy(function(e){
					this.play();
				}, this));
			}
		}
	}
};
Oceans.YoutubePlayer.prototype.onStateChange = function (state) {
	if (this.id) {
		this.trigger('stateChange', state);
		switch (state) {
			case this.STATE_NOT_STARTED :
				this.trigger('notStarted');
			break;
			case this.STATE_ENDED :
				this.trigger('ended');
			break;
			case this.STATE_PLAYING :
				this.trigger('playing');
			break;
			case this.STATE_PAUSED :
				this.trigger('paused');
			break;
			case this.STATE_BUFFER :
				this.trigger('buffer');
			break;
			case this.STATE_BUFFERED :
				this.trigger('buffered');
			break;
		}
	}
};
Oceans.YoutubePlayer.prototype.onPlaybackQualityChange = function () {
	if (this.id) {
		this.trigger('playbackQualityChange', arguments);
	}
};
Oceans.YoutubePlayer.prototype.onError = function () {
	if (this.id) {
		this.trigger('error', arguments);
	}
};
