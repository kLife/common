
/* ---------------------------------------------------------------------- */
// util-file-saver.js
// - FileSaver
(function(undefined) {
	
	/* -------------------------------------------------- */
	// FileSaver Class
	// ファイル保存用
	function FileSaver() {
		this.isSupported = !!(window.Uint8Array && window.URL && window.Blob);
	}
	
	FileSaver.prototype = {
		
		save: function(blob, name) {
			this._save(blob, name);
		},
		
		saveCanvas: function(canvas, name) {
			var blob = this._canvasToBlob(canvas, "image/png");
			this._save(blob, name);
		},
		
		_save: function(blob, name) {
			
			if (window.navigator.msSaveBlob) {
				window.navigator.msSaveBlob(blob, name);
				
			} else {
				var downloadLink = $("<a>").attr({
					href: window.URL.createObjectURL(blob),
					download: name
				});
				
				if (document.createEvent && window.dispatchEvent) {
					var ev = document.createEvent('MouseEvents');
					ev.initEvent("click", true, true);
					downloadLink[0].dispatchEvent(ev);
				} else {
					downloadLink[0].click();
				}
			}
		},
		
		_canvasToBlob: function(canvas, type, quality) {
			var dataURL = canvas.toDataURL(type, quality);
			var binStr = atob(dataURL.split(",")[1]);
			var length = binStr.length;
			var buffer = new Uint8Array(length);
			
		    for (var i = 0; i < length; i++) {
		        buffer[i] = binStr.charCodeAt(i);
		    }
		    
		    return new Blob([buffer], {
		        type: type || "image/png"
		    });
		},
		
		_supportCheck: function() {
			
		}
	};
	
	$.extend(Koukun.cl, {
		FileSaver: FileSaver
	});
})();
