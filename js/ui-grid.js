
/* ---------------------------------------------------------------------- */
// ui-grid.js
// - UI_Grid
(function (undefined) {
	
	/* -------------------------------------------------- */
	// UI_Grid Class
	// テーブル
	/*
		options = {
			containerWidth: 200,
			containerHeight: 100,
			rowHeight: 25,
			headerRowHeight: 25,
			defaultColumnWidth: 80,
			multiSelect: false,
			onSelectRow: function(selectedIndex) {
				
			}
		};
		
		columns = [
		    {field: "name",      name: "Name",      width: 120},
		    {field: "extention", name: "Extention", width: 50},
		    {field: "size",      name: "Size",      width: 70},
		];
		
		datas = [
			{name: "koukun", extention: "js", size: 1000}
		];
		
	*/
	
	function UI_Grid(options, columns, datas) {
		this.options = $.extend({}, UI_Grid.defaults, options);
		this.columns = columns;
		this.datas = datas;
		this.fields = [];
		
		this.$container;
		this.$head;
		this.$body;
		this.$headTable;
		this.$bodyTable;
		this.$bodyTableInner;
		
		this.selectedIndex = -1;
		this.selectedRange = [-1, -1]; // multi select
		
		this._create();
	}
	
	// Static members
	$.extend(UI_Grid, {
		defaults: {
			containerWidth: 200,
			containerHeight: 100,
			rowHeight: 25,
			headerRowHeight: 25,
			defaultColumnWidth: 80,
			autoScrollMargin: 25,
			animationInterval: 100,
			multiSelect: false,
			allowLoop: false,
			allowReselect: false,
			onSelectRow: $.noop
		},
		columnDefaults: {
			name: ""
		},
		keyCode: {
			left: 37,
			up: 38,
			right: 39,
			down: 40
		}
	});
	
	// Instance members
	UI_Grid.prototype = {
		
		getContainer: function() {
			return this.$container;
		},
		
		getSelectedIndex: function() {
			return this.selectedIndex;
		},
		
		getSelectedRange: function() {
			return this.selectedRange;
		},
		
		getSelectedData: function() {
			return this.datas[this.selectedIndex];
		},
		
		add: function(data) {
			var that = this;
			var $tr = $("<tr>");
			
			this.datas.push(data);
			
			this.fields.forEach(function(field, index) {
				var $text = $("<span>").text(data[field]);
				var $inner = $("<div>").append($text).css({
					width: that.columns[index].width,
					height: that.options.rowHeight
				});
				var $td = $("<td>").append($inner)
				$tr.append($td);
			});
			
			this.$bodyTable.append($tr);
			this.onChangeBodyTable();
		},
		
		clear: function() {
			this.datas = [];
			this.selectedIndex = -1;
			this.selectedRange = [-1, -1]; // multi select
			this.$bodyTable.empty();
			this.onChangeBodyTable();
		},
		
		resetDatas: function(datas) {
			this.clear();
			this.datas = datas;
			this._createInner();
		},
		
		selectRow: function(index) {
			if (!this.options.allowReselect && index === this.selectedIndex) {
				return;
			}
			
			if (index < 0 || this.datas.length - 1 < index) {
				return;
			}
			
			if (!this.options.multiSelect) {
				this.$bodyTableInner.eq(this.selectedIndex).removeClass("selected-row");
				this.$bodyTableInner.eq(index).addClass("selected-row");
			} else {
				// TODO: multi row select
			}
			
			this.selectedIndex = index;
			this._autoScroll();
			this.options.onSelectRow(index, this.datas[index]);
		},
		
		navigateUp: function() {
			var next = this.selectedIndex - 1;
			
			if (this.options.allowLoop === true && next === -1) {
				next = this.datas.length - 1;
			}
			
			this.selectRow(next);
		},
		
		navigateDown: function() {
			var next = this.selectedIndex + 1;
			
			if (this.options.allowLoop === true && next === this.datas.length) {
				next = 0;
			}
			
			this.selectRow(next);
		},
		
		navigateTop: function() {
			this.selectRow(0);
		},
		
		navigateBottom: function() {
			this.selectRow(this.datas.length - 1);
		},
		
		navigatePlay: function() {
			if (this.intervalId) {
				return;
			}
			
			this.intervalId =
				window.setInterval($.proxy(this.navigateDown, this), this.options.animationInterval);
		},
		
		navigateStop: function() {
			window.clearInterval(this.intervalId);
			this.intervalId = null;
		},
		
		_create: function() {
			this._createFieldList();
			this._createFrame();
			this._createInner();
			this._setEventHandler();
		},
		
		_createFieldList: function() {
			this.fields = $.map(this.columns, function(index, column) {
				return column.field;
			});
		},
		
		_createFrame: function() {
			var that = this;
			
			this.$container = $("<div>").addClass("ui-grid").css({
				width: this.options.containerWidth,
				height: this.options.containerHeight
			});
			this.$head = $("<div>").addClass("ui-grid-head").css({
				width: this.options.containerWidth,
				height: this.options.headerRowHeight + 2 // border
			});
			this.$body = $("<div>").addClass("ui-grid-body").css({
				width: this.options.containerWidth,
				height: this.options.containerHeight - this.options.headerRowHeight - 2 // border
			});
			this.$headTable = $("<table>").css("line-height", that.options.headerRowHeight + "px");
			this.$bodyTable = $("<table>").css("line-height", that.options.rowHeight + "px");
			
			// Create head
			this.columns.forEach(function(column, index) {
				var $text = $("<span>").text(column.name);
				var $inner = $("<div>").append($text).css({
					width: column.width,
					height: that.options.headerRowHeight
				});
				var $td = $("<td>").append($inner)
				that.$headTable.append($td);
				that.fields.push(column.field);
			});
			
			this.$head.append(this.$headTable);
			this.$container.append(this.$head);
		},
		
		_createInner: function() {
			var that = this;
			var tableInner = "";
			
			this.datas.forEach(function(data) {
				var trInnner = "";
				
				that.fields.forEach(function(field, index) {
					var text = "<span>" + data[field] + "</span>"
					var inner = "<div style='" +
						"width:" + that.columns[index].width + "px;" +
						"height:" +  that.options.rowHeight + "px;" +
						"'>" + text + "</div>";
					trInnner += "<td>" + inner + "</td>";
				});
				
				tableInner += "<tr>" + trInnner +"</tr>";
			});
			
			this.$bodyTable.append(tableInner);
			this.$body.append(this.$bodyTable);
			this.$container.append(this.$body);
			
			this.onChangeBodyTable();
		},
		
		_setEventHandler: function() {
			var that = this;
			
			this.$bodyTable.on("mousedown", "tr", function(ev) {
				that.selectRow($(this).index());
			});
			
			this.$bodyTable.on("keydown", $.proxy(this.onKeydown, this));
		},
		
		_autoScroll: function() {
			var rowHeight = this.options.rowHeight + 1;
			var autoScrollMargin = this.options.autoScrollMargin;
			
			var contentHeight = this.$body.height();
			var contentTop = this.$body.scrollTop();
			var contentBottom = contentTop + contentHeight;
			var selectedRowTop = this.selectedIndex * rowHeight;
			var selectedRowBottom = selectedRowTop + rowHeight + 1;
			
			if (selectedRowTop < contentTop + autoScrollMargin) {
				// up
				this.$body.scrollTop(selectedRowTop - autoScrollMargin);
			} else if (selectedRowTop + rowHeight > contentBottom - autoScrollMargin) {
				// down
				this.$body.scrollTop(selectedRowBottom - contentHeight + autoScrollMargin);
			}
		},
		
		onChangeBodyTable: function() {
			this.$bodyTableInner = this.$bodyTable.find("tr");
			this.$bodyTableInner.attr("tabindex", 0);
		},
		
		onKeydown: function(ev) {
			ev.stopPropagation();
			ev.preventDefault();
			
			// TODO: shiftKey for multi select
			
			switch (ev.which) {
			case UI_Grid.keyCode.up:
				this.navigateUp();
				break;
			case UI_Grid.keyCode.down:
				this.navigateDown();
				break;
			case UI_Grid.keyCode.left:
				this.navigateTop();
				break;
			case UI_Grid.keyCode.right:
				this.navigateBottom();
				break;
			}
		},
		
	};
	
	
	$.extend(Koukun.cl, {
		UI_Grid: UI_Grid
	});
})();
