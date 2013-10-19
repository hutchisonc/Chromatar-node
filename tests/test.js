var should = require('chai').should()

var path = require('path')
var rootDir = path.join(__dirname, '..')

var imageHelper = require(rootDir + '/lib/imageHelper.js')
describe("Image Helper Tests", function() {

    it("should be a function", function(){
    	imageHelper.should.be.a('function')
    })

})

var randomColor = require(rootDir + '/lib/randomColor.js')
describe("Random Color Tests", function() {
	it("should be a function", function() {
		randomColor.should.be.a('function')
	})
	it("Should return a hex color", function() {
		randomColor(function(err, color) {
			should.exist(color)
			color.should.be.a('string')
			color.should.have.string('#')
			color.length.should.equal(7)
		})
	})
})