import '../js/tween/tween.umd.js';

// synth.js
var AudioContext = window.AudioContext || window.webkitAudioContext;
window.AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext;


// Synth Class
 export class Synth {
  constructor(options) {
	  if(!options){options = {}}
	  if(!audioContext){ audioContext = new (window.AudioContext || window.webkitAudioContext)(); }
  }
	
	getFrequency() 	{ return this.frequency; 	}
	getType() 		{ return this.type; 		}
	getGain() 		{ return this.gain; 		}
	
}

// ========== Oscillator ========== //

export class Oscillator extends Synth {
	constructor(options) {
	if(!options){options = {}}
		super(options);
		this.type = options.type || 'sine'
		if(options.gain){ this.gain = options.gain } else {this.gain = 0.1 }
		if(options.frequency){ this.frequency = options.frequency } else {this.frequency = 440 }
		this.playing = false;
		var oscillator = audioContext.createOscillator();
		oscillator.type = this.type;
		oscillator.frequency.setValueAtTime(this.frequency, audioContext.currentTime); // value in hertz
		var gainNode = audioContext.createGain();
		gainNode.gain.value = this.gain;
		oscillator.connect(gainNode);
		oscillator.onended = function() { this.playing = false }
		this.object = oscillator
		this.output = gainNode
	}

	// start
	start() {
		if(!this.playing){ this.object.start(); this.playing = true; }
		else { console.warn('Oscillator already playing'); }
	}
	
	// stop
	stop() {
		if(this.playing){ this.object.stop(); this.playing = false; }
		else { console.warn('Oscillator already stopped'); }
	}

	// set frequency
	setFrequency(e) { this.frequency = e; this.object.frequency.value = e; }
	
	// set gain
	setGain(e) { this.gain = e; this.output.gain.value = e; }
	
	// set or get frequency
	hz(e) {
		if(e){ this.setFrequency(e) } else { return this.frequency }
	}
	
	// set wave type
	setType(e) { this.type = e; this.object.type = e; }

	// get or set wave type
	type(e) {
		if(e){ this.setType(e) }
		else { return this.type }
	}
	
	// plug into another object
	plug(e){ this.output.connect(e.object); }
	
}

// ========== EQ ========== //

export class EQ extends Synth {
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

export class LFO extends Synth {
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
	
	// set type
	setType(e) {
		 this.type = e
		 this.object.type = e;
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



// allow scroll input on numbers
document.addEventListener("wheel",function(e){
  focusedEl = document.activeElement;
  if (focusedEl.nodeName='input' && focusedEl.type && focusedEl.type.match(/number/i)){
	var max = null, min = null;
	if(focusedEl.hasAttribute('max')){ max = focusedEl.getAttribute('max'); }
	if(focusedEl.hasAttribute('min')){ min = focusedEl.getAttribute('min'); }
	var value = parseFloat(focusedEl.value);
	if (e.deltaY < 0) { value += 0.01; if (max !== null && value > max) { value = parseFloat(max); } }
	else 		      { value -= 0.01; if (min !== null && value < min) { value = parseFloat(min); } }
	focusedEl.value = parseFloat(value);
  }
}, {passive: false});






// ========== ADSR ========== //

export class ADSR extends Synth {
  constructor(options) {
	  super(options);
	  
	  // chain tweens
	  var tweenA = new TWEEN.Tween({x: 0}).to({x: 10}, 10000).start();
	  var tweenD = new TWEEN.Tween({x: 10}).to({x: -100}, 10000);
	  var tweenS = new TWEEN.Tween({x: 10}).to({x: -100}, 10000);
	  var tweenR = new TWEEN.Tween({x: 10}).to({x: -100}, 10000);

	  tweenA.chain(tweenD).chain(tweenS).chain(tweenR);
	}
}

// ========== Ramp ========== //

export class Ramp extends Synth {
  constructor(options) {
	  super(options);

	  animate()

	  var obj = options.at// || options.at;
	  var y		= options.yoyo;
	  var r		= options.repeat	|| 0;
	  var del		= options.delay		|| 0;
	  var p		= options.position;
	  var dur		= options.duration;
	  var col		= options.color		|| null;
	  var type	= options.type		|| 'absolute';
	  
	  // easing
	  var dir 	= options.direction	|| 'inout';
	  var ease 	= options.ease 		|| 'linear';
	  var e		= getEase(ease, dir);
	  var gn = obj.output.gain;

	 // var newGain = options.gain;
	  var anim;
	  if (options.gain != undefined){
		new TWEEN.Tween(gn)
		  .to({value:options.gain}, dur)
		  .onUpdate(function (object) {console.log(gn.value)})
		  .repeat(r)
		  .easing(e)
		  .yoyo(y)
		  .delay(del)
		  .start()
	  }
	}
}

function animate(time) {
	requestAnimationFrame(animate)
	TWEEN.update(time)
}


// Ease selector
var getEase = function(e,d){
	if(d == 'inout'){
		switch(e){
			case "back"			: return TWEEN.Easing.Back.InOut;		break;
			case "bounce"		: return TWEEN.Easing.Bounce.InOut;		break;
			case "circ"			: return TWEEN.Easing.Circular.InOut;	break;
			case "cubic"		: return TWEEN.Easing.Cubic.InOut;		break;
			case "elastic"		: return TWEEN.Easing.Elastic.InOut;	break;
			case "exponential"	: return TWEEN.Easing.Exponential.InOut;break;
			case "linear"		: return TWEEN.Easing.Linear.InOut;		break;
			case "quad"			: return TWEEN.Easing.Quadratic.InOut;	break;
			case "quart"		: return TWEEN.Easing.Quartic.InOut;	break;
			case "quint"		: return TWEEN.Easing.Quintic.InOut;	break;
			case "sine"			: return TWEEN.Easing.Sinusoidal.InOut;	break;
		}
	}
	else if(d == 'in'){
		switch(e){
			case "back"			: return TWEEN.Easing.Back.In;			break;
			case "bounce"		: return TWEEN.Easing.Bounce.In;		break;
			case "circ"			: return TWEEN.Easing.Circular.In;		break;
			case "cubic"		: return TWEEN.Easing.Cubic.In;			break;
			case "elastic"		: return TWEEN.Easing.Elastic.In;		break;
			case "exponential"	: return TWEEN.Easing.Exponential.In;	break;
			case "linear"		: return TWEEN.Easing.Linear.In;		break;
			case "quad"			: return TWEEN.Easing.Quadratic.In;		break;
			case "quart"		: return TWEEN.Easing.Quartic.In;		break;
			case "quint"		: return TWEEN.Easing.Quintic.In;		break;
			case "sine"			: return TWEEN.Easing.Sinusoidal.In;	break;
		}
	}
	else if(d == 'out'){
		switch(e){
			case "back"			: return TWEEN.Easing.Back.Out;			break;
			case "bounce"		: return TWEEN.Easing.Bounce.Out;		break;
			case "circ"			: return TWEEN.Easing.Circular.Out;		break;
			case "cubic"		: return TWEEN.Easing.Cubic.Out;		break;
			case "elastic"		: return TWEEN.Easing.Elastic.Out;		break;
			case "exponential"	: return TWEEN.Easing.Exponential.Out;	break;
			case "linear"		: return TWEEN.Easing.Linear.Out;		break;
			case "quad"			: return TWEEN.Easing.Quadratic.Out;	break;
			case "quart"		: return TWEEN.Easing.Quartic.Out;		break;
			case "quint"		: return TWEEN.Easing.Quintic.Out;		break;
			case "sine"			: return TWEEN.Easing.Sinusoidal.Out;	break;
		}
	}
}
