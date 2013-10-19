var gm = require('gm')

var genImage(image, color, callback){

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

})

module.exports = genImage