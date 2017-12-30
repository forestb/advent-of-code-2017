#!/usr/bin/env node
'use strict';

var helpers = require('../helpers');
var extensions = require('../extensions');

// const console = require('console-sync');
const util = require('util');

// https://www.npmjs.com/package/array2d#features--quick-reference
const Array2D = require('array2d');

/**
 * Part 1
 */
function initializeRules(input) {
  var rules = [];

  input.split("\r\n").forEach(rule => {
    rules.push({
      inputRule: rule.split("=>")[0].trim(),
      outputRule: rule.split("=>")[1].trim()
    });
  });

  return rules;
}

function convertStringToGrid(s) {
  var grid = [];
  var rows = s.split("/");

  rows.forEach(row => {
    grid.push([]);
    row.split("").forEach(column => {
      grid[grid.length - 1].push(column);
    });
  });

  return grid;
}

function convertGridToString(grid) {
  var s = "";

  grid.forEach(row => {
    row.forEach(column => {
      s += column;
    });

    s += "/";
  });

  return s.substr(0, s.length - 1);
}

function printGrid(grid) {
  require('console-sync');

  grid.forEach(row => {
    console.log(row);
  });

  console.log("");
}

function printAsync(s){
  require('console-sync');
  console.log(s);
}

function breakPixels(grid, rules) {
  var grids = [];
  var gridSize = Array2D.width(grid);

  // If the size is evenly divisible by 2, break the pixels up into 2x2 squares
  // Otherwise, the size is evenly divisible by 3; break the pixels up into 3x3 squares
  var offset = (gridSize % 2 == 0 ? 2 : 3);

  for (var i = 0; i < Array2D.height(grid); i += offset) {
    for (var j = 0; j < Array2D.width(grid); j += offset) {
      grids.push(Array2D.crop(grid, i, j, offset, offset));
    }
  }

  return grids;
}

function convertPixels(grid, rules) {
  var gridSize = Array2D.width(grid);

  // If the size is evenly divisible by 2, convert each 2x2 square into a 3x3 square by following the corresponding enhancement rule.
  // Otherwise, the size is evenly divisible by 3; convert each 3x3 square into a 4x4 square by following the corresponding enhancement rule.

  // The artist's book of enhancement rules is nearby (your puzzle input); however, it seems to be missing rules. The artist explains that 
  // sometimes, one must rotate or flip the input pattern to find a match. (Never rotate or flip the output pattern, though.)

  // Generate grid variations, then look for any matching corresponding rules
  var gridVariationStrings = [];

  gridVariationStrings.push(convertGridToString(grid));
  gridVariationStrings.push(convertGridToString(Array2D.vflip(grid)));
  gridVariationStrings.push(convertGridToString(Array2D.hflip(grid)));

  grid = Array2D.rrotate(grid);

  gridVariationStrings.push(convertGridToString(grid));
  gridVariationStrings.push(convertGridToString(Array2D.vflip(grid)));
  gridVariationStrings.push(convertGridToString(Array2D.hflip(grid)));

  grid = Array2D.rrotate(grid);

  gridVariationStrings.push(convertGridToString(grid));
  gridVariationStrings.push(convertGridToString(Array2D.vflip(grid)));
  gridVariationStrings.push(convertGridToString(Array2D.hflip(grid)));

  grid = Array2D.rrotate(grid);

  gridVariationStrings.push(convertGridToString(grid));
  gridVariationStrings.push(convertGridToString(Array2D.vflip(grid)));
  gridVariationStrings.push(convertGridToString(Array2D.hflip(grid)));

  // If no rules are found, an error has occured
  for (var i = 0; i < rules.length; i++) {
    var rule = rules[i];

    if (gridVariationStrings.includes(rule.inputRule)) {
      return convertStringToGrid(rule.outputRule);
    }
  }

  throw new Error("No input rule was matched.");
}

function joinGrids(grids) {
  if (grids.length == 1) {
    return grids[0];
  }

  // stitch grids together
  var index = 0;
  var count = Math.sqrt(grids.length);

  var width = Array2D.width(grids[0]);
  var height = Array2D.height(grids[0]);

  var grid = null;

  for (var i = 0; i < height * count; i += height) {
    for (var j = 0; j < width * count; j += width) {
      if (grid == null) {
        grid = grids[index];
      }
      else {
        // var isInBounds = Array2D.inBounds(grid, i, j);
        // var currentValue = Array2D.get(grid, i, j);

        // Note: This is a bit of a pain; it appears the library requires grids to be rectangular and fills
        // empty positions with 'null'.  If then a value is "glued" to those coordinates, the nulls are pushed over
        // and down then extending the rectangle even more.  We need to use the "paste" function instead, for these situations
        // if(!isInBounds){
        //   grid = Array2D.glue(grid, grids[index], i, j);
        // }
        // else if(isInBounds && currentValue == null){
        //   grid = Array2D.paste(grid, grids[index], i, j);
        // }

        grid = Array2D.glue(grid, grids[index], i, j);
      }

      // printGrid(grid);

      index++;
    }
  }

  grid = Array2D.crop(grid, 0, 0, count * width, count * height);
  return grid;
}

function solve() {
  var input = helpers.GetFileContentsSync("../puzzle-input/day-21-part1.txt");
  //var input = helpers.GetFileContentsSync("../puzzle-input/day-21-part1-example.txt");
  var rules = initializeRules(input);
  var grid = convertStringToGrid(".#./..#/###");

  var iterationCount = 5;

  for (var i = 0; i < iterationCount; i++) {
    printAsync(`Iteration ${i}...`);

    var brokenGrids = breakPixels(grid);
    var convertedGrids = [];

    brokenGrids.forEach(grid => {
      var convertedGrid = convertPixels(grid, rules);
      convertedGrids.push(convertedGrid);
      // printGrid(convertedGrid);
    });

    grid = joinGrids(convertedGrids);
    // printGrid(grid);
  }

  var onCount = convertGridToString(grid).split("#").length - 1;

  console.log(`Part 1: How many pixels stay on after 5 iterations? - ${onCount}`);
}

solve();