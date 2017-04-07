declare type Pos = {
  x: number,
  y: number,
};

declare type KonvaType = {
  show: () => void,
  hide: () => void,
  setX: () => void,
  setY: () => void,
  setWidth: () => void,
  setHeight: () => void,
  getHeight: () => number,
  getWidth: () => number,
  attrs: {
    x: number,
    y: number,
    height: number,
    width: number,
  },
};
