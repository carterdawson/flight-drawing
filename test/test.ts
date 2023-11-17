import { assert, expect } from 'chai';
import {FlightDrawing, Waypoint} from '../index'

describe("flight-drawing", function() {
    describe("Basic functionality", function() {
        it("can handle a simple test drawing", function() {
            const drw = new FlightDrawing(
                '1,0|2,0|3,0|4,1|5,0|6,0|7,0'
            );

            const str_expected_fixed_lon_scale = "\
32.910000/-116.500000\n\
32.910000/-116.499611\n\
32.910000/-116.499222\n\
32.909715/-116.498833\n\
32.910000/-116.498444\n\
32.910000/-116.498056\n\
32.910000/-116.497667\n\
"
            const str_expected = "\
32.910000/-116.500000\n\
32.910000/-116.499531\n\
32.910000/-116.499062\n\
32.909715/-116.498593\n\
32.910000/-116.498124\n\
32.910000/-116.497655\n\
32.910000/-116.497186\n\
"

            const str_route = drw.getRouteString(new Waypoint(32.91, -116.5));
            console.log(str_route);
            expect(str_route).to.deep.equal(str_expected, "Route should be as expected");
        });
        it("can handle a simple test drawing, with a different starting point", function() {
            const drw = new FlightDrawing(
                '1,0|2,0|3,0|4,1|5,0|6,0|7,0'
            );

            const str_expected_fixed_lon_scale = "\
33.645000/-115.554000\n\
33.645000/-115.553611\n\
33.645000/-115.553222\n\
33.644715/-115.552833\n\
33.645000/-115.552444\n\
33.645000/-115.552056\n\
33.645000/-115.551667\n\
"
            const str_expected = "\
33.645000/-115.554000\n\
33.645000/-115.553526\n\
33.645000/-115.553051\n\
33.644715/-115.552577\n\
33.645000/-115.552103\n\
33.645000/-115.551629\n\
33.645000/-115.551154\n\
"

            const str_route = drw.getRouteString(new Waypoint(33.645, -115.554));
            console.log(str_route);
            expect(str_route).to.deep.equal(str_expected, "Route should be as expected");
        });

        it("Can do a penguin drawing without throwing", function() {

            const drw = new FlightDrawing(
                "150,1007|202,1017|254,1018|299,1010|343,996|392,985|449,979|485,982|510,989|519,1000|510,1007|490,1018|450,1024|411,1027|368,1024|325,1017|278,1000|240,978|204,942|181,908|163,868|152,820|146,765|147,713|155,649|165,601|179,546|195,491|210,446|227,411|244,400|262,418|273,453|281,488|288,526|294,572|301,617|306,657|310,704|310,750|305,795|299,833|288,866|274,903|255,932|246,942|234,946|223,937|217,921|212,878|211,822|213,780|215,742|214,702|210,669|201,636|196,586|194,552|196,521|197,470|206,432|221,381|237,333|264,270|295,222|324,187|363,169|397,164|433,172|475,181|518,177|561,184|582,196|560,203|535,207|503,216|471,229|444,245|428,261|421,292|439,320|465,358|485,409|492,454|497,532|498,596|497,648|494,712|490,750|488,792|485,831"
            );

            const str_route = drw.getRouteString(new Waypoint(33.645, -115.554));
            console.log(str_route);

        });
    });

});