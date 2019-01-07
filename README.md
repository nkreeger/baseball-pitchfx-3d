## 3D Baseball Rendering in WebGL

API for rendering PitchFX pitch data in WebGL!

This library takes data from the PitchFX dataset and renders the actual flight path and speed in 3D using WebGL.

### Basic usage

The library requires at least elements in the DOM - a canvas element and a placeholder where the baseball image texture is stored. The baseball texture is optional - but be sure to checkout the demo directory for a sample image.

```html
...
  <canvas id="webgl-canvas" style="border: none; padding-top:10px;"></canvas>
  <img id="baseball-image" src="baseball2.png" style="visibility: hidden;">
...
```

Just a little JS is required to load the libary and start renderning some pitches:

```js
import * as pfx3d from 'baseball-pitchfx-3d';

const matchup = new pfx3d.Matchup();
matchup.initialize('webgl-canvas' /* Canvas DOM ID */, 'baseball-image' /* baseball texture DOM ID */);

// Sample PitchFX data (represented as JSON):
const pitches = [
    {
        "sz_top": 3.548343822624041,
        "sz_bot": 1.609173571993658,
        "x0": -2.63882885225069,
        "y0": 50,
        "z0": 5.4892058201326,
        "vx0": 5.87417563225145,
        "vy0": -134.263367616907,
        "vz0": -6.81677604734278,
        "ax": -4.4649919045496,
        "ay": 28.6466265518902,
        "az": -17.9792322436286
    },
    ...
];

// Load the pitch data into the view:
matchup.setPitches(pitches);

// TODO - left off right here:
matchup.restart();
```

### Setting pitches

The library only uses a few fields from PitchFX data - so they are the only required fields for rendering:
- vx0
- vy0
- vz0
- ax
- ay
- x0
- y0
- z0
- sz_bot
- sz_top

### Views

Currently, threw views are supported:
- Catcher: Traditional "catchers" perspective.
- Pitcher: View from the pitchers mound.
- Birds Eye: Top-down view of the mound and home plate.