const sharp = require('sharp')

module.exports = options => input => {
	options = Object.assign({
    width: 2000,
    height: undefined,
	}, options);

	if (!Buffer.isBuffer(input)) {
		return Promise.reject(new TypeError('Expected a buffer'));
	}

  return sharp(input).resize(options.width, options.height).toBuffer()
}