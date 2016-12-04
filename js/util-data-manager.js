
/* ---------------------------------------------------------------------- */
// data-manager.js
//  - DataCache Class
//  - DataSource Class
(function (undefined) {
	
	/* -------------------------------------------------- */
	// DataCache Class
	// キャッシュデータ管理
	function DataCache() {
		// Constructor
		this._cache = {};
	}
	
	DataCache.prototype = {
		// Instance members
		
		// Public
		access: function(key, value) {
			if (key === undefined || ((key && typeof key === "string") && value === undefined)) {
				return this.get(key);
			}
			
			return this.set(key, value);
		},
		get: function(key) {
			return key ? this._cache[key] : this._cache;
		},
		set: function(key, value) {
			if (key) {
				return this._cache[key] = value;
			}
			
			return this._cache;
		},
		remove: function(key) {
			if (key) {
				delete this._cache[key];
			} else {
				this._cache = {};
			}
		}
	};
	
	/* -------------------------------------------------- */
	// DataSource Class
	// JSONデータ取得用
	function DataSource() {
		// Constructor
		this._cache = new Koukun.Class.DataCache();
	}
	
	DataSource.prototype = {
		// Instance members
		
		// Public
		getData: function (url) {
			var cache = this._cache;

			if (!cache.get(url)) {
				this._getJQXHR(url, false).done(function(data) {
					cache.set(url, data)
				});
			}
			
			return cache.get(url);
		},
		getDataASync: function (url, callback) {
			var cache = this._cache;
			
			if (!cache.get(url)) {
				this._getJQXHR(url, true).done(function (data) {
					callback(cache.set(url, data));
				});
			} else {
				callback(cache.get(url));
			}
		},
		
		// Private
		_getJQXHR: function (url, isAsync) {
			return $.ajax({
				type: "GET",
				dataType: "json",
				async: isAsync,
				url: url
			}).fail(function(response) {
				Sim.fn.log("Error[DataSource._getJQXHR]: Failed to load JSON.");
				console.log(response);
			});
		}
	};
	
	Object.defineProperties(Koukun.cl, {
	    DataCache: { value: DataCache, writable: true, enumerable: true, configurable: true },
	    DataSource: { value: DataSource, writable: true, enumerable: true, configurable: true }
	});
	
})();
