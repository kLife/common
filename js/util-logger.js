
/* ---------------------------------------------------------------------- */
// util-logger.js
// - Logger
(function (undefined) {
	
	/* -------------------------------------------------- */
	// Logger Class
	// console.logっぽいの
	function Logger(options) {
		this.options = $.extend({}, Logger.defaults, options);
		this.disable = false;
	}
	
	// Static members
	$.extend(Logger, {
		defaults: {
			showCaller: false,
			defaultTagColor: "#fff",
			infoTagColor: "#def",
			errorTagColor: "#fed"
		}
	});
	
	// Instance members
	Logger.prototype = {
		
		log: function(tag, data, tagColor) {
			this._log(tag, data, tagColor);
		},
		
		info: function(text) {
			this._log("Info", text, this.options.infoTagColor);
		},
		
		error: function(text) {
			this._log("Error", text, this.options.errorTagColor);
		},
		
		_log: function(tag, data, tagColor) {
			if (this.disable) {
				return;
			}
			
			var caller = arguments.callee.caller.caller;
			var callerName = caller.name || caller.prototype;
			var format = "";
			var style = "background: " + (tagColor || this.options.defaultTagColor);
			var callerStyle = "color: #888; font-size: 80%;";
			
			switch (typeof data) {
			case "object":
			case "function":
				format = "%c %s %c %O";
				break;
			case "number":
				format = "%c %s %c %o";
				break;
			default:
				format = "%c %s %c %s";
			}
			
			if (this.options.showCaller) {
				console.log(format + " %c(%s)", style, tag, "", data, callerStyle, callerName);
			} else {
				console.log(format, style, tag, "", data);
			}
		}
	}
	
	$.extend(Koukun.cl, {
		Logger: Logger
	});
})();
