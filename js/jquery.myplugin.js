;(function ($, global, undefined) {
	
	// Prevent scroll-event bubbling. Not support keyEvent.
	$.fn.noScrollPropagation = function(arg_options) {
		var _defaults = {
			scrollSpeed: 100,
			scrollableOnly: true
		};
		
		var options = $.extend({}, _defaults, arg_options);
		
		return this.on("mousewheel", function (e, delta, deltaX, deltaY) {
			if (!delta) {
				// For modern Chrome
				deltaX = e.originalEvent.deltaX / 100;
				deltaY = - e.originalEvent.deltaY / 100;
			}
			
			var $this = $(this);
			var scrollTop = $this.scrollTop($this.scrollTop() - (deltaY * options.scrollSpeed)).scrollTop();
			var scrollLeft = $this.scrollLeft($this.scrollLeft() + (deltaX * options.scrollSpeed)).scrollLeft();
			var innerWidth = $this.innerWidth();
			var innerHeight = $this.innerHeight();
			var contentWidth = $this.prop("scrollWidth");
			var contentHeight = $this.prop("scrollHeight");
			
			// PreventDefault when target is scrollable and when scroll-position is top/bottom.
			if (!options.scrollableOnly ||
				!(contentHeight <= innerHeight && deltaY !== 0 ||
				contentWidth <= innerWidth && deltaX !== 0) &&
				(scrollTop === 0 && deltaY > 0 && deltaX === 0 || 
				scrollTop >= contentHeight - innerHeight && deltaY < 0 && deltaX === 0 || 
				scrollLeft === 0 && deltaX < 0 && deltaY === 0 ||
				scrollLeft >= contentWidth - innerWidth && deltaX > 0 && deltaY === 0)) {
				
				e.preventDefault();
			}
			
		// For Firefox
		}).on("DOMMouseScroll MozMousePixelScroll", function (e) {
			e.preventDefault();
		});
	};
	
	
	// Prevent to select element when onSelectStart/onDragStart.
	$.fn.noSelect = function() {
		var rclickable = /^(?:input|select|textarea|button|object|keygen|a|area)$/i;
		
		return this.on("selectstart dragstart", function(e) {
			return false;
		}).on("mousedown", function(e) {
			var nodeName = e.target.nodeName;
			
			if (!rclickable.test(nodeName)) {
				var $lastClick = $.data(global, "noSelect-lastSelected");
				$lastClick && $lastClick.blur();
				return false;
			} else {
				$.data(global, "noSelect-lastSelected", $(e.target));
			}
		}).css({
			"MozUserSelect": "none",
			"msUserSelect": "none",
			"webkitUserSelect": "none",
			"userSelect": "none"
		});
	};
	
})(jQuery, this);
