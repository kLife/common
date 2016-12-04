/* global $ */

/* ---------------------------------------------------------------------- */
// Set name space
(function (global, rootName, undefined) {
	
	if (!global[rootName]) {
		global[rootName] = {};
	}
	
	$.extend(global[rootName], {
		fn: {}, // Utility
		cl: {}, // Class
		app: {} // Application
	});
	
})(this, "Koukun");

/* ---------------------------------------------------------------------- */
// Commonly used Class
// - cl.App
(function () {
	
	function App() {
		// Constructor
		
	}
	
	App.prototype = {
		// Instance members
		
		// Public
		
		// App#define("test.Test", function(){}, {}, {});
		// App#define("Data", {});
		define: function(name, value,　instanceMembers, staticMembers) {
			var currentNamespace = this;
			
			if (name) {
				var namespaceFragments = name.split(".");
				var valueName = namespaceFragments[namespaceFragments.length - 1];
				
				// Create name space.
				for (var i = 0; i < namespaceFragments.length - 1; i++) {
					var namespaceName = namespaceFragments[i];
					
					if (!currentNamespace[namespaceName]) {
						currentNamespace[namespaceName] = {};
					}
					
					currentNamespace = currentNamespace[namespaceName];
				}
				
				// Set value.
				currentNamespace[valueName] = value;
			}
			
			if ($.isFunction(value)) {
				// Set members if value is constructor.
				instanceMembers && $.extend(value.prototype, instanceMembers);
				staticMembers && $.extend(value, staticMembers);
			}
			
			return value;
		}
	}
	
	$.extend(Koukun.cl, {
		App: App
	});
})();

