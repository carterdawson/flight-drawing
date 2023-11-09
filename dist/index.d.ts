export declare class Point {
    x: number;
    y: number;
    constructor(x: number, y: number);
}
export declare class Waypoint {
    lat: number;
    lon: number;
    constructor(lat: number, lon: number);
}
export declare class FlightDrawing {
    private lat_scale;
    private lon_scale;
    apt_drawing: Point[];
    pt_origin: Point;
    constructor(str_points: string, lat_scale?: number, lon_scale?: number);
    private _parsePoints;
    wptFromPt(wpt_origin: Waypoint, pt: Point): Waypoint;
    getRoute(wpt_origin: Waypoint): Waypoint[];
    getRouteString(wpt_origin: Waypoint): string;
}
