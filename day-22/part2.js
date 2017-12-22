#!/usr/bin / env node
'use strict';

var helpers = require('../helpers');
var extensions = require('../extensions');

const util = require('util')

/**
 * Classes 
 */
function Point(i, j) {
  this.i = i;
  this.j = j;
}

// Point.prototype.inspect = function () {
//   return `${this.i}, ${this.j}`;
// }

Point.prototype.toString = function () {
  return `${this.i}, ${this.j}`;
}

function Node(position, direction) {
  this.position = position;
  this.direction = direction;
}

Node.prototype.turnRight = function () {
  this.direction =
    this.direction == cardinalDirections.north ? cardinalDirections.east :
      this.direction == cardinalDirections.east ? cardinalDirections.south :
        this.direction == cardinalDirections.south ? cardinalDirections.west :
          cardinalDirections.north;
}

Node.prototype.turnLeft = function () {
  this.direction =
    this.direction == cardinalDirections.north ? cardinalDirections.west :
      this.direction == cardinalDirections.west ? cardinalDirections.south :
        this.direction == cardinalDirections.south ? cardinalDirections.east :
          cardinalDirections.north;
}

Node.prototype.turnReverse = function () {
  this.direction =
    this.direction == cardinalDirections.north ? cardinalDirections.south :
      this.direction == cardinalDirections.south ? cardinalDirections.north :
        this.direction == cardinalDirections.east ? cardinalDirections.west :
          cardinalDirections.east;
}

var nodeStates = { clean: ".", weakened: "W", infected: "#", flagged: "f" };

Node.prototype.markAsCleanIfNotExists = function (grid) {
  if (grid.nodes[this.position] == null) {
    grid.nodes[this.position] = nodeStates.clean;
  }
}

Node.prototype.isInfected = function (grid) {
  return grid.nodes[this.position] == nodeStates.infected;
}

Node.prototype.isClean = function (grid) {
  return grid.nodes[this.position] == nodeStates.clean;
}

Node.prototype.isWeakened = function (grid) {
  return grid.nodes[this.position] == nodeStates.weakened;
}

Node.prototype.isFlagged = function (grid) {
  return grid.nodes[this.position] == nodeStates.flagged;
}

Node.prototype.infect = function (grid) {
  grid.nodes[this.position] = nodeStates.infected;
}

Node.prototype.clean = function (grid) {
  grid.nodes[this.position] = nodeStates.clean;
}

Node.prototype.weaken = function (grid) {
  grid.nodes[this.position] = nodeStates.weakened;
}

Node.prototype.flag = function (grid) {
  grid.nodes[this.position] = nodeStates.flagged;
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

Node.prototype.print = function () {
  console.log(util.inspect(this));
}

var cardinalDirections = { north: "north", south: "south", east: "east", west: "west" };
var turncardinalDirections = { left: "left", right: "right" };

/**
 * Part 2
 */
function initializeGrid(puzzleInput) {
  var grid = { height: null, width: null, nodes: {} };
  var rows = puzzleInput.split("\r\n");

  grid.height = rows.length;
  grid.width = rows[0].split("").length;

  for (var i = 0; i < grid.height; i++) {
    for (var j = 0; j < grid.width; j++) {
      grid.nodes[new Point(i, j)] = rows[i][j];
    }
  }

  return grid;
}

function initializeCurrentNode(grid) {
  var position = new Point(Math.floor(grid.height / 2), Math.floor(grid.width / 2));

  var currentNode = new Node(position, cardinalDirections.north);

  return currentNode;
}

function solvePart2() {
  console.log("Part 2: This will take less than 30 seconds to complete...")

  var puzzleInput = { input: helpers.GetFileContentsSync("../puzzle-input/day-22-part1.txt") };
  //var puzzleInput = { input: helpers.GetFileContentsSync("../puzzle-input/day-22-part1-example.txt") };

  var grid = initializeGrid(puzzleInput.input);
  var currentNode = initializeCurrentNode(grid);

  var infectionCount = 0;

  for (var i = 0; i < 10000000; i++) {

    if (i != 0 && i % 1000000 == 0) {
      console.log("1,000,000 processed...");
    }

    currentNode.markAsCleanIfNotExists(grid);

    // If it is clean, it turns left.  Clean nodes become weakened.
    // If it is weakened, it does not turn, and will continue moving in the same direction.  Weakened nodes become infected.
    // If it is infected, it turns right.  Infected nodes become flagged.
    // If it is flagged, it reverses direction, and will go back the way it came.  Flagged nodes become clean.
    if (currentNode.isClean(grid)) {
      currentNode.turnLeft();
      currentNode.weaken(grid);
    }
    else if (currentNode.isWeakened(grid)) {
      // no turn
      currentNode.infect(grid);
      infectionCount++;
    }
    else if (currentNode.isInfected(grid)) {
      currentNode.turnRight();
      currentNode.flag(grid);
    }
    else if (currentNode.isFlagged(grid)) {
      currentNode.turnReverse();
      currentNode.clean(grid);
    }

    currentNode.moveForward();
  }

  // 5360 - incorrect, too high
  console.log(`Given your actual map, after 10000000 bursts of activity, how many bursts cause a node to become infected? (Do not count nodes that begin infected.) - ${infectionCount}`);
}

solvePart2();