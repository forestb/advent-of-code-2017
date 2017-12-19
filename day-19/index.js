#!/usr/bin/env node
'use strict';

var helpers = require('../helpers');
var extensions = require('../extensions');

const util = require('util')

/**
 * Classes/Helpers
 */
var cardinalDirections = { north: "north", south: "south", east: "east", west: "west" };
var characters = { vertical: "|", horizontal: "-", turn: "+" };

function Point(i, j) {
  this.i = i;
  this.j = j;
}

Point.prototype.toString = function () {
  return `${this.i}, ${this.j}`;
}

function Node(position, direction) {
  this.position = position;
  this.direction = direction;
}

Node.prototype.print = function () {
  console.log(util.inspect(this));
}

Node.prototype.moveForward = function () {
  if (this.direction == cardinalDirections.north) {
    this.position = new Point(this.position.i - 1, this.position.j);
  }
  else if (this.direction == cardinalDirections.east) {
    this.position = new Point(this.position.i, this.position.j + 1);
  }
  else if (this.direction == cardinalDirections.south) {
    this.position = new Point(this.position.i + 1, this.position.j);
  }
  else if (this.direction == cardinalDirections.west) {
    this.position = new Point(this.position.i, this.position.j - 1);
  }
}

Node.prototype.isWithinBounds = function (grid) {
  return this.position.i >= grid.minRow &&
    this.position.i < grid.maxRow &&
    this.position.j >= grid.minCol &&
    this.position.j < grid.maxCol &&
    this.isValidPosition(grid);
}

Node.prototype.getCharAtPosition = function (grid) {
  return this.isValidPosition(grid) ? grid.rows[this.position.i][this.position.j] : null;
}

Node.prototype.isValidPosition = function (grid) {
  return grid.rows[this.position.i] != null && grid.rows[this.position.i][this.position.j] != null && grid.rows[this.position.i][this.position.j] != " ";
}

Node.prototype.updateDirection = function (grid) {
  if (this.direction == cardinalDirections.north || this.direction == cardinalDirections.south) {
    // can turn east or west
    var clonedNode = helpers.Clone(this);
    var eastNode = new Node(clonedNode.position, cardinalDirections.east);
    eastNode.moveForward();

    this.direction = (eastNode.getCharAtPosition(grid) != null ? cardinalDirections.east : cardinalDirections.west);
    return;
  }
  else if (this.direction == cardinalDirections.east || this.direction == cardinalDirections.west) {
    // can turn north or south
    var clonedNode = helpers.Clone(this);
    var northNode = new Node(clonedNode.position, cardinalDirections.north);
    northNode.moveForward();

    this.direction = (northNode.getCharAtPosition(grid) != null ? cardinalDirections.north : cardinalDirections.south);
    return;
  }
}

/**
 * Part 1
 */
function parseGrid(gridString) {
  var rows = [];

  gridString.split("\r\n").forEach(row => {
    rows.push([]);
    row.split("").forEach(column => {
      rows[rows.length - 1].push(column);
    });
  });

  var grid = {
    rows: rows,
    minRow: 0,
    maxRow: rows.length - 1,
    minCol: 0,
    maxCol: rows[0].length - 1
  };

  return grid;
}

function getStartingNode(grid) {
  var currentRow = 0;

  for (var j = 0; j < grid.rows[0].length; j++) {

    var wasVerticalFound = grid.rows[currentRow][j] == characters.vertical;

    if (wasVerticalFound) {
      return new Node(new Point(currentRow, j), cardinalDirections.south);
    }
  }

  return null;
}

function printGrid(grid) {
  grid.rows.forEach(row => {
    console.log(...row);
  })
}

function solve() {
  // Puzzle input
  var puzzleInput = {input: helpers.GetFileContentsSync("../puzzle-input/day-19-part1.txt")};
  //var puzzleInput = { input: helpers.GetFileContentsSync("../puzzle-input/day-19-part1-example.txt") };
  var grid = parseGrid(puzzleInput.input);
  var currentNode = getStartingNode(grid);

  var alphaChars = [];
  var stepCount = 0;

  do {
    // move forward
    // currentNode.print();
    currentNode.moveForward();
    stepCount++;

    // inspect the current character
    var currentCharacter = currentNode.getCharAtPosition(grid);

    if (helpers.IsAlpha(currentCharacter)) {
      alphaChars.push(currentCharacter);
    }

    // update direction
    // '+' changes the direction
    if (currentCharacter == characters.turn) {
      currentNode.updateDirection(grid);
    }
  } while (currentNode.isWithinBounds(grid));

  console.log(`Part 1: What letters will it see (in the order it would see them) if it follows the path? - ${alphaChars.join("")}`)
  console.log(`Part 2: How many steps does the packet need to go? - ${stepCount}`)
}

solve();