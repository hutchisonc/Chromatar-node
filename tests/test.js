var should = require('chai').should()

var path = require('path')
var rootDir = path.join(__dirname, '..')

var imageHelper = require(rootDir + '/lib/imageHelper.js')
describe("Image Helper Tests", function() {

    it("should be a function", function(){
    	imageHelper.should.be.a('function')
    })

})