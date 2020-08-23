(function(window){
	function Progress($progressBar, $progressLine, $progressDot) {
		return new Progress.prototype.init($progressBar, $progressLine, $progressDot);
	}
	Progress.prototype = {
		constructor: Progress,
		init: function($progressBar, $progressLine, $progressDot) {
			this.$progressBar = $progressBar;
			this.$progressLine = $progressLine;
			this.$progressDot = $progressDot;
		},
		isMove: false,
		progressClick: function(callBack) {			
			var $this = this;     // progress调用这个方法，this就是谁progress
			// 监听进度条的点击事件
			this.$progressBar.click(function(event) {      // 这里是progressBar的点击事件，所以this是progressBar
				// 获取背景距离距离默认的位置
				var normalLeft = $(this).offset().left;
				// console.log(normalLeft);
				// 获取点击的位置距离窗口的位置
				var eventLeft = event.pageX;
				// console.log(eventLeft);
				// 设置当前进度条宽度
				var currentLeft = eventLeft-normalLeft;
				/* 一下需要调用progress的this */
				$this.$progressDot.css("left", currentLeft);
				$this.$progressLine.css("width", currentLeft);
				
				// 计算进度条的比例
				// 获取背景宽度
				var bGWidth = $(this).width();
				var value = currentLeft / bGWidth;
				callBack(value);
			});
		},
		progressMove: function(callBack) {
			var $this = this;
			// 1.监听鼠标的按下事件
			this.$progressBar.mousedown(function(){
				// 2.监听鼠标的移动事件
				// 获取背景距离距离默认的位置
				var normalLeft = $(this).offset().left;
				var eventLeft;
				// 获取背景宽度
				var bGWidth = $(this).width();
				// console.log(bGWidth);
				$(document).mousemove(function() {
					$this.isMove = true;
					
					// 获取点击的位置距离窗口的位置
					eventLeft = event.pageX;
					// 设置当前进度条宽度
					// 判断是否拉出进度条外
					var currentLeft = eventLeft-normalLeft
					if(currentLeft <= 0) {
						currentLeft = 0;
					}
					else if(currentLeft >= bGWidth) {
						currentLeft = bGWidth;
					}
					$this.$progressDot.css("left", currentLeft);
					$this.$progressLine.css("width", currentLeft);
				});
				// 3.监听鼠标的抬起事件
				$(document).mouseup(function() {
					$this.isMove = false;
					$(document).off("mousemove");
					
					// 在鼠标抬起时，才更改andio的currentTime，就不会出现音乐卡顿
					// 计算进度条的比例
					var currentLeft = eventLeft-normalLeft
					// 获取背景宽度
					var bGWidth = $this.$progressBar.width();
					var value = currentLeft / bGWidth;
					callBack(value);
					$(document).off("mouseup");
				});
			});
		},
		setProgress: function(value) {
			if(this.isMove) return;
			if(value < 0 || value >100) {
				return;
			}else {
				this.$progressLine.css({
					width: value + "%"
				});
				this.$progressDot.css({
					left: value + "%"
				});
			}
		}
		
	}
	Progress.prototype.init.prototype = Progress.prototype;
	window.Progress = Progress;
})(window);