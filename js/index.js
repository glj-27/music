$(function(){
	{
	// function Dog(){
	// 	return new Dog.prototype.init();
	// };
	// Dog.prototype = {
	// 	constructor: Dog,
	// 	init: function(){
	// 		this.name = "hah";
	// 		this.age = 66;
	// 	},
	// 	say: function(){
	// 		console.log(this.name, this.age);
	// 	}
	// };
	// Dog.prototype.init.prototype = Dog.prototype;
	// var d = new Dog();
	// d.say();
	}
	
	// 0.自定义滚动条
	$(".content_list").mCustomScrollbar();
	
	var $audio = $("audio");
	var player = new Player($audio);
	var progress;
	var voiceProgress;
	
	
	// 1.加载音乐列表
	getPlayList();
	function getPlayList() {
		$.ajax({
			url:"./source/musicList.json",
			dataType:"json",
			success:function(data) {
				// 将json中的歌曲信息传入到musicList列表中
				player.musicList = data;
				
				//3.1遍历歌曲列表数组，创建音乐
				// 动态创建没有绑定响应函数 使用事件委托
				var $musciList = $(".content_list ul");
				$.each(data, function(index, ele){
					var $item = createMusicItem(index, ele);
					$musciList.append($item);
				});
				initMusicInfo(data[0]);
				
			},
			error:function(reson){
				console.log(reson);
			}
		});
	}
	
	// 2.初始化歌曲信息
	function initMusicInfo(music){
		// 获取对应的元素
		var $musicImage = $(".song_info_pic img");
		var $muiscName = $(".song_info_name a");
		var $musicSinger = $(".song_info_singer a");
		var $musicAblum = $(".song_info_ablum a");
		var $musicProgressName = $(".music_progress_name");
		var $musicProfressTime = $(".music_progress_time");
		var $musicBackground = $(".mask_bg");
		
		// 给元素赋值
		$musicImage.attr("src", music.cover);
		$muiscName.text(music.name);
		$musicSinger.text(music.singer);
		$musicAblum.text(music.ablum);
		$musicProgressName.text(music.name + " / " + music.singer);
		$musicProfressTime.text("00:00 / " + music.time);
		$musicBackground.css("background", "url('" + music.cover + "')");
	}
	
	// 3.初始化进度条
	initProgress();
	function initProgress() {
		// 音乐进度条
		var $progressBar = $(".music_progress_bar");
		var $progressLine = $(".music_progress_line");
		var $progressDot = $(".music_progress_dot");
		progress = new Progress($progressBar, $progressLine, $progressDot);
		progress.progressClick(function(value){
			player.musicSeekTo(value);
		});
		progress.progressMove(function(value){
			player.musicSeekTo(value);
		});
		
		// 声音进度条
		var $voiceBar = $(".music_voice_bar");
		var $voiceLine = $(".music_voice_line");
		var $voiceDot = $(".music_voice_dot");
		voiceProgress = new Progress($voiceBar, $voiceLine, $voiceDot);
		voiceProgress.progressClick(function(value){
			player.musicVoiceSeekTo(value);
		});
		voiceProgress.progressMove(function(value){
			player.musicVoiceSeekTo(value);
		});
	}
	
	// 4.初始化事件监听
	initEvent();
	function initEvent(){
		// 1.监听歌曲的移入移出时间
		$(".content_list").delegate(".list_music", "mouseenter", function(){
			// 显示子菜单
			$(this).find(".list_menu").stop().fadeIn(100);
			$(this).find(".list_time a").stop().fadeIn(100);
			// 隐藏时长
			$(this).find(".list_time span").stop().fadeOut(100);
		});
		$(".content_list").delegate(".list_music", "mouseleave", function(){
			// 隐藏子菜单
			$(this).find($(".list_menu")).stop().fadeOut(100);
			$(this).find(".list_time a").stop().fadeOut(100);
			// 显示时长
			$(this).find(".list_time span").stop().fadeIn(100);
		});
		
		// 2.监听复选框的点击事件
		$(".content_list").delegate(".list_check", "click", function(){
			$(this).toggleClass("list_checked");
		});
		
		// 3.添加子菜单播放按钮的监听
		var $musicPlay = $(".music_play");
		$(".content_list").delegate(".list_menu_play", "click", function(){
			
			// 开启进度条点击事件
			
			var $item = $(this).parents(".list_music");
			
			// console.log($item.get(0).index);
			// console.log($item.get(0).music);
			
			// 3.1切换播放图标
			$(this).toggleClass("list_menu_play2");
			// 3.2复原其他的图标
			$item.siblings().find(".list_menu_play").removeClass("list_menu_play2");
			// 修复其他字体高亮
			$item.siblings().find("div").css("color", "rgba(255, 255, 255, 0.5)");
			// 3.3同步底部按钮
			if($(this).attr("class").indexOf("list_menu_play2") != -1){
				// 当前子菜单的播放按钮是播放的状态
				$musicPlay.addClass("music_play2");
				// 播放歌曲字体高亮
				$item.find("div").css("color", "#fff");
			}else{
				// 当前子菜单的播放按钮不是播放的状态
				$musicPlay.removeClass("music_play2");
				// 播放歌曲字体不高亮
				$item.find("div").css("color", "rgba(255, 255, 255, 0.5)");
			}
			// 3.4切换序号状态
			$item.find(".list_number").toggleClass("list_number2");
			// 修复其他符号状态
			$item.siblings().find(".list_number").removeClass("list_number2");
			
			// 3.5播放音乐
			player.playMusic($item.get(0).index, $item.get(0).music);
			
			// 3.6切换歌曲信息
			initMusicInfo($item.get(0).music);
		});
		
		// 4.监听底部控制区播放按钮的点击
		$musicPlay.click(function(){
			// 判断有没有播放过音乐
			if(player.currentIndex == -1) {
				// 没有播放过音乐 播放第0首：直接触发list里第一个li的播放按钮
				$(".list_music").eq(0).find(".list_menu_play").trigger("click");
				
			}else {
				// 播放过音乐eq() 直接使用currentIndex这个索引，存储了播放过的音乐的索引
				$(".list_music").eq(player.currentIndex).find(".list_menu_play").trigger("click");
			}
		});
		// 5.监听底部控制区播放上一首的点击
		$(".music_pre").click(function(){
			$(".list_music").eq(player.preIndex()).find(".list_menu_play").trigger("click");
		});
		// 6.监听底部控制区播放下一首的点击
		$(".music_next").click(function(){
			$(".list_music").eq(player.nextIndex()).find(".list_menu_play").trigger("click");
		});
		
		// 7.监听删除按钮的点击（委托）
		$(".content_list").delegate(".list_menu_rem", "click", function(){
			// 找到被点击的音乐
			$item = $(this).parents(".list_music");
			
			// 判断删除的是否是当前正在播放的音乐
			if($item.get(0).index == player.currentIndex) {
				// 触发下一首按钮
				$(".music_next").trigger("click");
			}
			
			$item.remove();
			player.changeMusicList($item.get(0).index);
			
			// 重新排序:number, 原生li的索引
			$(".list_music").each(function(index, ele) {
				ele.index = index;
				$(ele).find(".list_number").text(index + 1);
			});
		});
		
		// 8.监听播放的进度
		player.musicTimeUpdate(function(currentTime, duration, timeStr){
			// 同步页面进度条时间
			$(".music_progress_time").text(timeStr);
			// 同步进度条
			// 计算百分比
			var value = currentTime / duration * 100;
			progress.setProgress(value);
			// 当播放完毕时，自动切换到下一首歌
			// console.log(value);
			if(value == 100) $(".footer_in .music_next").trigger("click");
		});
		
		// 9.添加声音按钮
		$(".music_voice_icon").click(function(){
			// 切换图标
			$(this).toggleClass("music_voice_icon2");
			// 切换声音
			if($(this).attr("class").indexOf("music_voice_icon2") != -1) {
				// 变为静音
				player.musicVoiceSeekTo(0);
			}else {
				// 变为有声音
				player.musicVoiceSeekTo(1);
			}
		});
	}
	
	// 5.定义一个方法创建一条音乐
	function createMusicItem(index, music) {
		var $item = $('<li class="list_music">' +
			'<div class="list_check"><i></i></div>' +
			'<div class="list_number">'+ (index+1) +'</div>' +
			'<div class="list_name">'+ music.name +
				'<div class="list_menu">' +
					'<a href="javascript:;" title="播放" class="list_menu_play"></a>' +
					'<a href="javascript:;" title="添加"></a>' +
					'<a href="javascript:;" title="下载"></a>' +
					'<a href="javascript:;" title="分享"></a>' +
				'</div>' +
			'</div>' +
			'<div class="list_singer">'+ music.singer +'</div>' +
			'<div class="list_time">' +
				'<span>' + music.time + '</span>' +
				'<a href="javascript:;" title="删除" class="list_menu_rem"></a>' +
			'</div>' +
		'</li>');
		$item.get(0).index = index;
		$item.get(0).music = music;
		return $item;
	}
});