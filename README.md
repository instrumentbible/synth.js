
# synth.js

JavaScript library for audio synthesis.
Try the [live demo](https://instrumentbible.github.io/synth.js/).



# `Oscillator()`
create an oscillator
```js
var oscillator = new Oscillator({
	frequency: 440,
	gain: 0.5,
});
```

## Attributes
Oscillator
| attribute | type | options | description |  
| :-: | :-: | :-: |   :-: |  
|**`type`**| string | `sine` `square` `sawtooth` `triangle`|shape of waveform|
|**`frequency`**| float |   `120` | set the frequency (in hertz)  |  
|**`gain`**| float | `0` to `1` | set gain (volume) |


## Functions

### `setFrequency(Hz)`
set the frequency
```js
// create an oscillator at 440 Hz
var osc = new Oscillator({
	frequency: 440,
});

// change frequency to 200 Hz
osc.setFrequency(200);
```


### `GetFrequency()`
returns the current frequency
```js
// create an oscillator at 440 Hz
var osc = new Oscillator({ frequency: 440, });

// change frequency to 200 Hz
osc.getFrequency();
// ==> 440
```


### `hz()`
set _or_ get frequency

if blank, it will return the current frequency
```js
osc.hz();
// 440
```
or pass a value to set the frequency
```js
osc.hz(200);
```
