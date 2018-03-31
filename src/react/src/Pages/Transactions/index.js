import React, { Component } from 'react'
import styled from 'styled-components'

import { connect } from 'react-redux'
import { getBuyOrderList, getSellOrderList } from '../../actions'

import Header from './header'
import TransactionTable from './transactionTable'

import capitalizeTitles from '../../Utils/capitalizeTitles'


const ContainerDiv = styled.div`
  display: flex;
  flex-direction: column;
  width: 48rem;
  height: 36rem;
`

const OrderTypeDiv = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: 2.8rem;
  width: 48rem;
  margin: 0;
  margin-bottom: 1.4rem;
  padding: 0;
`

const DisplaySelectButton = styled.button`
  width: 8rem;
  height: 2.8rem;
  margin: 0;
  font-size: 1rem;
  line-height: 2.8rem;
  text-align: center;
  background-color: #fcfafa;
  border: solid #371732 .1rem;

  &:hover {
    color: #fcfafa;
    background-color: #4eb089;
    border: solid #fcfafa .1rem;
  }
`

const SellButton = styled.button`
  width: 7rem;
  height: 2.8rem;
  margin: 0;
  margin-left: 2rem;
  font-size: 1rem;
  line-height: 2.8rem;
  text-align: center;
  background-color: #fcfafa;
  border: solid #371732 .1rem;

  &:hover {
    color: #fcfafa;
    background-color: #4eb089;
    border: solid #fcfafa .1rem;
  }
`


class Transactions extends Component {
  constructor(props) {
    super(props)
    this.state = {
      displayBuyOrders: true,
      displaySellOrders: false,
      displayActualizedPL: false,
      buyOrderTitles: [],
      sellOrderTitles: []
    }

    this.selectDisplayType = this.selectDisplayType.bind(this)
    this.setDisplayFalse = this.setDisplayFalse.bind(this)
    this.toggleDisplayBuy = this.toggleDisplayBuy.bind(this)  
    this.toggleDisplaySell = this.toggleDisplaySell.bind(this)
    this.toggleDisplayActualizedPL = this.toggleDisplayActualizedPL.bind(this)
  }

  componentDidMount() {
    if (this.props.buyOrderList || this.props.sellOrderList) {
      this.props.getBuyOrderList()
      this.props.getSellOrderList()
    }
  }


  toggleDisplayBuy() {
    this.setState((prevState, state) => ({
        displayBuyOrders: !prevState.displayBuyOrders
    }))
  }

  toggleDisplaySell() {
    this.setState((prevState, state) => ({
        displaySellOrders: !prevState.displaySellOrders
    }))
  }

  toggleDisplayActualizedPL() {
    this.setState((prevState, state) => ({
        displayActualizedPL: !prevState.displayActualizedPL
    }))
  }

  setDisplayFalse(displayBuyOrders, displaySellOrders, displayActualizedPL) {
    if (displayBuyOrders) {
      this.toggleDisplayBuy()
    }
    else if (displaySellOrders) {
      this.toggleDisplaySell()
    }
    else if (displayActualizedPL) {
      this.toggleDisplayActualizedPL()
    }
  }

  selectDisplayType(e) {
    const { displayBuyOrders, displaySellOrders, displayActualizedPL } = this.state
    this.setDisplayFalse(displayBuyOrders, displaySellOrders, displayActualizedPL)
    if (e.target.innerHTML === "Buy Orders") {
      this.toggleDisplayBuy()
    }
    else if (e.target.innerHTML === "Sell Orders") {
      this.toggleDisplaySell()
    }
    else if (e.target.innerHTML === "Actualized P/L") {
      this.toggleDisplayActualizedPL()
    }
  }

  // Caught in an infinite loop, need to troubleshoot...

  render() {
    const buyOrderObj = this.props.buyOrderList[0]
    if(buyOrderObj && this.state.buyOrderTitles.length === 0) {
      let keyList = Object.getOwnPropertyNames(buyOrderObj)
      let newTitleArr = keyList.map(capitalizeTitles.handleSingleTitle.bind(capitalizeTitles))
      this.setState((prevState, state) => ({
        buyOrderTitles: newTitleArr
      }))
    }
    const sellOrderObj = this.props.sellOrderList[0]
    if(sellOrderObj && this.state.sellOrderTitles.length === 0) {
      let keyList = Object.getOwnPropertyNames(sellOrderObj)
      let newTitleArr = keyList.map(capitalizeTitles.handleSingleTitle.bind(capitalizeTitles))
      this.setState((prevState, state) => ({
        sellOrderTitles: newTitleArr
      }))
    }
    
    const { displayBuyOrders, displaySellOrders, displayActualizedPL, buyOrderTitles, sellOrderTitles } = this.state
    const { buyOrderList, sellOrderList } = this.props
    const selectedStyle = {
      'color': '#fcfafa',
      'backgroundColor': '#371732',
      'border': 'solid #fcfafa .1rem'
    }
    console.log(buyOrderList)

    return (
      <ContainerDiv>
        <OrderTypeDiv>
          <DisplaySelectButton 
            style={ displayBuyOrders ? selectedStyle : null } 
            onClick={ (displaySellOrders || displayActualizedPL) ? this.selectDisplayType : null }
          >
            Buy Orders
          </DisplaySelectButton>
          <DisplaySelectButton 
            style={ displaySellOrders ? selectedStyle : null } 
            onClick={ (displayBuyOrders || displayActualizedPL) ? this.selectDisplayType : null }
          >
            Sell Orders
          </DisplaySelectButton>
          <DisplaySelectButton 
            style={ displayActualizedPL ? selectedStyle : null } 
            onClick={ (displayBuyOrders || displaySellOrders) ? this.selectDisplayType : null }
          >
            Actualized P/L
          </DisplaySelectButton>
        </OrderTypeDiv>
        { displayBuyOrders &&
          <ContainerDiv>
          <Header>Buy Orders</Header>
          <TransactionTable 
            titles={ buyOrderTitles && buyOrderTitles } 
            buyOrderList={ buyOrderList.length > 0 && buyOrderList } 
          />
          </ContainerDiv>
        }
        { displaySellOrders &&
          <ContainerDiv>
          <Header>Sell Orders</Header>
          <TransactionTable 
            titles={ sellOrderTitles && sellOrderTitles } 
            sellOrderList={ sellOrderList.length > 0 && sellOrderList } 
          />
          </ContainerDiv>
        }
        { displayActualizedPL &&
          <ContainerDiv>
          <Header>Actualized Profit/Loss</Header>
          <TransactionTable />
          </ContainerDiv>
        }
      </ContainerDiv>
    )
  }
}


function mapStateToProps({ buyOrderList, sellOrderList }) {
  return { buyOrderList, sellOrderList }
}

export default connect(mapStateToProps, { getBuyOrderList, getSellOrderList })(Transactions)
