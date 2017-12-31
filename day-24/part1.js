#!/usr/bin/env node
'use strict';

var helpers = require('../helpers');
var extensions = require('../extensions');

const util = require('util');

/**
 * Puzzle Helper(s)
 */
function parseComponents(input) {
  var components = [];
  var id = 1;

  input.split("\r\n").forEach(component => {
    var input = +component.split("/")[0];
    var output = +component.split("/")[1];

    components.push({ id: id, input: input, inputUsed: false, output: output, outputUsed: false });
    id++;
  });

  return components;
}

/**
 * Search Helpers
 */
function findComponent(component) {
  return component.input == this.input && component.output == this.output;
}

function findCandidateComponents(component) {
  return ((!component.inputUsed && !this.inputUsed && component.input == this.input) ||
    (!component.outputUsed && !this.outputUsed && component.output == this.output) ||
    (!component.inputUsed && !this.outputUsed && component.input == this.output) ||
    (!component.outputUsed && !this.inputUsed && component.output == this.input));
}

function isStartingComponent(component) {
  return (component.input == 0 || component.output == 0);
}

/**
 * Classes 
 */
function Bridge(components, component) {
  this.availableComponents = [];
  this.usedComponents = [];
  this.usedPorts = {};
  this.idCollection = [];
  this.idCollectionString = "";

  if (components != null) {
    this.availableComponents = components;
  }

  if (component != null) {
    this.useComponent(component);
  }
}

Bridge.prototype.toString = function () {
  var s = "";

  this.usedComponents.forEach(usedComponent => {
    s += `${usedComponent.input}/${usedComponent.output}--`;
  });

  return s.substr(0, s.length - 2);
}

Bridge.prototype.useComponent = function (component) {
  var lastComponentUsed = this.usedComponents[this.usedComponents.length - 1];
  var index = this.availableComponents.findIndex(findComponent, component);
  var componentToUse = this.availableComponents[index];

  var isListEmpty = this.usedComponents.length == 0;

  if (isListEmpty) {
    componentToUse.inputUsed = (component.input == 0 ? true : false);
    componentToUse.outputUsed = (component.output == 0 ? true : false);
  }
  else {
    if (!lastComponentUsed.inputUsed && lastComponentUsed.input == componentToUse.input) {
      lastComponentUsed.inputUsed = true;
      componentToUse.inputUsed = true;
    }
    else if (!lastComponentUsed.inputUsed && lastComponentUsed.input == componentToUse.output) {
      lastComponentUsed.inputUsed = true;
      componentToUse.outputUsed = true;
    }
    else if (!lastComponentUsed.outputUsed && lastComponentUsed.output == componentToUse.input) {
      lastComponentUsed.outputUsed = true;
      componentToUse.inputUsed = true;
    }
    else if (!lastComponentUsed.outputUsed && lastComponentUsed.output == componentToUse.output) {
      lastComponentUsed.outputUsed = true;
      componentToUse.outputUsed = true;
    }
  }

  this.usedComponents.push(componentToUse);
  this.availableComponents.splice(index, 1);

  // keep track of the ID's
  // invalidate duplicate lists
  this.idCollection.push(component.id);
  this.idCollection.sort(function (a, b) {
    return a - b;
  });

  this.idCollectionString = this.idCollection.join(",");
}

Bridge.prototype.calculateStrength = function () {
  var strength = 0;

  this.usedComponents.forEach(component => {
    strength += component.input + component.output;
  });

  return strength;
}

Bridge.prototype.getCandidateComponents = function () {
  var previousUsedComponent = this.usedComponents[this.usedComponents.length - 1];
  var candidateComponents = this.availableComponents.filter(findCandidateComponents, previousUsedComponent);

  return candidateComponents;
}

Bridge.prototype.deepCopy = function () {
  // Note: This is an interesting function... options for deep copying objects are lacking,
  // and there's probably a better way to retain the .prototype. functions, but I'm not sure how to 
  // do that...

  // Create a typed skeleton (retains .prototype methods)
  var temp = new Bridge(null, null);

  // Deep copy properties to typed object
  Object.assign(temp, helpers.Clone(this));

  // Return the typed objects with copied properties and .prototype methods
  return temp;
}

/**
 * Helpers 
 */
function printSync(message) {
  require('console-sync');
  console.log(message);
}

function solve() {
  var puzzleInput = helpers.GetFileContentsSync("../puzzle-input/day-24-part1.txt");
  // var puzzleInput = helpers.GetFileContentsSync("../puzzle-input/day-24-part1-example.txt");
  var components = parseComponents(puzzleInput);

  var completedBridges = [];
  var completedBridgeIds = {};
  var bridges = [];

  var initialComponents = components.filter(isStartingComponent);

  // create the initial bridge states
  Object.values(initialComponents).forEach(component => {
    var copiedComponent = helpers.Clone(component);
    var copiedComponents = helpers.Clone(components);

    bridges.push(new Bridge(copiedComponents, copiedComponent));
  });

  printSync(`There are ${initialComponents.length} starting states.`);

  // keep a queue of all bridges that need to be processed - keep 
  while (bridges.length > 0) {
    if (bridges.length % 1000 == 0) {
      printSync(`Current queue capacity: ${bridges.length}`);
    }

    var bridge = bridges.shift();

    // store a copy of this bridge
    completedBridges.push(bridge.deepCopy());
    completedBridgeIds[bridge.idCollectionString] = 1;

    // continue building the bridge
    var candidateComponents = bridge.getCandidateComponents();

    for (var i = 0; i < candidateComponents.length; i++) {
      // copy the current bridge state
      var tempBridge = bridge.deepCopy();

      // use the next component
      var componentToUse = candidateComponents[i];
      tempBridge.useComponent(componentToUse);

      // add it to the queue for future inspection
      // printSync(tempBridge.idCollectionString);
      var doesBridgeExist = completedBridgeIds[tempBridge.idCollectionString] == 1;

      if (!doesBridgeExist) {
        bridges.push(tempBridge);
        completedBridgeIds[tempBridge.idCollectionString] = 1;
      }
    }
  }

  // printSync(`There are ${completedBridges.length} valid states...`);
  printSync(`There are ${Object.values(completedBridgeIds).length} valid, unique states...`);

  var maxStrength = 0;
  var strongestBridge = null;

  completedBridges.forEach(bridge => {
    // printSync(bridge.toString());
    var bridgeStrength = bridge.calculateStrength();

    if (bridgeStrength > maxStrength) {
      maxStrength = bridgeStrength;
      strongestBridge = bridge.deepCopy();
    }
  });

  printSync(strongestBridge.toString());
  // 1854 - incorrect, too low
  console.log(`Part 1: What is the strength of the strongest bridge you can make with the components you have available? - ${maxStrength}`);
}

solve();