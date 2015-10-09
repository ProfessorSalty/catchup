function timerObj(duration, isCurrent){
	return{
		duration: duration,
		timer: duration * 60,
		interval: 1000,
		isRunning: false,
		intervalHandle: null,
		isCurrentTimer: isCurrent || false,
	};
}

function counterObj(){
	return{
		incrementMinutes: function(timerObj){
			timerObj.timer += 60;
		},
		decrementMinutes: function(timerObj){
			timerObj.timer -= 60;
		},
		incrementSeconds: function(timerObj){
			timerObj.timer += 1;
		},
		decrementSeconds: function(timerObj){
			timerObj.timer -= 1;
		},
		startTimer: function(timerObj, pendingTimer){
			var _this = this;
			if(!timerObj.isRunning && timerObj.isCurrentTimer){
				timerObj.isRunning = true;
				console.log(timerObj.timer); //debug
				timerObj.intervalHandle = (function(){
					return setInterval(function(){
					if(timerObj.timer > 0){
						timerObj.timer -= 1;
						console.log(timerObj.timer); //debug
					} else {
						clearInterval(timerObj.intervalHandle);
						timerObj.isRunning = false;
						console.log("Countdown complete"); //debug
						if(pendingTimer){
							_this.resetTimer(timerObj);
							timerObj.isCurrentTimer = false;
							pendingTimer.isCurrentTimer = true;
							_this.startTimer(pendingTimer, timerObj);
						}
					}
					
				}, timerObj.interval);
				})(_this)
			} 
		},
		stopTimer: function(timerObj){
			if(timerObj.isRunning){
				clearInterval(timerObj.intervalHandle);
				timerObj.isRunning = false;
			}else{
				console.log("Timer isn't running!");//debug
				return;
			}
		},
		resetTimer: function(timerObj){
			timerObj.timer = timerObj.duration * 60;
		},
		formatTime: function(timerObj){
			var minutes = (Math.floor(timerObj.timer/60)) < 10 ? "0" + Math.floor(timerObj.timer/60) : Math.floor(timerObj.timer/60),
				seconds = (timerObj.timer % 60) < 10 ? "0" + (timerObj.timer % 60) : timerObj.timer % 60;

			return minutes + ":" + seconds; 
		}
	}
}


function pomodoro(){
	return{
		workTimer: timerObj(.1, true),
		breakTimer: timerObj(.05),
		counterController: counterObj(),
		currentTimer: this.workTimer,
		pendingTimer: this.breakTimer,
		checkCurrent: function(){
			if(this.workTimer.isCurrentTimer){
				this.currentTimer = this.workTimer;
				this.pendingTimer = this.breakTimer;
			} else {
				this.currentTimer = this.breakTimer;
				this.pendingTimer = this.workTimer;
			}
		},
		toggleTimer: function(){
			this.checkCurrent();
			if(this.currentTimer.isRunning){
				this.counterController.stopTimer(this.currentTimer);
			} else {
				this.counterController.startTimer(this.currentTimer, this.pendingTimer);
			}
		},
		
	}
}

var catchup = pomodoro();
