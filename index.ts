
export class Point {
    constructor(
        public x: number,
        public y: number
    ) {

    }
}

export class Waypoint {
    constructor(
        public lat: number,
        public lon: number
    ) {

    }
}

export class FlightDrawing {

    apt_drawing: Point[];
    pt_origin: Point;

    constructor(
        str_points: string,
        private lat_scale: number = -0.000284757,
        private lon_scale: number = 0.000388889,
    ) {
        this.apt_drawing = this._parsePoints(str_points);
        this.pt_origin = this.apt_drawing[0];
    }

    private _parsePoints(str_points: string): Point[] {
        let apt_ret: Point[] = [];
        //get the array of points by splitting on pipe
        const astr_points = str_points.split('|');
        //for each resulting point...
        for (const str_point of astr_points) {
            //split it into x and y
            const [x,y] = str_point.split(',').map(Number);
            // create a point
            const pt = new Point(x,y)
            // add it to my growing list of points
            apt_ret.push(pt);
        }

        //return what we ended up with
        return apt_ret;
    }

    public wptFromPt(wpt_origin: Waypoint, pt: Point): Waypoint {
        //automatically compute the longtitude scale based on our lattitude
        const lon_scale = -this.lat_scale * (1+Math.tan(wpt_origin.lat * (2*Math.PI/360)))
        //self.lat_scale * (1+math.tan(self.wpt_origin[0] * (2*math.pi/360)))
        const lat = wpt_origin.lat + this.lat_scale * (pt.y - this.pt_origin.y)
        const lon = wpt_origin.lon + lon_scale * (pt.x - this.pt_origin.x)

        return new Waypoint(lat, lon);
    }

    public getRoute(wpt_origin: Waypoint): Waypoint[] {
        //map the points in the drawing to wpts
        let awpt_ret = this.apt_drawing.map((pt) => { return this.wptFromPt(wpt_origin, pt)});

        return awpt_ret;
    }

    public getRouteString(wpt_origin: Waypoint): string {
        let awpt_route = this.getRoute(wpt_origin);
        let str_ret: string = ""
        for (const wpt of awpt_route) {
            str_ret =str_ret + `${wpt.lat.toFixed(6)}/${wpt.lon.toFixed(6)}`+"\n";
        }

        return str_ret;
    }
}