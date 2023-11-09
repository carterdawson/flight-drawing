import { assert, expect } from 'chai';
import { describe } from 'node:test';
import { FlightDrawing, Waypoint } from '../'

describe("flight-drawing", function() {
    describe("Basic functionality", function() {
        it("can handle a simple test drawing", function() {
            const drw = new FlightDrawing(
                '1,0|2,0|3,0|4,1|5,0|6,0|7,0'
            );

            const str_expected = "\
32.910000/-116.500000\n\
32.910000/-116.499611\n\
32.910000/-116.499222\n\
32.909715/-116.498833\n\
32.910000/-116.498444\n\
32.910000/-116.498056\n\
32.910000/-116.497667\n\
"

            const str_route = drw.getRouteString(new Waypoint(32.91, -116.5));
            expect(str_route).to.deep.equal(str_expected, "Route should be as expected");
        })
        it("can handle a simple test drawing, with a different starting point", function() {
            const drw = new FlightDrawing(
                '1,0|2,0|3,0|4,1|5,0|6,0|7,0'
            );

            const str_expected = "\
33.645000/-115.554000\n\
33.645000/-115.553611\n\
33.645000/-115.553222\n\
33.644715/-115.552833\n\
33.645000/-115.552444\n\
33.645000/-115.552056\n\
33.645000/-115.551667\n\
"

            const str_route = drw.getRouteString(new Waypoint(33.645, -115.554));
            expect(str_route).to.deep.equal(str_expected, "Route should be as expected");
        })
    });

});