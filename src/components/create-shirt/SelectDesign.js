import React from 'react'
import {toggleDesignModel, updateOrder, fetchDesigns, fetchTags, fetchDesignsByTag} from '../../action'
import Modal from '../Modal'
import {connect} from 'react-redux'
import {values} from 'lodash'
import {Card, Chip, Textfield} from 'react-mdl'
import css from './create-shirt.css'
import uuid from 'uuid/v4'
import SearchField from '../SearchField'

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
          height: 100,
          width:100,
          x: 200,
          y: 200
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
