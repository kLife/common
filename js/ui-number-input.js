
/* ---------------------------------------------------------------------- */
// ui-number-input.js
// - UI_NumberInput
(function (undefined) {
	
	/* -------------------------------------------------- */
	// UI_NumberInput Class
	// 
	function UI_NumberInput(options) {
		this.options = $.extend({}, UI_NumberInput.defaults, options);
		
		this.$container = null;
		this.$select = null;
		this.$selectText = null;
		this.$selectIcon = null;
		this.$inner = null;
		this.$input = null;
		this.$numberContainer = null;
		this.isOpen = false;
		
		this._create();
	}
	
	// Static members
	$.extend(UI_NumberInput, {
		defaults: {
			selectWidth: 100,
			listMarginLeft: 0,
			initText: 0,
			selectIcon: "▼",
			maxlength: Infinity,
			placeholder: 0,
			openListenerType: "hover", // click/hover
			onClose: $.noop,
			onChange: $.noop
		},
		documentClickHandlers: []
	});
	
	// Instance members
	UI_NumberInput.prototype = {
		
		getContainer: function() {
			return this.$container;
		},
		
		open: function() {
			if (!this.isOpen) {
				this.isOpen = true;
				this.$inner.show();
				this.$select.addClass("ui-numin-open");
			}
		},
		close: function() {
			if (this.isOpen) {
				this.isOpen = false;
				this.$inner.hide();
				this.$select.removeClass("ui-numin-open");
				this.options.onClose(this.getValue());
			}
		},
		
		getValue: function() {
			return parseInt(this.$selectText.text());
		},
		
		setValue: function(value) {
			this.$input.val(value);
			this.onChange();
		},
		
		setSelectText: function(value) {
			this.$selectText.html(value);
		},
		
		_create: function() {
			this._createFrame();
			this._setEventListener();
		},
		
		_createFrame: function() {
			this.$container = $("<div>").addClass("ui-numin");
			this.$select = $("<div>").addClass("ui-numin-select").css("width", this.options.selectWidth);
			this.$selectText = $("<div>").html(this.options.initText);
			this.$selectIcon = $("<div>").addClass("ui-numin-select-icon").text(this.options.selectIcon);
			this.$inner = $("<div>").addClass("ui-numin-inner").css("marginLeft", this.options.listMarginLeft)
			
			this.$select.append(this.$selectText, this.$selectIcon);
			this.$container.append(this.$select, this.$inner);
			
			// inner input
			var $inputContainer = $("<div>").addClass("ui-numin-input-container");
			var $inputMessage = $("<span>").text("入力");
			this.$input = $("<input>").attr("type", "text").val(this.options.initText);
			
			$inputContainer.append($inputMessage, this.$input);
			this.$inner.append($inputContainer);
			
			// inner numbers
			this.$numberContainer = $("<ul>").addClass("ui-numin-number-container");
			var $number0 = $("<li>").text(0);
			var $number1 = $("<li>").text(1);
			var $number2 = $("<li>").text(2);
			var $number3 = $("<li>").text(3);
			var $number4 = $("<li>").text(4);
			var $number5 = $("<li>").text(5);
			var $number6 = $("<li>").text(6);
			var $number7 = $("<li>").text(7);
			var $number8 = $("<li>").text(8);
			var $number9 = $("<li>").text(9);
			var $numberDel = $("<li>").addClass("ui-numin-number-del").text("DEL");
			var $numberOk = $("<li>").addClass("ui-numin-number-ok").text("OK");
			
			this.$numberContainer.append(
				$number7, $number8, $number9,
				$number4, $number5, $number6,
				$number1, $number2, $number3,
				$number0, $numberDel, $numberOk
			);
			this.$inner.append(this.$numberContainer);
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
					this.$select.add(this.$inner).hover(function() {
						!that.isOpen && that.open();
					}, function() {
						that.isOpen && that.close();
					});
					break;
			}
			
			// input change
			this.$input.on("change keyup", $.proxy(this.onChange, this));
			
			// number click
			this.$numberContainer.on("click", "li", function() {
				var $this = $(this);
				var numValue = $this.text();
				
				if (numValue === "OK") {
					that.close();
				} else if (numValue === "DEL") {
					that.$input.val(0);
				} else {
					that.$input.val(that.$input.val() + numValue);
				}
				
				that.onChange();
			});
			
		},
		
		onChange: function() {
			this.$input.val(parseInt(this.$input.val().slice(0, this.options.maxLength)) || 0);
			this.setSelectText(parseInt(this.$input.val()));
			this.options.onChange(this.getValue());
		}
	}
	
	$(document).ready(function() {
		$(document).on("click", function(e) {
			$.each(Koukun.cl.UI_NumberInput.documentClickHandlers, function(index, handler) {
				handler(e);
			});
		});
	});
	
	$.extend(Koukun.cl, {
		UI_NumberInput: UI_NumberInput
	});
})();
