import React, { Component } from 'react'
import { render } from 'react-dom'
import { connect } from 'react-redux'
import Downshift from 'downshift'

import { getFiatOptionList, getUserSettingsList, updateUserFiatOption } from '../../actions'

// import styled from 'styled-components'

import { TransitionGroup, Transition } from 'react-transition-group'
import { TweenMax } from 'gsap'
import fadeTransition from '../fade'

// VALIANT EFFORT, SAVE THIS FOR LATER REFERENCE AND CLEAN UP COMMENTS.
// BUT YOU REALLY NEED TO USE DOWNSHIFT AND LEARN ITS PATTERNS

// const ContainerDiv = styled.div`
//   position: absolute;
//   z-index: 9000;
//   top: 0.8rem;
//   left: 84%;
//   width: 16rem;
// `

// const Div = styled.div`
//   height: 2.4rem;
//   width: 8rem;
//   margin: 0;
//   margin-left: 25%;
//   line-height: 2.4rem;
//   text-align: center;
//   vertical-align: center;

//   &:hover {
//     cursor: pointer;
//     background-color: limegreen;
//   }
// `

// const ListDiv = styled.ul`
//   position: absolute;
//   top: 2rem;
//   left: -25%;
//   display: flex;
//   flex-direction: column;
//   height: 10rem;
//   width: 16rem;
//   margin: 0;
//   padding: 0;
//   overflow: auto;
//   list-style: none;
//   background-color: #fcfafa;
// `

// const Li = styled.li`
//   height: 2rem;
//   padding: 0.5rem;
//   margin: 0;
  
//   &:hover {
//     cursor: pointer;
//     background-color: limegreen;
//   }
// `

// The transition isn't working right now, but once I have my API
// sending the initial value for the Div header, then I won't need
// the list to actually be mounted upon component load
// then I can really toggle the list section, since I'll be passing an
// array of values anyway

class CurrencyDropDown extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedCurrency: null,
      showList: false,
      dropDownHover: false
    }

    this.updateSelectedCurrency = this.updateSelectedCurrency.bind(this)
    this.toggleList = this.toggleList.bind(this)
    this.enterTransition = this.enterTransition.bind(this)
    this.leaveTransition = this.leaveTransition.bind(this)
    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)
    this.setMouseDownEventListener = this.setMouseDownEventListener.bind(this)
    this.removeMouseDownEventListener = this.removeMouseDownEventListener.bind(this)
  }

  // Okay, so the way that picking selected currency will go:
  // 1. If no option has been selected, then the first currency in the array will be selected.
  // 2. Otherwise, I'll need to grab the UserSettings Model data via action/reducer cycle, and ensure
  // 3. that I handle all that good stuff that way.
  componentDidMount() {
    this.props.getUserSettingsList()
    this.props.getFiatOptionList()
    document.addEventListener('mousedown', this.handleMouseDown)
    document.addEventListener('keydown', this.handleKeyPress)
  }

  componentDidUnmount() {
    if (!this.state.currencyHover) {
      document.removeEventListener('mousedown', this.handleMouseDown)
    }
    document.removeEventListener('keypress', this.handleKeyPress)
  }
 
  updateSelectedCurrency(event) {
    let { selectedCurrency } = this.state
    let value = event.target.dataset.value
    let imgSrc = event.target.children[0].src
    const prevSelectedCurrency = selectedCurrency.abbreviated_currency

    if(selectedCurrency.abbreviated_currency !== value) {
      if(value && imgSrc) {
        this.setState((prevState, state) => ({
          selectedCurrency: { abbreviated_currency: value, flag_image: imgSrc }
        }))
        this.toggleList()
        const data = {
          // abbreviated_currency property name necessary for POST compatibility
          abbreviated_currency: value,
          fromCurrency: prevSelectedCurrency
        }
        this.props.updateUserFiatOption(data)
      }
    }
  }

  toggleList(event) {
    console.log("Toggle list runnin")
    this.setState((prevState, state) => ({
      showList: !prevState.showList
    }))
  }

  enterTransition(node) {
    TweenMax.fromTo(node, 0.4, {opacity: 0, y: -10}, {opacity: 1, y: 0})
  }

  leaveTransition(node) {
    TweenMax.fromTo(node, 0.4, {opacity: 1, y: 0}, {opacity: 0, y: -10})
  }

  handleMouseDown(event) {
    console.log(event.target)
    const { showList } = this.state
    if (event.target.className !== "dropDownSelector" && showList){
      this.toggleList()
    }
    // else if (event.target.className === "dropDownSelector dropDownListItem") {
    //   this.toggleList()
    // }
  }

  handleKeyPress(event) {
    const { showList } = this.state
    if (event.key === "Enter" && event.target.id === "dropDownToggleDiv") {
      console.log(event)
      this.toggleList()
    }
    // Next handle if showList === True and up or down arrow key is pressed, navigate list items
    if((event.key === "ArrowDown" || "ArrowUp") && showList) {
      console.log("Arrow key press event")
      // This event chain targets the list li's
      // Need to explore options for creating a WAI compliant listbox with focus on up down arrows
      console.log(event.target.nextElementSibling.childNodes[0].childNodes)
      this.list.children[0].focus()
      event.preventDefault()
      // **************************To-Do**********************************
      // Need to enable focus on list items for up and down arrow keypress
    }
  }

  setMouseDownEventListener() {
    this.setState((prevState, state) => ({
        dropDownHover: !prevState.dropDownHover
    }))
    if (this.state.dropDownHover) {
      document.addEventListener('mousedown', this.handleMouseDown)
    }
  }

  removeMouseDownEventListener() {
    this.setState((prevState, state) => ({
        dropDownHover: !prevState.dropDownHover
    }))
    if (!this.state.dropDownHover) {
      document.removeEventListener('mousedown', this.handleMouseDown)
    }
  }

  render() {
    const { selectedCurrency, showList } = this.state
    const { fiatOptionList, userSettingsList } = this.props
    if(userSettingsList && selectedCurrency === null) {
      this.setState((prevState, state) => ({
        selectedCurrency: userSettingsList
      }))
    }
    const hiddenStyle = {
      'visibility': 'hidden',
    }
    return(
      <div id="dropDownContainer" 
           class="dropDownSelector" 
           onMouseEnter={this.removeMouseDownEventListener}
           onMouseLeave={this.setMouseDownEventListener}
      >
        { this.state.selectedCurrency && 
          <div onClick={ this.toggleList }
               id="dropDownToggleDiv"
               class="dropDownSelector"
               tabIndex="0"
          >
            <img 
               src={ this.state.selectedCurrency.flag_image }
               class="dropDownSelector"
            />
            { this.state.selectedCurrency.abbreviated_currency }
          </div>
        }
        <TransitionGroup>
          { fiatOptionList.length > 0 && showList
            ?
              <Transition
                in={ showList }
                timeout={{
                enter: 400,
                exit: 400,
                }}
                mountOnEnter={ false }
                unmountOnExit={ true } 
                onEnter={ this.enterTransition }
                onExit={ this.leaveTransition }
              >
                <ul
                  id="dropDownDiv"
                  class="dropDownSelector"
                  // style={ showList ? null : hiddenStyle }
                  ref={ x => { this.list = x } }
                  onClick={ this.updateSelectedCurrency }
                >
                  { fiatOptionList.map(option => {
                      return (
                        <li
                          id={ `currency_${option.abbreviated_currency}` }
                          class="dropDownSelector dropDownListItem"
                          key={ option.abbreviated_currency } 
                          data-value={ option.abbreviated_currency }
                        >
                          <img id="currencyImg" src={ option.flag_image }/>
                          { option.currency }
                        </li>
                      )
                    }) 
                  }
                </ul> 
              </Transition>
            :
              null 
          }
        </TransitionGroup>        
      </div>
    )
  }
}

