
/* ---------------------------------------------------------------------- */
// util-resource.js
// - Resource
// - Globalize
(function (undefined) {
	
	/* -------------------------------------------------- */
	// Resource Class
	// リソース
	function Resource(resource) {
		this.resource = resource;
	}
	
	// Instance members
	Resource.prototype = {
		
		get: function(key) {
			return this.resource[key];
		}
	}
	
	
	/* -------------------------------------------------- */
	// Globalize Class
	// ローカライズ
	function Globalize(resources, options) {
		this.options = $.extend({}, Globalize.defaults, options || {});
		this.resources = resources;
		this.resource = {};
		this.language = this.options.language;
		
		this.selectLanguage(this.options.language);
	}
	
	// Static members
	$.extend(Globalize, {
		defaults: {
			language: "ja",
			defaultLanguage: "ja"
		}
	});
	
	// Instance members
	Globalize.prototype = {
		
		get: function(key) {
			return this.resource[key];
		},
		
		selectLanguage: function(language) {
			
			if (this.resources[language]) {
				this.language = language;
			} else {
				this.language = this.options.defaultLanguage;
			}
			
			this._selectResource();
		},
		
		getLanguage: function() {
			return this.language;
		},
		
		_selectResource: function() {
			this.resource = this.resources[this.language];
		}
	}
	
	$.extend(Koukun.cl, {
		Resource: Resource,
		Globalize: Globalize
	});
})();
