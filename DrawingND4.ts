import * as nd from "nd4js";
import { FlightDrawing } from ".";

//TODO:
// [ ] Create wpt and npt types

export class DrawingND4 {
    static maxPoints: number = 0;
  
    wptOrigin: [number, number];
    scale_x: number;
    scale_y: number;
    numCulled: number;
    latScale: number = 0.000284757;
    lonScale: number = 0.000388889;
    degRotate: number = 0;
    degCullAngle: number = 0;
    nptSource: nd.array;
    nptFull: nd.array;
    nptPoints: nd.array;
    ptCenter: nd.array;
    ptOrigin: nd.array;
    nptCulled: nd.array;
  
    constructor(
      strPoints: string,
      wptOrigin: nd.array,
      scale_x: number = 1.0,
      scale_y: number = 1.0,
      degRotate: number = 0,
      degCullAngle: number = 0.0
    ) {

      this.wptOrigin = wptOrigin;
      this.scale_x = scale_x;
      this.scale_y = scale_y;
      this.numCulled = 0;
      this.nptSource = this.nptFull = this.nptPoints = this._parsePoints(strPoints);
  
      this.nptFull = this.nptFull.mapElems((point) => [
        this.scale_x * point[0],
        -this.scale_y * point[1],
      ]);
  
      if (this.degRotate !== 0) {
        const theta = (this.degRotate * Math.PI) / 180;
        const c = Math.cos(theta);
        const s = Math.sin(theta);
        const R = [
          [c, -s],
          [s, c],
        ];
        this.nptFull = this.nptFull.map((point) => [
          point[0] * R[0][0] + point[1] * R[0][1],
          point[0] * R[1][0] + point[1] * R[1][1],
        ]);
      }
  
      this.degCullAngle = degCullAngle;
      if (degCullAngle > 0) {
        this._cullPointsAngle(degCullAngle);
      } else {
        this._cullPointsCount();
      }
  
      const xMinMax = [
        Math.min(...this.nptFull.mapElems((point) => point[0])),
        Math.max(...this.nptFull.mapElems((point) => point[0])),
      ];
      const yMinMax = [
        Math.min(...this.nptFull.mapElems((point) => point[1])),
        Math.max(...this.nptFull.mapElems((point) => point[1])),
      ];
  
      const xCenter = (xMinMax[1] - xMinMax[0]) / 2 + xMinMax[0];
      const yCenter = (yMinMax[1] - yMinMax[0]) / 2 + yMinMax[0];
  
      this.ptCenter = [xCenter, yCenter];
      this.ptOrigin = this.nptFull[0];
    }
  
    private _cullPointsAngle(degCullAngle: number) {
      const numPoints = this.nptFull.length;
      let cullingMask = nd.tabulate([numPoints], (i) => true)
  
      const radCullAngle = (degCullAngle * 2 * Math.PI) / 360;
  
      let idxA = 0;
      let idxB = 1;
      let idxC = 2;
  
      while (idxC < numPoints) {
        const radAB = this._radBetween(this.nptSource[idxA], this.nptSource[idxB]);
        const radAC = this._radBetween(this.nptSource[idxA], this.nptSource[idxC]);
        const radDiff = Math.abs(radAC - radAB);
  
        if (radDiff < radCullAngle) {
          cullingMask[idxC - 1] = false;
          idxC += 1;
        } else {
          idxA = idxC - 1;
          idxB = idxA + 1;
          idxC = idxB + 1;
        }
      }
  
      this.nptPoints = this.nptFull.filter((_, index) => cullingMask[index]);
      this.nptCulled = this.nptFull.filter((_, index) => !cullingMask[index]);
      this.numCulled = this.nptCulled.length;
    }
  
    private _cullPointsCount() {
      if (DrawingND4.maxPoints > 0) {
        const numPoints = this.nptPoints.length;
        const numToCull = numPoints - DrawingND4.maxPoints;
  
        if (numToCull > 0) {
          const angles: [number, number][] = [];
  
          for (let i = 0; i < numPoints; i++) {
            if (i > numPoints - 3) {
              break;
            }
  
            const a = this.nptPoints[i];
            const b = this.nptPoints[i + 1];
            const c = this.nptPoints[i + 2];
  
            const ac = this._radBetween(a, c);
            const ab = this._radBetween(a, b);
            angles.push([i + 1, Math.abs(ac - ab)]);
          }
  
          angles.sort((a, b) => a[1] - b[1]);
          const anglesToCull = angles.slice(0, numToCull);
  
          const mask = new Array(numPoints).fill(true);
          for (const [index] of anglesToCull) {
            mask[index] = false;
          }
  
          this.nptPoints = this.nptFull.filter((_, index) => mask[index]);
          this.nptCulled = this.nptFull.filter((_, index) => !mask[index]);
          this.numCulled = numToCull;
        }
      }
    }
  
    private _radBetween(ptA: [number, number], ptB: [number, number]) {
      const line = [ptB[0] - ptA[0], ptB[1] - ptA[1]];
      return Math.atan(line[0] / line[1]);
    }
  
    public x(culled: boolean = true): number[] {
      if (culled) {
        return this.nptPoints.map((point) => point[0]);
      } else {
        return this.nptFull.map((point) => point[0]);
      }
    }
  
    public  y(culled: boolean = true): number[] {
      if (culled) {
        return this.nptPoints.map((point) => point[1]);
      } else {
        return this.nptFull.map((point) => point[1]);
      }
    }
  
    public  lat(culled: boolean = true): number[] {
      //return this.latFromY(this.y(culled));
        throw "Not implemented"
    }
  
    public lon(culled: boolean = true): number[] {
      //return this.lonFromX(this.x(culled));
        throw "Not implemented"
    }
  
    setScale(latScale: number, lonScale: number) {
      this.latScale = latScale;
      this.lonScale = lonScale;
    }
  
    private _parsePoints(strPoints: string): nd.array {
        const points: [number, number][] = [];
        const astrPoints = strPoints.split('|');
    
        for (const strPoint of astrPoints) {
          const [x, y] = strPoint.split(',').map(Number);
          points.push([x, y]);
        }
    
        return nd.array(points);
      }
    }
    
    function latFromY(y: number): number {
    const latScale = this.latScale;
    return this.wptOrigin[0] + latScale * (y - this.ptOrigin[1]);
    }

    function lonFromX(x: number): number {
    const lonScale = this.lonScale;
    return this.wptOrigin[1] + lonScale * (x - this.ptOrigin[0]);
    }

    function wptFromPt(pt: [number, number]): [number, number] {
    return [this.latFromY(pt[1]), this.lonFromX(pt[0])];
    }
    
    