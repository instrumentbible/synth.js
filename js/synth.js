// synth.js
var AudioContext = window.AudioContext || window.webkitAudioContext;
window.AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext;
// Synth Class
class Synth {
  constructor(options) {
	  if(!options){options = {}}
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
	//gainNode.connect(audioContext.destination);
	oscillator.connect(gainNode);

	  //oscillator.start();
	  oscillator.onended = function() {
		  this.playing = false
		  console.log('not playing');
	 }
	  this.object = oscillator
	  this.output = gainNode
	  
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
	
	// set frequency
	setFrequency(e) {
		this.frequency = e
		this.object.frequency.value = e;

	}
	
	// get frequency
	getFrequency() {
		return this.frequency;
	}
	
	// set or get frequency
	hz(e) {
		if(e){ this.setFrequency(e) }
		else { return this.frequency }
	}
	
	
	
	// set wave type
	setType(e) {
		this.type = e
		this.object.type = e;
	}
	
	// get wave type
	getType() {
		return this.type;
	}
	
	// get or set wave type
	type(e) {
		if(e){ this.setType(e) }
		else { return this.type }
	}
	
	// plug into another object
	plug(e){
		console.log(e);
		this.output.connect(e.object);
	}
	
}

// ========== EQ ========== //

 class EQ extends Synth {
  constructor(options) {
	  if(!options){options = {}}
	  super(options);
	  this.type = options.type || 'lowshelf'
	  if(options.gain){ this.gain = options.gain } else {this.gain = 1 }
	  if(options.frequency){ this.frequency = options.frequency } else {this.frequency = 440 }
	  if(options.detune){ this.detune = options.detune } else {this.detune = 0 }// cents
	  if(options.Q){ this.Q = options.Q } else {this.Q = 0 }// cents

	  var biquad = audioContext.createBiquadFilter();
	  biquad.type = this.type;
	  biquad.frequency.setValueAtTime(this.frequency, audioContext.currentTime); // value in hertz


	  var gainNode = audioContext.createGain();

	  gainNode.gain.value = this.gain;
	  gainNode.connect(audioContext.destination);
	  biquad.connect(gainNode);
	  this.object = biquad

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
	
	// set or get frequency
	hz(e) {
		if(e){ this.setFrequency(e) }
		else { return this.frequency }
	}
	
	// set type
	setType(e) {
		this.type = e
		this.object.type = e;
	}
	// lowpass,highpass,bandpass,lowshelf,highshelf,peaking,notch, allpass
	
	// get type
	getType() {
		return this.type;
	}
	
	// get or set type
	type(e) {
		if(e){ this.setType(e) }
		else { return this.type }
	}
}


// ========== LFO ========== //

class LFO extends Synth {
  constructor(options) {
	  if(!options){options = {}}
	  super(options);
	  this.type = options.type || 'sine'
	  if(options.gain){ this.gain = options.gain } else {this.gain = 1 }
	  if(options.frequency){ this.frequency = options.frequency } else {this.frequency = 5 }
	  if(options.detune){ this.detune = options.detune } else {this.detune = 0 }// cents
	  if(options.Q){ this.Q = options.Q } else {this.Q = 0 }// cents

   // Create the low frequency oscillator that supplies the modulation signal
   var lfo = audioContext.createOscillator();
   lfo.frequency.value = this.frequency ;
   lfo.type = this.type;
	  // rate (hz)
	  // depth
	  // offset
	  // Create a gain node whose gain determines the amplitude of the lfo
   var modulationGain = audioContext.createGain();
   modulationGain.gain.value = 100;
	  lfo.connect(modulationGain);
	  const constantSourceNode = new ConstantSourceNode(audioContext);
   const gainNode = new GainNode(audioContext, { gain: 0.5 });

   constantSourceNode.connect(modulationGain);
	  constantSourceNode.start();
	  lfo.start();
	  this.output = modulationGain
	  this.object = lfo;
  }

	// set frequency
	setFrequency(e) {
		 this.frequency = e
		 this.object.frequency.value = e;
	}
	
	// get frequency
	getFrequency() {
		// return this.frequency;
	}
	
	// set or get frequency
	hz(e) {
		// if(e){ this.setFrequency(e) }
		// else { return this.frequency }
	}
	
	
	// set gain
	 depth(e) {
		this.gain = e
		this.output.gain.value = e;
	}
	
	// get gain
	getGain() {
		return this.gain;
	}
	
	// set type
	setType(e) {
		 this.type = e
		 this.object.type = e;
	}
	
	// get type
	getType() {
		 return this.type;
	}
	
	// get or set type
	type(e) {
		 if(e){ this.setType(e) }
		 else { return this.type }
	}
	
	// plug
	plug(e) {
		console.log(e)
		this.output.connect(e.object.detune);

		//this.object.connect(e.gain)
		// if(e){ this.setType(e) }
		// else { return this.type }
	}
}
