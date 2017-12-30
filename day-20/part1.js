#!/usr/bin/env node
'use strict';

var helpers = require('../helpers');
var extensions = require('../extensions');

/**
 * Classes
 */
function Particle(id, position, velocity, acceleration) {
  this.id = id;
  this.position = position;
  this.velocity = velocity;
  this.acceleration = acceleration;
}

Particle.prototype.toString = function () {
  return `id=${this.id}, p=${this.position.toString()}, v=${this.velocity.toString()}, a=${this.acceleration.toString()}`;
}

Particle.prototype.getManhattenDistance = function () {
  return Math.abs(this.position.x) + Math.abs(this.position.y) + Math.abs(this.position.z);
}

function Point(x, y, z) {
  this.x = x;
  this.y = y;
  this.z = z;
}

Point.prototype.toString = function () {
  return `${this.x}, ${this.y}, ${this.z}`;
}

/**
 * Helpers
 */
function parseInput(input) {
  var particles = [];
  var count = 0;

  input.split("\r\n").forEach(particle => {
    var particleDetails = particle.split(">,");

    var positionVector = particleDetails[0].split("<")[1].split(",");
    var velocityVector = particleDetails[1].split("<")[1].split(",");
    var accelerationVector = particleDetails[2].split("<")[1].replace(">", "").split(",");

    var position = new Point(parseInt(positionVector[0]), parseInt(positionVector[1]), parseInt(positionVector[2]));
    var velocity = new Point(parseInt(velocityVector[0]), parseInt(velocityVector[1]), parseInt(velocityVector[2]));
    var acceleration = new Point(parseInt(accelerationVector[0]), parseInt(accelerationVector[1]), parseInt(accelerationVector[2]));

    particles.push(new Particle(count, position, velocity, acceleration));
    count++;
  });

  return particles;
}

function printParticles(particles) {
  particles.forEach(particle => {
    console.log(particle.toString());
  });
}

function tick(particles) {
  // Each tick, all particles are updated simultaneously. A particle's properties are updated in the following order:

  // Increase the X velocity by the X acceleration.
  // Increase the Y velocity by the Y acceleration.
  // Increase the Z velocity by the Z acceleration.
  // Increase the X position by the X velocity.
  // Increase the Y position by the Y velocity.
  // Increase the Z position by the Z velocity.
  particles.forEach(particle => {
    particle.velocity.x += particle.acceleration.x;
    particle.velocity.y += particle.acceleration.y;
    particle.velocity.z += particle.acceleration.z;

    // note: may need to move this section above the operation above
    particle.position.x += particle.velocity.x;
    particle.position.y += particle.velocity.y;
    particle.position.z += particle.velocity.z;
  });
}

function calculateClosestManhattenDistance(particles){
  var smallest = Number.MAX_SAFE_INTEGER;

  particles.forEach(particle => {
    if(particle.getManhattenDistance() < smallest){
      smallest = particle.getManhattenDistance();
    }
  });

  return smallest;
}

/**
 * Part 1
 */
function solve() {
  var puzzleInput = {input: helpers.GetFileContentsSync("../puzzle-input/day-20-part1.txt")};
  //var puzzleInput = { input: helpers.GetFileContentsSync("../puzzle-input/day-20-part1-example.txt") };
  var particles = parseInput(puzzleInput.input);

  //printParticles(particles);
  var winners = {};

  // simulate 1000 ticks
  // keep track of the winnder for each tick
  // the particle with the most wins should be the closest...
  for(var i = 0; i < 1000; i++){
    // find the closest value
    var closestDistance = calculateClosestManhattenDistance(particles);

    // for all particles that are closest, mark them as the winner
    particles.forEach(particle =>{
      if(particle.getManhattenDistance() == closestDistance){
        winners[particle.id] = (winners[particle.id] == null ? 0 : winners[particle.id] + 1);
      }
    });

    tick(particles);
  }

  var winner = Object.keys(winners).reduce(function(a, b){ return winners[a] > winners[b] ? a : b });
  console.log(`Part 1: Which particle will stay closest to position <0,0,0> in the long term? - ${winner}`);
}

solve();