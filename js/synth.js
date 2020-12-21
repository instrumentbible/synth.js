// synth.js
var AudioContext = window.AudioContext || window.webkitAudioContext;
window.AudioContext = window.AudioContext || window.webkitAudioContext;
//var audioContext		= null;


var audioContext


// Synth Class
class Synth {
  constructor(options) {
	  if(!options){options = {}}

  }
	
	

	
	// set gain
	setGain(e) {
		
	}
	
	// get gain
	getGain() {
		
	}
	
	
}

class Oscillator extends Synth {
  constructor(options) {
	  if(!options){options = {}}
	  super(options); // call the super class constructor and pass in the name parameter

	  this.type = options.type || 'sine'
	  if(options.gain){ this.gain = options.gain } else {this.gain = 0.1 }
	  if(options.frequency){ this.frequency = options.frequency } else {this.frequency = 440 }

	  this.playing = false;
	  
	  // create Oscillator node
	var oscillator = audioContext.createOscillator();

	oscillator.type = this.type;
	oscillator.frequency.setValueAtTime(this.frequency, audioContext.currentTime); // value in hertz


	var gainNode = audioContext.createGain();

	gainNode.gain.value = this.gain;
	gainNode.connect(audioContext.destination);
	oscillator.connect(gainNode);

	  //oscillator.start();
	  oscillator.onended = function() {
		  this.playing = false
		  console.log('not playing');
	 }
	  this.object = oscillator
	  
  }

	// start
	start() {
		if(!this.playing){
			this.object.start();
			this.playing = true
		}
		else { console.warn('Oscillator already playing'); }
	}
	
	// stop
	stop() {
		if(this.playing){
			this.object.stop();
			this.playing = false
		}
		else { console.warn('Oscillator already stopped'); }
		
	}
	// set or get frequency
	hz(e) {
		if(e){ this.setFrequency(e) }
		else { return this.frequency }
	}
	// set frequency
	setFrequency(e) {
		this.frequency = e
		this.object.frequency.value = e;

	}
	
	// get frequency
	getFrequency() {
		return this.frequency;
	}
	
	
	
	
}

//listen for first click
document.addEventListener("click", setup, { once: true });

function setup(e) {
	 audioContext = new (window.AudioContext || window.webkitAudioContext)();

	let osc = new Oscillator({
	 frequency: 440,
	 gain: 0.1
 });

 osc.start();


	osc.hz(200);




}
