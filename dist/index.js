export class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
export class Waypoint {
    constructor(lat, lon) {
        this.lat = lat;
        this.lon = lon;
    }
}
export class FlightDrawing {
    constructor(str_points, lat_scale = -0.000284757, lon_scale = 0.000388889) {
        this.lat_scale = lat_scale;
        this.lon_scale = lon_scale;
        this.apt_drawing = this._parsePoints(str_points);
        this.pt_origin = this.apt_drawing[0];
    }
    _parsePoints(str_points) {
        let apt_ret = [];
        //get the array of points by splitting on pipe
        const astr_points = str_points.split('|');
        //for each resulting point...
        for (const str_point of astr_points) {
            //split it into x and y
            const [x, y] = str_point.split(',').map(Number);
            // create a point
            const pt = new Point(x, y);
            // add it to my growing list of points
            apt_ret.push(pt);
        }
        //return what we ended up with
        return apt_ret;
    }
    wptFromPt(wpt_origin, pt) {
        const lat = wpt_origin.lat + this.lat_scale * (pt.y - this.pt_origin.y);
        const lon = wpt_origin.lon + this.lon_scale * (pt.x - this.pt_origin.x);
        return new Waypoint(lat, lon);
    }
    getRoute(wpt_origin) {
        //map the points in the drawing to wpts
        let awpt_ret = this.apt_drawing.map((pt) => { return this.wptFromPt(wpt_origin, pt); });
        return awpt_ret;
    }
    getRouteString(wpt_origin) {
        let awpt_route = this.getRoute(wpt_origin);
        let str_ret = "";
        for (const wpt of awpt_route) {
            str_ret = str_ret + `${wpt.lat.toFixed(6)}/${wpt.lon.toFixed(6)}` + "\n";
        }
        return str_ret;
    }
}
