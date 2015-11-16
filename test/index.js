'use strict';

const mocha = require('mocha'),
    assert = require('assert'),
    chai = require('chai'),
    PathRunner = require('../src'),
    path = require('./mocks/path1').path;

const expect = chai.expect;

describe('Path Runner', function() {
    beforeEach((done) => {
        done();
    });

    it('Should throw an error when instanciating the class with a invalid linestring', (done) => {
        expect(function() {
            return new PathRunner([1, 2, 3], 320);
        }).to.throw();
        done();
    });

    it('Should instantiate the class with a valid linestring', (done) => {
        expect(function() {
            return new PathRunner(path, 320);
        }).to.not.throw();
        done();
    });

    it('Should emit the next point on the passed time', (done) => {
        let pathRunner = new PathRunner(path, 320);
        pathRunner.movePoint(0);
        pathRunner.on('position', (pos) => {
            done();
        });
    });

    it('Should schedule an position update for a known time span', (done) => {
        let pathRunner = new PathRunner(path, 320);
        let time = pathRunner.start();

        // First point is the next point on the first run
        expect(time).to.be.equal(0);
        done();
    });

    it('should loop the path array', (done) => {
        let path = {
            "type": "LineString",
            "coordinates": [
                [-43.363037109375, -23.000194727498027],
                [-43.3604621887207, -23.00011572002358],
                [-43.363037109375, -23.000194727498027],
                [-43.363037109375, -23.000194727498027]
            ]
        };

        let pathRunner = new PathRunner(path, 320);

        let expectedPos = [
            [-43.363037109375, -23.000194727498027],
            [-43.363037109375, -23.000194727498027],
            [-43.3604621887207, -23.00011572002358],
            [-43.363037109375, -23.000194727498027]
        ].map(pathRunner.formatLatLng);

        pathRunner.movePoint(0);
        pathRunner.movePoint(0);
        pathRunner.movePoint(0);

        let index = 0;
        pathRunner.on('position', (pos) => {
            expect(pos.latitude).to.be.equal(expectedPos[index].latitude);
            expect(pos.longitude).to.be.equal(expectedPos[index].longitude);

            if (index === 3) {
                done();
            }
            index++;
        });
    });

});
