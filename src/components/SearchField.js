import React from 'react'
import {Textfield, IconButton} from 'react-mdl'
import css from './main.css'

export default class SearchField extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showPops: false
    }
  }

  handleFocus = e => {
    this.setState({
      showPops: true
    })
  }

  handleBlur = e => {
    window.setTimeout(() => {
      this.setState({
        showPops: false
      })
    }, 500)
  }

  handleSelect = e => {
    this.props.onSelect(e.target.innerHTML)
  }

  render () {
    return <div>
      <Textfield
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        className={css.searchfield}
        onChange={this.props.onSearchChange}
        label='搜索'
        floatingLabel
        value={this.props.query}
        style={{width: '200px'}} />
      <IconButton className={css.clearicon} onClick={this.props.onClearSearch} name='clear' />
        {
          this.props.pops.length && this.state.showPops
            ? <div className={css.searchpop}>
            <ul>
              {this.props.pops.map(t => <li onClick={this.handleSelect}>{t}</li>)}
            </ul>
          </div> : null
        }
    </div>
  }
}
