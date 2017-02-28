class UrlShare {
	constructor() {
		this.secret = 'e';
		this.decryptedData = {};
		this.inputs = {};
		this.url = '';
	}
	getInputs() {
		return this.inputs;
	}
	setInputs(inputs, cb) {
		this.inputs = inputs;
		this.createUrl(cb);
	}
	createUrl(cb) {
		var inputs = JSON.parse(JSON.stringify(this.inputs));
		this.compress(inputs, compressCb.bind(this));
		function compressCb(error, ciphertext) {
			if (error) {
				console.log(error);
				return;
			}
			this.url = ciphertext;
			cb(this.url);
		}
	}
	compress(jsonInput, cb) {
		if (!jsonInput) {
			return cb('Input should not be empty');
		} else {
			var packed = JSON.stringify(jsonInput);
			JSONURL.compress(packed, 9, function(res, error) {
				try {
					var result = SafeEncode.buffer(res);
					cb(null, SafeEncode.encode(result));
				} catch (e) {
					cb(e);
				}
			});
		}
	}

	decompress(compressed, cb) {
		var self = this;
		if (compressed) {
			var compressBuffer = SafeEncode.buffer(compressed);
			JSONURL.decompress(SafeEncode.decode(compressBuffer), function(res, error) {
				var decryptedData = res;
				try {
					if (decryptedData) {
						decryptedData = JSON.parse(decryptedData);
						self.decryptedData = decryptedData;
						cb(null, decryptedData);
					} else {
						cb('Not found');
					}
				} catch (e) {
					cb(e);
				}
			});
		} else {
			return cb('Empty');
		}
	}
	compressInputState(obj) {
		return new Promise((resolve, reject) => {
			var inputs = JSON.parse(JSON.stringify(obj));
			this.compress(inputs, compressCb.bind(this));
			function compressCb(error, ciphertext) {
				if(error) {
					reject(error);
				} else {
					resolve(ciphertext);
				}
			}
		});
	}
	redirectUrl(method) {
		return new Promise((resolve, reject) => {
			switch(method) {
				case 'dejavu':
					resolve(this.dejavuLink());
				break;
				case 'mirage':
					this.mirageLink().then((url) => {
						resolve(url);
					}).catch((error) => {
						reject(error)
					});
				break;
				case 'gem':
					resolve(this.convertToUrl());
				break;
			}
		});
	}
}
export const urlShare = new UrlShare();