/* ---------------------------------------------------------------------- */
// Commonly used function
// - fn.assert
// - fn.inheritance
// - fn.format
// - fn.formatDate
// - fn.formatNumber
// - fn.escapeHTML
// - fn.jaStringLength
// - fn.log
// - fn.del
// - fn.getShortUrl
(function() {
	
	/* -------------------------------------------------- */
	// アサーション
	function assert(value, message) {
		
		if (!value) {
			console.log("Assertion Failure");
			
			if (message) {
				console.log("Message: " + message);
				console.trace();
				console.log(Error().stack);
			}
			
			debugger;
		}
	}
	
	/* -------------------------------------------------- */
	// 継承
	function inheritance(subClass, superClass) {
		
		function tempClass() {}
		tempClass.prototype = superClass.prototype;
		subClass.__super__ = superClass.prototype;
		subClass.prototype = new tempClass;
	};
	
	/* -------------------------------------------------- */
	// 文字列フォーマット 例: format("abc%sdef", "hoge") , return abchogedef
	function format(template) {
		
		var i = 1;
		var args = arguments;
		
		return template.replace(/%[cdfosx]/g, function() {
			return args[i++];
		});
	}
	
	/* -------------------------------------------------- */
	// 日付フォーマット
	function formatDate(string) {
		
		var date = new Date();
		var reg_date = new RegExp("year|month|day|hour|minute", "g");
		var rep_dates = {
			"year": date.getFullYear(),
			"month": date.getMonth() + 1,
			"day": date.getDate(),
			"hour": date.getHours(),
			"minute": date.getMinutes()
		};
		
		return String(string).replace(reg_date, function(match) {
			if (match === "year") {
				return ("000" + rep_dates[match]).slice(-4);
			} else {
				return ("0" + rep_dates[match]).slice(-2);
			}
		});
	}
	
	/* -------------------------------------------------- */
	// 数字フォーマット 例: formatNumber(12345.6789), return 12,345.6789.
	function formatNumber(num) {
		
		var r_integera = /^\d+[^\.]/;
		var r_unit = /(\d+?)(?=(?:\d{3})+$)/g;
		
		return String(num).replace(r_integera, function(t) {
			return t.replace(r_unit, "$1,");
		});
	}
	
	/* -------------------------------------------------- */
	// エスケープ
	function escapeHTML(string) {
		
		return String(string)
			.replace(/&(?!\w+;)/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#39;");
	}
	
	/* -------------------------------------------------- */
	// 日本語の長さ取得
	function jaStringLength(str) {
		
		var count = 0;
		for (var i = 0, len = str.length; i < len; i++) {
			var c = str.charCodeAt(i);
			// Shift_JIS: 0x0 ～ 0x80, 0xa0 , 0xa1 ～ 0xdf , 0xfd ～ 0xff
			// Unicode : 0x0 ～ 0x80, 0xf8f0, 0xff61 ～ 0xff9f, 0xf8f1 ～ 0xf8f3
			if (c >= 0x0 && c < 0x81 ||
				c == 0xf8f0 ||
				c >= 0xff61 && c < 0xffa0 ||
				c >= 0xf8f1 && c < 0xf8f4) {
				
				count += 1;
			} else {
				count += 2;
			}
		}
		return count;
	}
	
	/* -------------------------------------------------- */
	// ログ
	function log(value, $debugArea) {
		
		var date = new Date();
		var date_sec = ("00" + date.getSeconds()).slice(-2);
		var date_msec = ("000" + date.getMilliseconds()).slice(-3);
		var logTime = "[" + date_sec + "." + date_msec + "] "
		var logText = "";
		
		console.log(logTime, value);
		
		if ($debugArea && $debugArea.length > 0) {
			if ($.isPlainObject(value) || $.isArray(value)) {
				logText = JSON.stringify(value);
			} else {
				logText = value
			}
			
			$debugArea.prepend($("<div>").html(logTime + logText));
		}
	}
	
	/* -------------------------------------------------- */
	// デリート
	function del(target, key) {
		
		if ($.support.deleteExpando) {
			delete target[key];
		}
		
		if ($.isArray(target)) {
			target.splice(key, 1);
		}
	}
	
	/* -------------------------------------------------- */
	// 短縮URL取得
	function getShortUrl(option) {
		var apiKey = "AIzaSyD-z05agBFr7uwkCVIIDqIXN-ZplSBbgsE";
		
		$.ajax({
			type: "POST",
			dataType: "json",
			url: "https://www.googleapis.com/urlshortener/v1/url?key=" + apiKey,
			contentType: "application/json; charset=utf-8",
			data: "{longUrl: \"" + option.url + "\"}",
			success: function(res) {
				option.success(res.id);
			},
			error: option.error
		});
	}
	
	/* -------------------------------------------------- */
	// ブラウザの言語取得
	function getLanguage() {
		return (navigator.language || navigator.userLanguage).substr(0, 2);
	}
	
	/* -------------------------------------------------- */
	// 高速setTimeout
	var setZeroTimeout = (function(global) {
		var timeouts = [];
		var messageName = "zero-timeout-message";
		
		function handleMessage(event) {
			if (event.source == global && event.data == messageName) {
				if (event.stopPropagation) {
					event.stopPropagation();
				}
				if (timeouts.length) {
					timeouts.shift()();
				}
			}
		}
	 
		if (global.postMessage) {
			if (global.addEventListener) {
				global.addEventListener("message", handleMessage, true);
			} else if (global.attachEvent) {
				global.attachEvent("onmessage", handleMessage);
			}
			
			return function (fn) {
				timeouts.push(fn);
				global.postMessage(messageName, "*");
			}
		} else {
			return function () {
				setTimeout(fn, 0);
			}
		}
	}(window));
	
	
	$.extend(Koukun.fn, {
		assert: assert,
		inheritance: inheritance,
		format: format,
		formatDate: formatDate,
		formatNumber: formatNumber,
		escapeHTML: escapeHTML,
		jaStringLength: jaStringLength,
		log: log,
		del: del,
		getShortUrl: getShortUrl,
		getLanguage: getLanguage,
		setZeroTimeout: setZeroTimeout
	});
})();

