#!/usr/bin/env node
'use strict';

var fs = require('file-system');

/**
 * Helper Function(s)
 */
function returnValueIfSame(a, b){
  if(a == b)
    return a;

  return 0;
}

/**
 * Part 1
 */
// Read puzzle file contents
var inputPart1 = fs.readFileSync('./puzzle-input/part1.txt', 'utf8', function (err, data) {
  if (err) {
    return console.log(err);
  }
});

// Method that will calculate the result needed to solve the puzzle
function processPart1(input){
  var sum = 0;
  var inputArray = input.split('');

  inputArray.forEach((element, index) => {
      if(index == 0){
        sum += returnValueIfSame(+inputArray[index], +inputArray[inputArray.length-1]);
      }
      
      sum += returnValueIfSame(+inputArray[index], +inputArray[index + 1])
  });

  console.log(`The answer to part 1 is ${sum}`);
}

//processPart1("1122"); // should be 3
//processPart1("1111"); // should be 4
//processPart1("1234"); // should be 0
//processPart1("91212129"); // should be 9
processPart1(inputPart1);

/**
 * Part 2
 */
function processPart2(input){
  var sum = 0;
  var list = input.split('');
  var listSize = list.length;

  list.forEach((element, index) => {
    var oneBasedIndex = index + 1;    
    var oneBasedIndexToCompare = oneBasedIndex + (listSize / 2); 

    var indexToCompare = oneBasedIndex <= (listSize / 2) ? 
    oneBasedIndexToCompare : 
    oneBasedIndexToCompare % listSize;
    
    sum += returnValueIfSame(+list[index], +list[indexToCompare - 1])
  });

  console.log(`The answer to part 2 is ${sum}`);
}

//processPart2("1212"); // should be 6
//processPart2("1221"); // should be 0
//processPart2("123425"); // should be 4
//processPart2("123123"); // should be 12
//processPart2("12131415"); // should be 4
processPart2(inputPart1);