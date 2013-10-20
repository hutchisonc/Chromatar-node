var gm = require('gm')

var checkAlpha = function(image, callback){
	var img = gm(image)

	img.identify(callback)
}

module.exports.checkAlpha = checkAlpha

var genImage = function(image, color, callback){

	var img = gm(image)

	img.size(function(err, size){
		if(!err){
			var output = img
							.background(color)
							.extent(size.width, size.height)
							.toBuffer(callback)
		}
		else {
			callback(err)
		}

	})

}

module.exports.genImage = genImage