
/* ---------------------------------------------------------------------- */
// util-timer.js
// - Timer
(function (undefined) {
	
	/* -------------------------------------------------- */
	// Timer Class
	// パフォーマンス確認用タイマー
	function Timer() {
		// Constructor
		
		this.timer = (performance && performance.now) ? performance : Date;
		this.timerTable = {};
	}
	
	Timer.prototype = {
		// Instance members
		
		// Public
		start: function(id) {
			this.timerTable[id] = this.timer.now();
		},
		end: function(id) {
			return this.timer.now() - this.timerTable[id];
			delete this.timerTable[id];
		}
	}
	
	$.extend(Koukun.cl, {
		Timer: Timer
	});
})();
