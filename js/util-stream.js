
/* ---------------------------------------------------------------------- */
// util-stream.js
// - Stream
(function(undefined) {
	
	/* -------------------------------------------------- */
	// Stream Class
	// Uint8Arrayのストリーム
	// getString 使う場合は encoding.js, encoding-indexes.js を読み込む
	// TODO: 各メソッドをBig Endianにも対応する
	// TODO: set系も作る
	function Stream(arrayBuffer, isLittleEndian) {
		this.arrayBuffer = arrayBuffer;
		this.data = new Uint8Array(this.arrayBuffer);
		this.byteLength = this.arrayBuffer.byteLength || this.arrayBuffer.length;
		this.position = 0;
		this.isLittleEndian = false;
		
		this.textDecoder = window.TextDecoder && new TextDecoder("utf-8");
	}
	
	Stream.prototype = {
		
		getArrayBuffer: function() {
			return this.arrayBuffer;
		},
		
		getData: function() {
			return this.data;
		},
		
		_checkBounds: function(position) {
			if (position > this.byteLength) {
				console.log("Caller: " + arguments.callee.caller.caller.prototype);
				throw new RangeError("Offsets are out of bounds. " + position);
			}
		},
		
		tell: function() {
			return this.position;
		},
		
		seek: function(position) {
			this._checkBounds(position);
			this.position = position;
		},
		
		skip: function(offset) {
			this._checkBounds(this.position + offset);
			this.position += offset;
		},
		
		getBytes: function(length) {
			this._checkBounds(this.position + length);
			this.position += length;
			
			return new Uint8Array(this.arrayBuffer, this.position, this.position + length);
		},
		
		getInt8: function(position) {
			return (this.getUint8(position) << 24) >> 24;
		},
		
		getUint8: function(position) {
			var pos = position === undefined ? this.position : position;
			var next = pos + 1;
			var data = this.data;
			
			this._checkBounds(next);
			this.position = next;
			
			return data[pos];
		},
		
		getInt16: function(position) {
			return (this.getUint16(position) << 16) >> 16;
		},
		
		getUint16: function(position) {
			var pos = position === undefined ? this.position : position;
			var next = pos + 2;
			var data = this.data;
			
			this._checkBounds(next);
			this.position = next;
			
			return (data[pos+1] << 8) | data[pos];
		},
		
		getInt32: function (position) {
			var pos = position === undefined ? this.position : position;
			var next = pos + 4;
			var data = this.data;
			
			this._checkBounds(next);
			this.position = next;
			
			return (data[pos+3] << 24) | (data[pos+2] << 16) | (data[pos+1] << 8) | data[pos];
		},
		
		getUint32: function(position) {
			return this.getInt32(position) >>> 0;
		},
		
		setTextEncodingType: function(type) {
			if (!TextDecoder) {
				console.log("Include encoding.js, encoding-indexes.js");
				return;
			}
			
			this.textDecoder = new TextDecoder(type);
		},
		
		getString: function(length) {
			if (!TextDecoder) {
				console.log("Include encoding.js, encoding-indexes.js");
				return;
			}
			
			var data = this.getBytes(length);
			
			return this.textDecoder.decode(new Uint8Array(data));
		}
	};
	
	$.extend(Koukun.cl, {
		Stream: Stream
	});
})();
