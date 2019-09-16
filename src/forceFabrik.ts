import {fabrik, Point} from './fabrik';

export interface IKNode extends d3.SimulationNodeDatum {
  x: number;
  y: number;
};

export interface ForceFabrik extends d3.Force<d3.SimulationNodeDatum, any> {
  initialize(nodes: d3.SimulationNodeDatum[]): void;
  strength(strength: number): ForceFabrik;
  updateIkTarget(target: Point): void;
}

export const forceFabrik = (points: Point[], limbEdges: number[]): ForceFabrik => {
  let nodes: Array<IKNode> = [];
  let strength: number = 0.5;
  let ikTarget: Point = [0, 0];

  const force: ForceFabrik = (alpha) => {
    // const points = [...jointPoints];

    fabrik(1, Infinity, true)(
      points, // Mutating
      limbEdges,
      ikTarget
    );

    // jointPoints = points;

    points.forEach((p, i) => {
      let node = nodes[i] as Required<IKNode>;

      node.vx += (p[0] - node.x) * alpha * strength;
      node.vy += (p[1] - node.y) * alpha * strength;
    });
  };

  force.initialize = (_: Array<IKNode>) => {
    nodes = _;
  };

  force.strength = (_: number) => {
    strength = _;
    return force;
  };

  force.updateIkTarget = (_: Point) => {
    ikTarget = _;
  };

  return force;
};
