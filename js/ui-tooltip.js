
/* ---------------------------------------------------------------------- */
// ui-tooltip.js
// - UI_TooltipFrame
(function (undefined) {
	
	/* -------------------------------------------------- */
	// UI_TooltipFrame Class
	/*
	 * 参考:
	 * 四つ葉日記 アイテムデータベース
	 * http://dl.dropboxusercontent.com/u/70568694/ItemDataBase/DataBaseIndex.html
	 *
	 * 四つ葉日記
	 * http://yotsubadiary3.blog.fc2.com/
	 */
	function UI_TooltipFrame(innerContent) {
		this.$tooltipFrame = UI_TooltipFrame._$frameTemplate.clone(false);
		this.$tooltipContent = this.$tooltipFrame.find(".item-details");
		innerContent && this.setContent(innerContent);
	}
	
	// Static members
	$.extend(UI_TooltipFrame, {
		_$frameTemplate: (function() {
			var $itemToolTip = $("<div class='ui-tooltip'>");

			var $frameTable = $("<table class='tooltip-frame'>");
			var $frameTR_Top = $("<tr>");
			var $frameTR_Center = $("<tr>");
			var $frameTR_Bottom = $("<tr>");
			var $frameTD_TopLeft = $("<td class='frame-topleft'>");
			var $frameTD_TopCenter = $("<td class='frame-topcenter'>");
			var $frameTD_TopRight = $("<td class='frame-topright'>");
			var $frameTD_CenterLeft = $("<td class='frame-centerleft'>");
			var $frameTD_Content = $("<td class='frame-content'>");
			var $frameTD_CenterRight = $("<td class='frame-centerright'>");
			var $frameTD_BottomLeft = $("<td class='frame-bottomleft'>");
			var $frameTD_BottomCenter = $("<td class='frame-bottomcenter'>");
			var $frameTD_BottomRight = $("<td class='frame-bottomright'>");
			
			var $itemDetail = $("<div class='item-details'>");
			
			$itemToolTip
				.append($frameTable
					.append($frameTR_Top
						.append($frameTD_TopLeft)
						.append($frameTD_TopCenter)
						.append($frameTD_TopRight))
					.append($frameTR_Center
						.append($frameTD_CenterLeft)
						.append($frameTD_Content
							.append($itemDetail))
						.append($frameTD_CenterRight))
					.append($frameTR_Bottom
						.append($frameTD_BottomLeft)
						.append($frameTD_BottomCenter)
						.append($frameTD_BottomRight)));
			
			return $itemToolTip;
		})()
	});
	
	// Instance members
	UI_TooltipFrame.prototype = {
	
		getFrame: function() {
			return this.$tooltipFrame;
		},
		
		setContent: function(innerContent) {
			this.$tooltipContent.html(innerContent);
		},
		
		addContent: function(innerContent) {
			this.$tooltipContent.append(innerContent);
		},
		
		clearContent: function() {
			this.$tooltipContent.empty();
		}
	};
	
	$.extend(Koukun.cl, {
		UI_TooltipFrame: UI_TooltipFrame
	});
})();
