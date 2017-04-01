// @flow
import {
  RECT_WIDTH,
  RECT_HEIGHT,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
} from './consts';

const BASE_WIDTH = 1000;
const BASE_HEIGHT = 1750;

function toCanvasPx(x: number, y: number) {
  return {
    x: ((x / BASE_WIDTH) * RECT_WIDTH) + ((CANVAS_WIDTH - RECT_WIDTH) / 2),
    y: ((y / BASE_HEIGHT) * RECT_HEIGHT) + ((CANVAS_HEIGHT - RECT_HEIGHT) / 2),
  };
}

function fromCanvasPx(x: number, y: number) {
  return {
    x: ((x - ((CANVAS_WIDTH - RECT_WIDTH) / 2)) / RECT_WIDTH) * BASE_WIDTH,
    y: ((y - ((CANVAS_HEIGHT - RECT_HEIGHT) / 2)) / RECT_HEIGHT) * BASE_HEIGHT,
  };
}

function toCanvasHeight(height: number) {
  return (height / BASE_HEIGHT) * RECT_HEIGHT;
}

function toCanvasWidth(width: number) {
  return (width / BASE_WIDTH) * RECT_WIDTH;
}

function fromCanvasHeight(height: number) {
  return (height / RECT_HEIGHT) * BASE_HEIGHT;
}

function fromCanvasWidth(width: number) {
  return (width / RECT_WIDTH) * BASE_WIDTH;
}

export {
  toCanvasPx,
  fromCanvasPx,
  toCanvasHeight,
  toCanvasWidth,
  fromCanvasHeight,
  fromCanvasWidth
};
