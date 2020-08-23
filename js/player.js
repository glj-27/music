(function(window){
	function Player($audio){
		return new Player.prototype.init($audio);    //创建init对象
	}
	Player.prototype = {
		constructor: Player,
		musicList: [],      // 定义歌曲列表保存歌曲信息
		init: function ($audio) {
			this.$audio = $audio;  // jQuery包装好的
			this.audio = $audio.get(0);  // 原生的
		},
		currentIndex: -1,	
		playMusic: function(index, music) {
			//  判断是否是同一首歌
			if(this.currentIndex == index) {
				if(this.audio.paused) {
					// 暂停时播放
					this.audio.play();
				}else {
					// 播放时暂停
					this.audio.pause();
				}
			}else {
				// 不同同一首歌，切换歌曲
				this.$audio.attr("src", music.link_url); // 修改歌曲地址
				this.audio.play();   // 启动播放
				this.currentIndex = index;   // 修改当前歌曲索引
			}
		},
		preIndex: function() {
			var index = this.currentIndex - 1;
			if(index < 0) {
				index = this.musicList.length - 1;
			}
			return index;
		},
		nextIndex: function() {
			var index = this.currentIndex + 1;
			if(index > this.musicList.length - 1) {
				index = 0;
			}
			return index;
		},
		changeMusicList: function(index) {
			// 删除对应的数据
			this.musicList.splice(index, 1);
			
			// 判断删除的是否是当前音乐前面的音乐
			if(index < this.currentIndex) {
				this.currentIndex = this.currentIndex - 1;
			}
		},
		musicTimeUpdate: function(callBack) {
			var $this = this;
			// 8.监听播放的进度
			this.$audio.on("timeupdate", function() {
				// console.log(player.getMusicDuration(), player.getMusicCurrentTime()); 
				var duration = $this.audio.duration;
				var currentTime = $this.audio.currentTime;
				var timeStr = $this.formatDate(currentTime, duration);
				// console.log(timeStr);
				// 需要返回给Update，直接return（就近原则）会返回给formatDate，所以启用回调函数
				callBack(currentTime, duration, timeStr);
			});
		},
		formatDate: function(currentTime, duration) {
			var duration_s = parseInt(duration % 60);
			var duration_m = parseInt(duration / 60);
			var current_s = parseInt(currentTime % 60);
			var current_m = parseInt(currentTime / 60);
			if (duration_m < 10) {
				duration_m = "0" + duration_m;
			}
			if (duration_s < 10) {
				duration_s = "0" + duration_s;
			}
			if (current_m < 10) {
				current_m = "0" + current_m;
			}
			if (current_s < 10) {
				current_s = "0" + current_s;
			}
			
			var time = current_m + ":" + current_s + " / " + duration_m + ":" + duration_s;
			return time;
		},
		musicSeekTo: function(value) {
			// console.log(value);  // 又是value值会时NaN
			if(isNaN(value)) return;
			this.audio.currentTime = this.audio.duration * value;
		},
		musicVoiceSeekTo: function(value) {
			// 取值范围为 0-1
			if(isNaN(value)) return;
			this.audio.volume = value;
		}
	}
	Player.prototype.init.prototype = Player.prototype;   // 指定init指向Player的原型对象
	window.Player = Player;  // 将闭包内需要的变量暴露给全局（元素，对象，函数）
})(window);