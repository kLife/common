
/* ---------------------------------------------------------------------- */
// ui-select.js
// - UI_Select
(function (undefined) {

	/* -------------------------------------------------- */
	// UI_Select Class
	// セレクトタグっぽいの
	/*
		options = {
			selectWidth: 100,
			listWidth: 300,
			optionWidth: 30,
			initText: "部類選択",
			selectIcon: "▼",
			isPageView: false, // new 2014.05.5
			isPageBtnOnTop: false, // new 2014.05.5
			openListenerType: "click", // click/hover
			onClick_option: function(){}
		};

		groupsData = [
			{
				groupName: "ステータス上昇",
				options: [
					{key: 1,  icon: "html", value: "text"},
					{key: 2,  icon: "html", value: "text"},
					{key: 3,  icon: "html", value: "text"},
					{key: 4,  icon: "html", value: "text"},
					{key: 5,  icon: "html", value: "text"},
					{key: 6,  icon: "html", value: "text"},
					{key: 7,  icon: "html", value: "text"}
				]
			}, ...
		];
	*/

	function UI_Select(options, groupsData) {
		// Constructor
		this.options = $.extend({}, UI_Select.defaults, options);
		this.groupsData = groupsData;

		this.$container = null;
		this.$select = null;
		this.$selectText = null;
		this.$selectIcon = null;
		this.$list = null;
		this.$groupWrapper = null;
		this.$grounps = null;
		this.$pageText = null;
		this.$btnPageLeft = null;
		this.$btnPageRight = null;

		this.isOpen = false;
		this.indexTable = {};
		this.firstOptionKey = undefined;
		this.selectedKey = undefined;
		this.pageNumber = 0;

		this._create();
	}

	// Static members
	$.extend(UI_Select, {
		defaults: {
			selectWidth: 100,
			listWidth: 260,
			listMarginLeft: 0,
			optionWidth: 75,
			initText: "選択",
			selectIcon: "▼",
			isPageView: false, // new 2014.05.5
			isPageBtnOnTop: false, // new 2014.05.5
			isPanelView: false, // 2014.09.17
			openListenerType: "hover", // click/hover
			onClick_option: $.noop
		},
		documentClickHandlers: [],
	});

	// Instance members
	UI_Select.prototype = {

		getContainer: function() {
			return this.$container;
		},

		getIndexData: function(key) {
			if (key === undefined) {
				return null
			}

			return this.indexTable[key];
		},

		getElem: function(key) {
			var indexData = this.getIndexData(key);

			if (indexData) {
				return this.$list
					.find("li.ui-select-group").eq(indexData.groupIndex)
					.find("li").eq(indexData.optionIndex);
			}
		},

		getOption: function(key) {
			var indexData = this.getIndexData(key);

			if (indexData) {
				return this.groupsData[indexData.groupIndex].options[indexData.optionIndex];
			}
		},

		getSelectedElem: function() {
			return this.getElem(this.selectedKey);
		},

		getSelectedOption: function() {
			return this.getOption(this.selectedKey);
		},

		getSelectedValue: function() {
			var option = this.getSelectedOption()
			return option ? option.value : "";
		},

		setSelectText: function(value) {
			this.$selectText.html(value);
		},

		reset: function(options, groupsData) {
			this.options = $.extend({}, this.options, options);
			this.groupsData = groupsData;

			this._createListInner();
			this.setSelectText(this.options.initText)
			this.$selectIcon.text(this.options.selectIcon);
			this.$select.css("width", this.options.selectWidth);
			this.$list.css({
				width: this.options.listWidth,
				marginLeft: this.options.listMarginLeft
			});
		},

		select: function(key) {
			var indexes;

			if (key === undefined) {
				if (this.firstOptionKey !== undefined) {
					key = this.firstOptionKey;
				} else {
					return;
				}
			}

			indexes = this.indexTable[key];

			if (indexes) {
				this.$list
					.find("li.ui-select-group").eq(indexes.groupIndex)
					.find("li").eq(indexes.optionIndex)
					.trigger("click", true);
				this.turnPage(indexes.groupIndex);
			} else {
				Koukun.fn.log("Error[UI_Select.select]: indexTable[" + key +"] is not defined.");
			}
		},

		reselect: function() {
			this.select(this.selectedKey);
		},

		open: function() {
			if (!this.isOpen) {
				this.isOpen = true;
				this.$list.show();
				this.$select.addClass("ui-select-open");
			}
		},

		close: function() {
			if (this.isOpen) {
				this.isOpen = false;
				this.$list.hide();
				this.$select.removeClass("ui-select-open");
			}
		},

		leftPage: function() {
			if (this.pageNumber > 0) {
				this.turnPage(this.pageNumber - 1);
			}
		},

		rightPage: function() {
			if (this.pageNumber < this.$grounps.length - 1) {
				this.turnPage(this.pageNumber + 1);
			}
		},

		turnPage: function(pageNumber) {
			if (this.options.isPageView) {
				this.pageNumber = pageNumber;
				this.$grounps.hide().eq(this.pageNumber).show();
				this.$pageText.text((this.pageNumber + 1) + "/" + this.$grounps.length);
				this.$btnPageRight.toggleClass("ui-select-page-disable", this.pageNumber >= this.$grounps.length - 1);
				this.$btnPageLeft.toggleClass("ui-select-page-disable", this.pageNumber <= 0);
			}
		},

		_create: function() {
			this._createFrame();
			this._createListInner();
			this._setEventListener();
		},

		_createFrame: function() {
			this.$container = $("<div>").addClass("ui-select");
			this.$select = $("<div>").addClass("ui-select-select").css("width", this.options.selectWidth);
			this.$selectText = $("<div>").html(this.options.initText);
			this.$selectIcon = $("<div>").addClass("ui-select-icon").text(this.options.selectIcon);
			this.$list = $("<ul>").addClass("ui-select-list").css({
				width: this.options.listWidth,
				marginLeft: this.options.listMarginLeft
			});
			this.$groupWrapper = $("<div>").addClass("ui-select-wrapper");

			this.$select.append(this.$selectText, this.$selectIcon);
			this.$list.html(this.$groupWrapper);
			this.$container.append(this.$select, this.$list);

			// Setting panel-view
			if (this.options.isPanelView) {
				this.$list.addClass("ui-select-panel-view");
			}

			// create page form
			if (this.options.isPageView) {
				var $pageForm = $("<div class='ui-select-page-form'>");
				this.$pageText = $("<div class='ui-select-page-text'>");
				this.$btnPageLeft = $("<div class='ui-select-page-left'>").text("< 前");
				this.$btnPageRight = $("<div class='ui-select-page-right'>").text("次 >");
				this.pageNumber = 0;
				$pageForm.append([this.$btnPageLeft, this.$pageText, this.$btnPageRight]);

				this.options.isPageBtnOnTop ?
				 	this.$list.prepend($pageForm) :
				 	this.$list.append($pageForm);
			}
		},

		_createListInner: function() {
			var strGroups = "";
			var i, j, groupName, options, option, strType, strOpContainer, strOptions, strOpIcon;

			this.indexTable = {};
			this.firstOptionKey = undefined;
			this.selectedKey = undefined;

			// 高速化？
			// フラグメント使う
			for (i = 0; i < this.groupsData.length; i++) {
				groupName = this.groupsData[i].groupName;
				options = this.groupsData[i].options;
				strOptions = "";

				if (typeof groupName === "string" && groupName !== "") {
					strType = "<div class='ui-select-type'>" + groupName + "</div>";
				} else {
					strType = "";
				}

				if (options.length > 0) {
					this.firstOptionKey = this.firstOptionKey || options[0].key;
				}

				for (j = 0; j < options.length; j++) {
					option = options[j];
					strOpIcon = option.icon ? option.icon + " " : "";
					this.indexTable[option.key] = {
						groupIndex: i,
						optionIndex: j
					};

					if (this.options.isPanelView) {
						strOptions += "<li style='width:" + this.options.optionWidth + "px'>" +
							"<div>" + strOpIcon + "</div>" + option.value + "</li>";
					} else {
						strOptions += "<li style='width:" + this.options.optionWidth + "px'>" +
							strOpIcon + " " + option.value + "</li>";
					}

				}

				strOpContainer = "<ul class='ui-select-options'>" + strOptions + "</ul>";
				strGroups += "<li class='ui-select-group' " + (options.length == 0 ? "style='display: none'" : "") + ">" +
					strType + strOpContainer + "</li>";
			}

			this.$groupWrapper.html(strGroups)

			if (this.options.isPageView) {
				this.$grounps = this.$list.find(".ui-select-group");
				this.$pageText.text((this.pageNumber + 1) + "/" + this.$grounps.length);
				this.$grounps.hide().eq(0).show();
				this.turnPage(0);
			}
		},

		_setEventListener: function() {
			var that = this;

			// List open/close
			switch (this.options.openListenerType) {
				case "click":
					this.$select.on("click", function() {
						that.isOpen ? that.close() : that.open();
					});
					Koukun.cl.UI_Select.documentClickHandlers.push(function(e) {
						if (that.isOpen && !$.contains(that.$container.get(0), e.target)) {
							that.close();
						}
					});
					break;
				case "hover":
					this.$select.add(this.$list).hover(function() {
						!that.isOpen && that.open();
					}, function() {
						that.isOpen && that.close();
					});
					break;
			}

			// option click
			this.$list.on("click", "ul li", function(ev, isTriggered) {
				var $this = $(this);
				var $group = $this.parent().parent();
				var optionIndex = $this.index();
				var groupIndex = $group.index();
				var option = that.groupsData[groupIndex].options[optionIndex];
				var $selected = that.getSelectedElem();

				$selected && $selected.removeClass("ui-select-selected");
				$this.addClass("ui-select-selected");

				that.selectedKey = option.key;
				that.setSelectText(that.getSelectedValue());
				that.close();
				that.options.onClick_option(option.key, option.value, isTriggered);
			});

			// option hover
			this.$list.on("mouseenter", "ul li", function(ev, isTriggered) {
				var $this = $(this);
				var $group = $this.parent().parent();
				var option = that.groupsData[$group.index()].options[$this.index()];

				that.setSelectText(option.value);
			}).on("mouseleave", "ul li", function(ev, isTriggered) {
				if (this.isOpen) {
					that.setSelectText(that.getSelectedValue());
				}
			});

			// page form
			if (this.options.isPageView) {
				this.$btnPageLeft.on("click", $.proxy(this.leftPage, this));
				this.$btnPageRight.on("click", $.proxy(this.rightPage, this));
			}
		}

	}

	$(document).ready(function() {
		$(document).on("click", function(e) {
			$.each(Koukun.cl.UI_Select.documentClickHandlers, function(index, handler) {
				handler(e);
			});
		});
	});

	$.extend(Koukun.cl, {
		UI_Select: UI_Select
	});
})();
