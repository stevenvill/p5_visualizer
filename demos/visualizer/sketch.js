var soundFile;
var amplitude;
var img;

// :: Beat Detect Variables
// how many draw loop frames before the beatCutoff starts to decay
// so that another beat can be triggered.
// frameRate() is usually around 60 frames per second,
// so 20 fps = 3 beats per second, meaning if the song is over 180 BPM,
// we wont respond to every beat.
var beatHoldFrames = 30;

// what amplitude level can trigger a beat?
var beatThreshold = 0.11; 

// When we have a beat, beatCutoff will be reset to 1.1*beatThreshold, and then decay
// Level must be greater than beatThreshold and beatCutoff before the next beat can trigger.
var beatCutoff = 0;
var beatDecayRate = 0.98; // how fast does beat cutoff decay?
var framesSinceLastBeat = 0; // once this equals beatHoldFrames, beatCutoff starts to decay.

var numCirc = 10
var circMin = 10
var circOffset = 20 

function preload() {
  soundFile = loadSound('../../music/juss_know.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  img = loadImage("background.jpg");  // Load the image

  amplitude = new p5.Amplitude();
  
  soundFile.play();

  amplitude.setInput(soundFile);
  amplitude.smooth(0.9);
}

function draw() {
  background(img);

  var speed = map(mouseY, 0.1, height, 2, 0);
  speed = constrain(speed, 0.01, 4);
  soundFile.rate(speed);

  var hue = map(mouseY, 0.1, height, 255, 0);
  tint(255, hue, 255);

  var level = amplitude.getLevel();
  detectBeat(level);
  var distortDiam = map(level, 0, 1, 0, 800);

  fill('white');
  noStroke();
  // Ellipses
  ellipse(mouseX, mouseY, circMin, circMin + distortDiam);
  ellipse(mouseX, mouseY, circMin + distortDiam, circMin);

  // Main circle
  ellipse(mouseX, mouseY, distortDiam/2, distortDiam/2);

  // Rotated ellipses
  push();
  translate(mouseX, mouseY);
  rotate(PI/4);
  ellipse(0, 0, 4, distortDiam/1.3);
  rotate(PI/2);
  ellipse(0, 0, 4, distortDiam/1.3);
  pop();

  noFill();
  stroke(1);
  for (var i = 0; i < 10; i++) {
      var r = random(60);
      ellipse(mouseX, mouseY, r + distortDiam/5, r + distortDiam/5);
  }
}

function detectBeat(level) {
  if (level  > beatCutoff && level > beatThreshold){
    beatCutoff = level *1.2;
    framesSinceLastBeat = 0;
  } else{
    if (framesSinceLastBeat <= beatHoldFrames){
      framesSinceLastBeat ++;
    }
    else{
      beatCutoff *= beatDecayRate;
      beatCutoff = Math.max(beatCutoff, beatThreshold);
    }
  }
}