function mapStateToProps({ fiatOptionList, userSettingsList }) {
  return { fiatOptionList, userSettingsList }
}

export default connect(mapStateToProps, { getFiatOptionList, getUserSettingsList, updateUserFiatOption })(CurrencyDropDown)

{/* <Downshift
    onChange={selection => alert(`You selected ${selection}`)}
    render={({
      getInputProps,
      getItemProps,
      getLabelProps,
      isOpen,
      inputValue,
      highlightedIndex,
      selectedItem,
    }) => {(
      <div>
        { this.state.selectedCurrency && 
          <div onClick={ this.toggleList }>
            <img 
               src={ this.state.selectedCurrency.flag_image }
               class="dropDownSelector"
            />
            { this.state.selectedCurrency.abbreviated_currency }
          </div>
        }
        {isOpen ? (
          <div>
            {items
              .filter(i => !inputValue || i.includes(inputValue))
              .map((item, index) => (
                <div
                  {...getItemProps({
                    key: item,
                    index,
                    item,
                    style: {
                      backgroundColor: highlightedIndex === index
                        ? 'lightgray'
                        : 'white',
                      fontWeight: selectedItem === item
                        ? 'bold'
                        : 'normal',
                    },
                  })}
                >
                  {item}
                </div>
              ))}
          </div>
        ) : null}
      </div>
    )}
  /> */}


// render() {
//     const { selectedCurrency, showList } = this.state
//     const { fiatOptionList, userSettingsList } = this.props
//     if(userSettingsList && selectedCurrency === null) {
//       this.setState((prevState, state) => ({
//         selectedCurrency: userSettingsList
//       }))
//     }
//     const hiddenStyle = {
//       'visibility': 'hidden',
//     }
//     return(
//       <div id="dropDownContainer" 
//            class="dropDownSelector" 
//            onMouseEnter={this.removeMouseDownEventListener}
//            onMouseLeave={this.setMouseDownEventListener}
//       >
//         { this.state.selectedCurrency && 
//           <div onClick={ this.toggleList }
//                id="dropDownToggleDiv"
//                class="dropDownSelector"
//                tabIndex="0"
//           >
//             <img 
//                src={ this.state.selectedCurrency.flag_image }
//                class="dropDownSelector"
//             />
//             { this.state.selectedCurrency.abbreviated_currency }
//           </div>
//         }
//         <TransitionGroup>
//           { fiatOptionList.length > 0 && showList
//             ?
//               <Transition
//                 in={ showList }
//                 timeout={{
//                 enter: 400,
//                 exit: 400,
//                 }}
//                 mountOnEnter={ false }
//                 unmountOnExit={ true } 
//                 onEnter={ this.enterTransition }
//                 onExit={ this.leaveTransition }
//               >
//                 <ul
//                   id="dropDownDiv"
//                   class="dropDownSelector"
//                   // style={ showList ? null : hiddenStyle }
//                   ref={ x => { this.list = x } }
//                   onClick={ this.updateSelectedCurrency }
//                 >
//                   { fiatOptionList.map(option => {
//                       return (
//                         <li
//                           id={ `currency_${option.abbreviated_currency}` }
//                           class="dropDownSelector dropDownListItem"
//                           key={ option.abbreviated_currency } 
//                           data-value={ option.abbreviated_currency }
//                         >
//                           <img id="currencyImg" src={ option.flag_image }/>
//                           { option.currency }
//                         </li>
//                       )
//                     }) 
//                   }
//                 </ul> 
//               </Transition>
//             :
//               null 
//           }
//         </TransitionGroup>        
//       </div>
//     )
//   }