#!/usr/bin/env node
'use strict';

var day10 = require('../day-10/index');
var helpers = require('../helpers');

var inputExample = "flqrgnkx";
var input = "ljoxqyyw";

/**
 * Helpers
 */
String.prototype.paddingLeft = function (paddingValue) {
  return String(paddingValue + this).slice(-paddingValue.length);
};

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

/**
 *  Part 1 Helpers
 */
function generateKnotHashes(puzzleInput) {
  var knotHashes = [];

  for (var i = 0; i < 128; i++) {
    var stringToHash = `${puzzleInput}-${i}`;

    knotHashes.push(day10.calculateKnotHash(stringToHash));
  }

  return knotHashes;
}

function generateRowsFromKnotHashes(knotHashes) {
  var rows = [];

  knotHashes.forEach(knotHash => {
    var row = [];

    knotHash.split("").forEach(char => {
      // convert from hex to a binary string
      var paddedHex = helpers.pad(helpers.Hex2Bin(char), 4).replace(/1/g, "#").replace(/0/g, ".");

      paddedHex.split("").forEach(character => {
        row.push(character);
      });
    });

    rows.push(row);
  });

  return rows;
}

function getUsedCountFromRows(rows) {
  var count = 0;

  rows.forEach(row => {
    row.forEach(character => {
      if (character == "#") {
        count++;
      }
    });
  });

  return count;
}

/**
 *  Part 1
 */
function solvePart1() {
  var knotHashes = generateKnotHashes(input);
  var rows = generateRowsFromKnotHashes(knotHashes);
  var count = getUsedCountFromRows(rows);

  console.log(`Part 1: Given your actual key string, how many squares are used? - ${count}`)
}

solvePart1();

/**
* Part 2
*/
function processRows(rows) {
  var instances = [];

  rows[0][0] = 1;
  var currentCount = 0;

  for (var i = 0; i < 128; i++) {
    for (var j = 0; j < 128; j++) {

      var current = rows[i][j];

      if (current == "#") {
        currentCount++;
        rows[i][j] = currentCount;
        current = rows[i][j];
      }

      if (Number.isInteger(current)) {
        var rowPrevious = rows[i - 1];
        var rowCurrent = rows[i];
        var rowNext = rows[i + 1];

        var up = rowPrevious == null ? null : rows[i - 1][j];
        var down = rowNext == null ? null : rows[i + 1][j];
        var left = rows[i][j - 1];
        var right = rows[i][j + 1];

        // we already have a number -> optimize the grid
        var candidates = [];

        candidates.push(Number.isInteger(current) ? current : Number.MAX_SAFE_INTEGER);
        candidates.push(Number.isInteger(up) ? up : Number.MAX_SAFE_INTEGER);
        candidates.push(Number.isInteger(right) ? right : Number.MAX_SAFE_INTEGER);
        candidates.push(Number.isInteger(down) ? down : Number.MAX_SAFE_INTEGER);
        candidates.push(Number.isInteger(left) ? left : Number.MAX_SAFE_INTEGER);

        rows[i][j] = Math.min(...candidates);

        instances.push(rows[i][j]);
      }
    }
  }

  return [...new Set(instances)].length;
}

function solvePart2() {
  var grid = [];

  var knotHashes = generateKnotHashes(input);
  var rows = generateRowsFromKnotHashes(knotHashes);

  var currentCount = 0;

  // Note: I don't love this; because we sweet from left -> right, top -> bottom we may generate a new number
  // because the neighbor simply hasn't been found yet. After initializing the grid, we pass through it multiple
  // times, grabbing the smallest neighbor, and then updating current to that smallest neighbor
  for (var i = 0; i < 128; i++) {
    currentCount = processRows(rows);
  }

  //debugging - print first 8 rows/columns
  // for (var i = 0; i < 8; i++) {
  //   var row = "";
  //   for (var j = 0; j < 8; j++) {
  //     row += rows[i][j].toString().paddingLeft("    ");
  //   }
  //   console.log(row);
  // }
  // console.log("\r\n");

  console.log(`Part 2: How many regions are present given your key string? - ${currentCount}`);
}

solvePart2();