#!/usr/bin / env node
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

Particle.prototype.doesPositionMatch = function(particle){
  return this.position.x == particle.position.x && this.position.y == particle.position.y && this.position.z == particle.position.z;
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

function calculateClosestManhattenDistance(particles) {
  var smallest = Number.MAX_SAFE_INTEGER;

  particles.forEach(particle => {
    if (particle.getManhattenDistance() < smallest) {
      smallest = particle.getManhattenDistance();
    }
  });

  return smallest;
}

function findElementById(element) {
  return element.id == this;
}

function checkForCollisions(particles) {
  // Particles collide if their positions ever exactly match. 
  var collisions = [];

  for (var i = 0; i < particles.length; i++) {
    var currentParticle = particles[i];

    particles.forEach(particle => {
      if (currentParticle.id != particle.id) {
        if (currentParticle.doesPositionMatch(particle)) {
          collisions.push(currentParticle.id);
          collisions.push(particle.id);
        }
      }
    });
  }

  if (collisions.length > 0) {
    var uniqueCollisions = collisions.filter(function (elem, pos) {
      return collisions.indexOf(elem) == pos;
    });

    uniqueCollisions.forEach(id => {
      var index = particles.findIndex(findElementById, id);
      particles.splice(index, 1);
    });
  }
}

/**
 * Part 1
 */
function solve() {
  var puzzleInput = { input: helpers.GetFileContentsSync("../puzzle-input/day-20-part1.txt") };
  // var puzzleInput = { input: helpers.GetFileContentsSync("../puzzle-input/day-20-part2-example.txt") };
  var particles = parseInput(puzzleInput.input);

  //printParticles(particles);
  var winners = {};

  // simulate 1000 ticks - this is the same (arbitrary) count used for part 1
  for (var i = 0; i < 1000; i++) {
    checkForCollisions(particles);
    tick(particles);
  }

  // Part 2 - 64 is the incorrect answer
  console.log(`Part 2: How many particles are left after all collisions are resolved? - ${particles.length}`);
}

solve();