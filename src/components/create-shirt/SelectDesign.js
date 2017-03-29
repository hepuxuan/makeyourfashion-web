import React from 'react';
import { connect } from 'react-redux';
import { Card, Chip } from 'react-mdl';
import uuid from 'uuid/v4';
import css from './create-shirt.css';
import { toggleDesignModel, updateOrder, fetchDesigns, fetchTags, fetchDesignsByTag } from '../../action';
import Modal from '../Modal';
import SearchField from '../SearchField';
import { DESIGN_WIDTH, DESIGN_HEIGHT } from './consts';

@connect(state => ({
  order: state.ui.createOrder.order
}), dispatch => ({
  updateOrder (order) {
    dispatch(updateOrder(order))
  }
}))
class DesignCard extends React.Component {
  handleDesignSelect = e => {
    this.props.updateOrder({
      designs: {
        ...this.props.order.designs,
        [uuid()]: {
          designId: this.props.design.id,
          height: DESIGN_HEIGHT,
          width: DESIGN_WIDTH,
          x: 200 * (DESIGN_WIDTH / 100),
          y: 200 * (DESIGN_HEIGHT / 100),
        }
      }
    })
    this.props.onSelect && this.props.onSelect(e)
  }

  render () {
    return <Card onClick={this.handleDesignSelect}
      shadow={0}
      className={css.designcard}
      style={{background: `url(${this.props.design.imgUrl}) center / cover`}} />
  }
}

class TagIcon extends React.Component {
  handleClick = e => {
    e.preventDefault()
    this.props.onClick(this.props.value)
  }

  render () {
    return <Chip onClick={this.handleClick}>{this.props.value}</Chip>
  }
}

@connect(state => ({
  open: state.ui.createOrder.isDesignModelOpen,
  tags: state.entities.tags,
  designs: state.entities.designs
}), dispatch => ({
  fetchDesigns () {
    dispatch(fetchDesigns())
  },
  fetchTags () {
    dispatch(fetchTags())
  },
  fetchDesignsByTag (tag) {
    dispatch(fetchDesignsByTag(tag))
  },
  toggleDesignModel () {
    dispatch(toggleDesignModel)
  }
}))
export default class SelectDesign extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      query: ''
    }
  }

  componentDidMount () {
    this.props.fetchDesigns()
    this.props.fetchTags()
  }

  handleToggleDesignModel = e => {
    e.preventDefault()
    this.props.toggleDesignModel()
  }

  handleTagClick = tag => {
    this.setState({
      query: tag
    })
    this.props.fetchDesignsByTag(tag)
  }

  handleSearchChange = e => {
    this.setState({
      query: e.target.value
    })
  }

  handleSelectQuery = t => {
    this.setState({
      query: t
    })
  }

  handleClearSearch = e => {
    e.preventDefault()
    this.setState({
      query: ''
    })
  }

  render () {
    const designIds = this.state.query ? (this.props.designs.byTags[this.state.query] || []) : this.props.designs.byPopularity
    return <Modal onCloseModal={this.handleToggleDesignModel} open={this.props.open}>
      <SearchField
        onSearchChange={this.handleSearchChange}
        query={this.state.query}
        onSelect={this.handleSelectQuery}
        onClearSearch={this.handleClearSearch}
        pops={this.props.tags.allIds.map(id => this.props.tags.byIds[id].name).filter(tag => this.state.query.length && tag.startsWith(this.state.query))} />
      {this.props.tags.allIds.map(id => <span className={css.tag}>
        <TagIcon onClick={this.handleTagClick} value={this.props.tags.byIds[id].name} key={id} />
      </span>)}
      <div className={css.flexlist}>
        {designIds.map(id => <DesignCard
          onSelect={this.handleToggleDesignModel}
          design={this.props.designs.byIds[id]} />)}
      </div>
    </Modal>
  }
}
