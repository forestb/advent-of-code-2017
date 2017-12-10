var index = require('../index');

// https://mochajs.org/#getting-started
var assert = require('assert');
describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal([1,2,3].indexOf(4), -1);
    });
  });
});

describe("Calculations", function(){
    describe("#DenseHash()", function(){
        it("Should be equal to 64 and have length == 1", function(){
            var sampleDenseHashInput = "65 ^ 27 ^ 9 ^ 1 ^ 4 ^ 3 ^ 40 ^ 50 ^ 91 ^ 7 ^ 6 ^ 0 ^ 2 ^ 5 ^ 68 ^ 22".replace(" ", "").split("^");
            var denseHashSample = index.getCalculatedDenseHash(sampleDenseHashInput);
    
            assert.equal(denseHashSample[0], 64);
            assert.equal(denseHashSample.length, 1);
        })
    })    
})

describe("Part2", function(){
    describe("#DenseHashStringTests", function(){
        var input, output = "";

        input = "", output = "a2582a3a0e66e6e86e3812dcb672a272";
        it(`${input} should be ${output}`, function(){
            assert.equal(index.solvePart2(input), output);
        });

        input = "AoC 2017", output = "33efeb34ea91902bb2f59c9920caa6cd";
        it(`${input} should be ${output}`, function(){
            assert.equal(index.solvePart2(input), output);
        });

        input = "1,2,3", output = "3efbe78a8d82f29979031a4aa0b16a9d";
        it(`${input} should be ${output}`, function(){
            assert.equal(index.solvePart2(input), output);
        });

        input = "1,2,4", output = "63960835bcdc130f0b66d7ff4f6a5a8e";
        it(`${input} should be ${output}`, function(){
            assert.equal(index.solvePart2(input), output);
        });
    })    
})