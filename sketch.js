// This line is used for auto completion in VSCode
/// <reference path="../../node_modules/@types/p5/global.d.ts" />
//this variable will hold our shader object
let myShader;
let cam;

var previousPixels;
var section1_gain = 0.;
var section1_destination = 0;
var section2_gain = 0.;
var section2_destination = 0;
var section3_gain = 0.;
var section3_destination = 0;
var section4_gain = 0.;
var section4_destination = 0;

function preload() {
  // a shader is composed of two parts, a vertex shader, and a fragment shader
  // the vertex shader prepares the vertices and geometry to be drawn
  // the fragment shader renders the actual pixel colors
  // loadShader() is asynchronous so it needs to be in preload
  // loadShader() first takes the filename of a vertex shader, and then a frag shader
  // these file types are usually .vert and .frag, but you can actually use anything. .glsl is another common one
  myShader = loadShader("shader.vert", "shader.frag");
}

function setup() {
  // shaders require WEBGL mode to work
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  // initialize the webcam at the window size
  cam = createCapture(VIDEO);
  cam.size(windowWidth, windowHeight);

  // hide the html element that createCapture adds to the screen
  cam.hide();

  pixelDensity(1);
}

function draw() {
  background(0);

  // shader() sets the active shader with our shader
  shader(myShader);

  // Send the frameCount to the shader
  myShader.setUniform("frameCount", frameCount);
  myShader.setUniform('tex0', cam);
  myShader.setUniform("mouse", [mouseX, map(mouseY, 0, height, height, 0)]);
  myShader.setUniform("resolution", [width, height]);
  myShader.setUniform("cam", cam);
  myShader.setUniform("section1_motion");
  myShader.setUniform("section2_motion");
  myShader.setUniform("section3_motion");
  myShader.setUniform("section4_motion");
  rect(0, 0, width, height);

  cam.loadPixels();
  var total = 0;
  var section1 = 0;
  var section2 = 0;
  var section3 = 0;
  var section4 = 0;
  if (cam.pixels.length > 0) { // don't forget this!
      if (!previousPixels) {
          previousPixels = copyImage(cam.pixels, previousPixels);
      } else {
          var w = cam.width,
              h = cam.height;
          var i = 0;
          var pixels = cam.pixels;
          //threshold slider is 100 scale
          //this puts it to 255 scale
          var thresholdAmount = 70000 * 255. / 100.;
          thresholdAmount *= 3; // 3 for r, g, b
          console.log(mouseX);
          for (var y = 0; y < height; y++) {
              for (var x = 0; x < width; x++) {
                  // calculate the differences
                  var rdiff = Math.abs(pixels[i + 0] - previousPixels[i + 0]);
                  var gdiff = Math.abs(pixels[i + 1] - previousPixels[i + 1]);
                  var bdiff = Math.abs(pixels[i + 2] - previousPixels[i + 2]);
                  // copy the current pixels to previousPixels
                  previousPixels[i + 0] = pixels[i + 0];
                  previousPixels[i + 1] = pixels[i + 1];
                  previousPixels[i + 2] = pixels[i + 2];
                  var diffs = rdiff + gdiff + bdiff;
                  var output = 0;
                  if (diffs > thresholdAmount) {
                      output = 255;
                      total += diffs;
                      // section 1
                      if (){  //i haven't added conditions yet because I haven't figured out how to get the same sections as in the frag. file since the values there are below 1
                        section1 += diffs;
                      }
                      // section 2
                      if (){
                        section2 += diffs;
                      }

                      if (){
                        section3 += diffs;
                      }

                      if (){
                        section4 += diffs;
                      }
                  }
                  //thresholded amounts
                  pixels[i++] = output;
                  pixels[i++] = output;
                  pixels[i++] = output;
                  // comment above and uncomment below to see the original differenced amount
                  // pixels[i++] = rdiff;
                  // pixels[i++] = gdiff;
                  // pixels[i++] = bdiff;
                  i++; // skip alpha
              }
          }
      }
  }

  section1_gain += (section1_destination-section1_gain)*sec1changeRate;
  section2_gain += (section2_destination-section2_gain)*sec2changeRate;
  section3_gain += (section3_destination-section3_gain)*sec3changeRate;
  section4_gain += (section4_destination-section4_gain)*sec4changeRate;


  sendOsc('/ctrl', 'section1_gain', section1_gain);
  sendOsc('/ctrl', 'section2_gain', section2_gain);
  sendOsc('/ctrl', 'section3_gain', section3_gain);
  sendOsc('/ctrl', 'section4_gain', section4_gain);

  if (total > 0) {
      // un comment to flip video image (note: the sections will also be reversed)
      // push();
      // translate(width,0); // move to far corner
      // scale(-1.0,1.0);    // flip x-axis backwards
      // pop();

      // set the HTML text
      select('#motion').elt.innerText = total +"\nSection1: "+ section1+ "\n Section1 Gain: "+sec1num + "\nSection2: "+ section2+ "\n Section2 Gain: "+sec2num +"\nSection3: "+ section3+ "\n Section3 Gain: "+sec3num +"\nSection4: "+ section4+ "\n Section4 Gain: "+sec4num;
  }

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
