import * as d3 from 'd3';
const R = require('ramda');

import {fabrik, Point2} from './fabrik';
import {IKNode, forceFabrik} from './forceFabrik';

////////////////////////
const viewBox: (opts: {minX: number; minY: number; width: number; height: number}) => string
  = ({minX, minY, width, height}) => `${minX} ${minY} ${width} ${height}`;
////////////////////////

const width = window.innerWidth;
const height = window.innerHeight;
const numPoints = 25;
const ikRoot = [width / 2, height] as Point2;
const ikTarget = [width / 2, 0] as Point2;

const svg = d3.select('body')
  .append('svg')
  .attr('width', width)
  .attr('height', height)
  .attr('viewBox', viewBox({
    minX: 0, minY: 0, width, height
  }));

const limbScale = d3.scaleSqrt()
  .domain([1, numPoints - 1])
  .range([100, 5]);

const areaScale = d3.scaleSqrt()
  .domain([0, numPoints])
  .range([3, 5]);

const edgeScale = d3.scaleSqrt()
  .domain([0, numPoints])
  .range([2, 50]);

const ikLimb: number[] = d3.range(numPoints - 1)
  .map((_, i) => limbScale(i + 1));

let jointPoints: Point2[] = ikLimb.reduce((points, boneLength) => ([
  ...points,
  R.over(
    R.lensIndex(1),                 // Subtract boneLength from the y-coordinate
    R.subtract(R.__, boneLength)    // of the last point generated, creating a
  )(R.last(points))                 // point somewhere directly "above" the last point.
]), [ikRoot]);

let jointNodes = jointPoints.map<IKNode>(p => ({
  x: p[0],
  y: p[1]
}));

const fabrikForce = forceFabrik(jointPoints, ikLimb)
  .strength(0.5);

const boneSimulation = d3.forceSimulation(jointNodes)
  .velocityDecay(.8)
  .alphaDecay(0)
  // .force('collide', d3.forceCollide()
  //   .radius((_, i) => ikLimb[i] / 2)
  //   .strength(1)
  // )
  .force('fabrik', fabrikForce)
  .on('tick', () => {
    svg.selectAll('.limb-path')
      .data([jointNodes.map(({x, y}) => ([x, y] as [number, number]))])
      .join('path')
        .attr('class',  'limb-path')
        .attr('fill', 'none')
        .attr('stroke', 'black')
        .attr('stroke-width', (d, i) => edgeScale(i))
        .attr('d', d3.line().curve(d3.curveLinear));

    svg.selectAll('.starting-points')
      .data(jointNodes)
      .join('circle')
        .attr('class', 'starting-points')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', (d, i) => areaScale(i))
        .style('fill', 'black')
        .style('stroke', 'black');
  });

d3.select('svg')
  .on('mousemove', () => {
    ikTarget[0] = d3.event.pageX;
    ikTarget[1] = d3.event.pageY;
    fabrikForce.updateIkTarget(ikTarget);
  });




