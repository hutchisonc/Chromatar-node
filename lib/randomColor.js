function randomColor(callback){

	callback(null, '#'+(Math.random()*0xFFFFFF<<0).toString(16))

}

module.exports = randomColor