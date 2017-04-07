// @flow
import React from 'react';
import { connect } from 'react-redux';
import { Image, Text as KonvaText, Group, Rect } from 'react-konva';
import { updateText, toggleEditTextPanel, updateActiveTextId, removeText } from '../../action';
import { toCanvasPx, fromCanvasPx } from './util';
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  RECT_WIDTH,
  RECT_HEIGHT,
} from './consts';

function getDragBound(pos: Pos, minx: number, miny: number, maxx: number, maxy: number) {
  let x;
  let y;

  if (pos.x < minx) {
    x = minx;
  } else if (pos.x > maxx) {
    x = maxx;
  } else {
    x = pos.x;
  }

  if (pos.y < miny) {
    y = miny;
  } else if (pos.y > maxy) {
    y = maxy;
  } else {
    y = pos.y;
  }

  return {
    x,
    y,
  };
}

class Text extends React.Component {
  state = {
    removeImg: null,
  };
  componentDidMount() {
    this.rect.setX(-10);
    this.rect.setY(-10);
    this.rect.setWidth(this.text.getWidth() + 20);
    this.rect.setHeight(this.text.getHeight() + 20);
    if (!this.props.editible) {
      this.rect.hide();
      this.deleteButton.hide();
      this.props.toggleEditTextPanel(false);
    }
    const removeImg = new window.Image();
    removeImg.src = '/makeyourfashion-web/docs/delete.svg';
    // removeImg.src = '/docs/delete.svg'; // uncomment locally
    removeImg.onload = () => {
      this.setState({
        removeImg,
      });
    };
    this.deleteButton.setY(((this.text.getHeight() + 10) - 30) / 2);
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.editible) {
      this.rect.hide();
      this.deleteButton.hide();
      this.props.toggleEditTextPanel(false);
    } else {
      this.deleteButton.show();
      this.rect.show();
    }
  }

  componentDidUpdate() {
    this.rect.setWidth(this.text.getWidth() + 20);
    this.rect.setHeight(this.text.getHeight() + 20);
  }

  props: {
    texts: {},
    textId: string,
    editible: boolean,
    updateText: (text: {}) => void,
    toggleEditTextPanel: (payload: boolean) => void,
    updateActiveTextId: (id: string) => void,
    removeText: (id: string) => void,
  }

  text: KonvaType
  group: KonvaType
  rect: KonvaType
  deleteButton: KonvaType

  handleDragBound = (pos: Pos) => {
    const minx = (CANVAS_WIDTH - RECT_WIDTH) / 2;
    const miny = (CANVAS_HEIGHT - RECT_HEIGHT) / 2;
    const maxx = (minx + RECT_WIDTH) - this.text.getWidth();
    const maxy = (miny + RECT_HEIGHT) - this.text.getHeight();
    return getDragBound(pos, minx, miny, maxx, maxy);
  }

  handleRemoveText = () => {
    this.props.removeText(this.props.textId);
  }

  handleDragEnd = () => {
    const { x, y } = fromCanvasPx(this.group.attrs.x, this.group.attrs.y);
    this.props.updateText({
      ...this.props.texts[this.props.textId],
      x,
      y,
      id: this.props.textId,
    });
  }

  handleClick = () => {
    if (this.props.editible) {
      this.props.updateActiveTextId(this.props.textId);
      this.props.toggleEditTextPanel(true);
    }
  }

  handleMouseOver = () => {
    document.body.style.cursor = 'pointer';
  }

  handleMouseOut = () => {
    document.body.style.cursor = 'default';
  }

  render() {
    const { text, x, y, fontSize } = this.props.texts[this.props.textId];
    const canvasXY = toCanvasPx(x, y);
    return (
      <Group
        ref={(r) => { this.group = r; }}
        x={canvasXY.x}
        y={canvasXY.y}
        draggable={this.props.editible}
        onDragEnd={this.handleDragEnd}
        dragBoundFunc={this.handleDragBound}
      >
        <Group
          x={-30}
          ref={(r) => { this.deleteButton = r; }}
          onClick={this.handleRemoveText}
          onTouchStart={this.handleRemoveText}
        >
          <Rect
            fill="white"
            x={2.5}
            height={20}
            width={15}
          />
          <Image
            height={20}
            width={20}
            onMouseOver={this.handleMouseOver}
            onMouseOut={this.handleMouseOut}
            image={this.state.removeImg}
          />
        </Group>
        <Rect
          strokeWidth={1}
          ref={(r) => { this.rect = r; }}
          stroke="white"
          dash={[10, 5]}
        />
        <KonvaText
          onMouseDown={this.handleClick}
          onTouchStart={this.handleClick}
          ref={(r) => { this.text = r; }}
          fontSize={fontSize}
          text={text}
        />
      </Group>
    );
  }
}

export default connect(state => ({
  texts: state.ui.createOrder.order.texts,
}), dispatch => ({
  updateText(text) {
    dispatch(updateText(text));
  },
  toggleEditTextPanel(payload) {
    dispatch(toggleEditTextPanel(payload));
  },
  updateActiveTextId(id) {
    dispatch(updateActiveTextId(id));
  },
  removeText(id) {
    dispatch(removeText(id));
  },
}))(Text);
