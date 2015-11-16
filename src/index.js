'use strict';

const   TinyEmitter = require('tiny-emitter'),
        haversine   = require('haversine');

/*
 * Given an path and a speed, emits an position update on the correct timing
 * calculating the distance between the current point and the next.
 */
class PathRunner extends TinyEmitter {

    constructor(path, speed, unit) {
        super();

        if (path.type !== 'LineString') {
            throw new Error('Path is not a linestring');
        }

        if (typeof speed !== 'number') {
            throw new Error('Speed is not a valid number');
        }

        this.path = path.coordinates.map(this.formatLatLng);
        this.currentPath = this.path.slice();
        this.currentPoint = this.currentPath[this.currentPath.length - 1];
        this.speed = speed;
        this.unit = unit ? unit : 'km';
    }

    formatLatLng(latLng) {
        return {
            latitude: latLng[1],
            longitude: latLng[0]
        };
    }

    start() {
        return this.calculateNextPoint();
    }

    stop() {
        clearTimeout(this.movePointTimer);
    }

    movePoint(time) {
        this.movePointTimer = setTimeout(() => {
            if (this.currentPath.length <= 1) {
                this.currentPath = this.path.slice();
            }

            this.currentPoint = this.currentPath.pop();
            this.emit('position', this.currentPoint);
            this.calculateNextPoint();
        }, time);
    }

    calculateNextPoint() {
        let nextPoint = this.currentPath[this.currentPath.length - 1];
        let distance = haversine(this.currentPoint, nextPoint, {
            unit: this.unit
        });

        // Time in miliseconds
        let time = (distance / this.speed) * 60 * 60 * 1000;
        this.movePoint(time);

        return time;
    }
}

module.exports = PathRunner;
