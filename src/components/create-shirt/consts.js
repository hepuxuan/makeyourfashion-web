// @flow

let canvasWidth;
let canvasHeight;

if (window.matchMedia('(min-width: 500px)').matches) {
  canvasWidth = 500;
  canvasHeight = 500;
} else if (window.matchMedia('(min-width: 400px)').matches) {
  canvasWidth = 350;
  canvasHeight = 350;
} else {
  canvasWidth = 290;
  canvasHeight = 290;
}

const CANVAS_HEIGHT = canvasHeight;
const CANVAS_WIDTH = canvasWidth;
const RECT_WIDTH = (9 / 25) * CANVAS_WIDTH;
const RECT_HEIGHT = (RECT_WIDTH * 7) / 4;
const DESIGN_WIDTH = 100 * (CANVAS_WIDTH / 500);
const DESIGN_HEIGHT = 100 * (CANVAS_HEIGHT / 500);

export {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  RECT_WIDTH,
  RECT_HEIGHT,
  DESIGN_WIDTH,
  DESIGN_HEIGHT,
};
