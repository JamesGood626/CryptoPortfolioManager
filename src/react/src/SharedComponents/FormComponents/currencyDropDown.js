import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getFiatOptionList, getUserSettingsList } from '../../actions'

import styled from 'styled-components'

import fadeTransition from '../fade'

const ContainerDiv = styled.div`
  position: absolute;
  z-index: 9000;
  top: 0.8rem;
  left: 84%;
  width: 16rem;
`
const Div = styled.div`
  height: 2.4rem;
  width: 8rem;
  margin: 0;
  margin-left: 25%;
  line-height: 2.4rem;
  text-align: center;
  vertical-align: center;

  &:hover {
    cursor: pointer;
    background-color: limegreen;
  }
`

const ListDiv = styled.ul`
  position: absolute;
  top: 2rem;
  left: -25%;
  display: flex;
  flex-direction: column;
  height: 10rem;
  width: 16rem;
  margin: 0;
  padding: 0;
  overflow: auto;
  list-style: none;
  background-color: #fcfafa;
`

const Li = styled.li`
  height: 2rem;
  padding: 0.5rem;
  margin: 0;
  
  &:hover {
    cursor: pointer;
    background-color: limegreen;
  }
`

// The transition isn't working right now, but once I have my API
// sending the initial value for the Div header, then I won't need
// the list to actually be mounted upon component load
// then I can really toggle the list section, since I'll be passing an
// array of values anyway

class CurrencyDropDown extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selected: null,
      showList: false
    }
    this.updateSelected = this.updateSelected.bind(this)
    this.toggleList = this.toggleList.bind(this)
    this.handleClickOutside = this.handleClickOutside.bind(this)
  }

  // Okay, so the way that picking selected currency will go:
  // 1. If no option has been selected, then the first currency in the array will be selected.
  // 2. Otherwise, I'll need to grab the UserSettings Model data via action/reducer cycle, and ensure
  // 3. that I handle all that good stuff that way.
  componentDidMount() {
    this.props.getUserSettingsList()
    this.props.getFiatOptionList()
    document.addEventListener('mousedown', this.handleClickOutside)
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside)
  }
    // The path to access Li's innerHTML
    // this.list.props.children[0].props.children

    // this.setState((prevState, state) => ({
    //   selected: this.list.props.children[0].props.children
    // }))

  updateSelected(event) {
    let { selected } = this.state
    let value = event.target.dataset.value
    let imgSrc = event.target.children[0].src
    
    if(selected.abbreviated_currency !== value) {
      // Send this value off to database to update fiat_option
      // event.target.dataset.value
      
      if(value && imgSrc) {
        this.setState((prevState, state) => ({
          selected: { abbreviated_currency: value, flag_image: imgSrc }
        }))
      }
    }
  }

  toggleList() {
    this.setState((prevState, state) => ({
      showList: !prevState.showList
    }))
  }

  handleClickOutside(event) {
    if (this.state.showList) {
      this.updateSelected(event)
      this.toggleList()
    }
  }

  render() {
    const { selected, showList } = this.state
    const { fiatOptionList, userSettingsList } = this.props
    if(userSettingsList && selected === null) {
      this.setState((prevState, state) => ({
        selected: userSettingsList
      }))
    }
    const hiddenStyle = {
      'visibility': 'hidden',
    }
    return(
      <ContainerDiv>
        {this.state.selected && <Div onClick={ this.toggleList }><img src={ this.state.selected.flag_image }/>{ this.state.selected.abbreviated_currency }</Div>}
        <fadeTransition in={ showList } timeout={500}>
           { fiatOptionList.length > 0 ?
            <ListDiv style={ showList ? null : hiddenStyle } ref={ x => { this.list = x } } onClick={ event => this.updateSelected(event) }>
              { fiatOptionList.map(option => {
                  return (
                    <Li key={ option.abbreviated_currency } data-value={ option.abbreviated_currency }><img src={ option.flag_image }/>{ option.currency }</Li>
                  )
                }) 
              }
            </ListDiv> :
            null 
          } 
        </fadeTransition>
      </ContainerDiv>
      // <select name="currency_code">
      //   <option value="">Select Currency</option>
      //   <option value="AUD">Australian Dollar</option>
      //   <option value="BRL">Brazilian Real </option>
      //   <option value="CAD">Canadian Dollar</option>
      //   <option value="CZK">Czech Koruna</option>
      //   <option value="DKK">Danish Krone</option>
      //   <option value="EUR">Euro</option>
      //   <option value="HKD">Hong Kong Dollar</option>
      //   <option value="HUF">Hungarian Forint </option>
      //   <option value="ILS">Israeli New Sheqel</option>
      //   <option value="JPY">Japanese Yen</option>
      //   <option value="MYR">Malaysian Ringgit</option>
      //   <option value="MXN">Mexican Peso</option>
      //   <option value="NOK">Norwegian Krone</option>
      //   <option value="NZD">New Zealand Dollar</option>
      //   <option value="PHP">Philippine Peso</option>
      //   <option value="PLN">Polish Zloty</option>
      //   <option value="GBP">Pound Sterling</option>
      //   <option value="SGD">Singapore Dollar</option>
      //   <option value="SEK">Swedish Krona</option>
      //   <option value="CHF">Swiss Franc</option>
      //   <option value="TWD">Taiwan New Dollar</option>
      //   <option value="THB">Thai Baht</option>
      //   <option value="TRY">Turkish Lira</option>
      //   <option value="USD" SELECTED="YES">U.S. Dollar</option>
      // </select>
    )
  }
}

function mapStateToProps({ fiatOptionList, userSettingsList }) {
  return { fiatOptionList, userSettingsList }
}

export default connect(mapStateToProps, { getFiatOptionList, getUserSettingsList })(CurrencyDropDown)