# Path Runner

Given an GeoJSON path and a speed, will emit position updates on the correct timing, for instance:

If we have 3 points, 10 kilometers from each other and we pass a speed of 10 km/h, it will emit a position update every hour.

# Installation

```bash
npm install path-runner --save
```

# Example

```javascript
const PathRunner = require('path-runner');

let pathRunner = new PathRunner({
    "type": "LineString",
    "coordinates": [
        [-43.363037109375, -23.000194727498027],
        [-43.3604621887207, -23.00011572002358],
        [-43.35780143737793, -23.000194727498027]
    ]
}, 10);

pathRunner.start();
pathRunner.on('position', (pos) => {
    // Do something
});
```
