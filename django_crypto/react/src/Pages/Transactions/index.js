import React, { Component } from 'react'
import styled from 'styled-components'

import { connect } from 'react-redux'
import { getBuyOrderList, getSellOrderList, getProfitLossTransactionList } from '../../actions'

import Header from './header'
import TransactionTable from './transactionTable'

import capitalizeTitles from '../../Utils/capitalizeTitles'


const ContainerDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  width: 100vw;
  height: 100%;

  @media (min-width: 900px) {
    width: 100%;
  }
`

const LoadingDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
`

const OrderTypeDiv = styled.div`
  display: flex;
  justify-content: space-around;
  height: 2.8rem;
  width: 100vw;
  margin: 0;
  margin-bottom: 2rem;
  padding: 0;

  @media (min-width: 900px) {
    width: 48vw;
  }
`

const TableContainerDiv = styled.div`
  display: inline-flex;
  width: 100%;
`

const DisplaySelectButton = styled.button`
  width: 5.5rem;
  height: 2.2rem;
  margin: 0;
  font-size: 2vh;
  line-height: 2.2rem;
  text-align: center;
  color: #fcfafa;
  background: #aaa;
  border-top-left-radius: 14px;
  border-bottom-right-radius: 14px;
  box-shadow: 2px 2px 3px #ccc;

  &:hover {
    background: #17CA4A;
  }
  &:focus {
    outline: 0;
  }

  @media (min-width: 900px) {
    width: 7rem;
    height: 2.8rem;
    line-height: 2.8rem;
  }
  @media (min-height: 740px) {
    font-size: 0.9rem;
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
      sellOrderTitles: [],
      profitLossTransactionTitles: []
    }
  }

  componentDidMount = () => {
    this.props.getBuyOrderList()
    this.props.getSellOrderList()
    this.props.getProfitLossTransactionList()
  }

  toggleDisplayBuy = () => {
    this.setState((prevState, state) => ({
        displayBuyOrders: !prevState.displayBuyOrders
    }))
  }

  toggleDisplaySell = () => {
    this.setState((prevState, state) => ({
        displaySellOrders: !prevState.displaySellOrders
    }))
  }

  toggleDisplayActualizedPL = () => {
    this.setState((prevState, state) => ({
        displayActualizedPL: !prevState.displayActualizedPL
    }))
  }

  setDisplayFalse = (displayBuyOrders, displaySellOrders, displayActualizedPL) => {
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

  selectDisplayType = e => {
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

  // Currently causes infinite loop
  // if (this.props.buyOrderList[0] && this.state.buyOrderTitles.length === 0) {
  //   this.capitalizeTitleArray(this.props.buyOrderList[0], this.state.buyOrderTitles, buyOrderTitles)
  // }
  // capitalizeTitleArray = (modelObj, titleState, titleStateKey) => {
  //     let keyList = Object.getOwnPropertyNames(modelObj)
  //     let newTitleArr = keyList.map(capitalizeTitles.handleSingleTitle.bind(capitalizeTitles))
  //     this.setState((prevState, state) => ({
  //       titleStateKey: newTitleArr
  //     }))
  // }

  render() {
    const { buyOrderList, sellOrderList, refinedProfitLossTransactionList } = this.props
    const { 
      displayBuyOrders, 
      displaySellOrders, 
      displayActualizedPL, 
      buyOrderTitles, 
      sellOrderTitles, 
      profitLossTransactionTitles 
    } = this.state

    if (buyOrderList) {
      const buyOrderObj = buyOrderList[0]
      if(buyOrderObj && buyOrderTitles.length === 0) {
        let keyList = Object.getOwnPropertyNames(buyOrderObj)
        let newTitleArr = keyList.map(capitalizeTitles.handleSingleTitle.bind(capitalizeTitles))
        this.setState((prevState, state) => ({
          buyOrderTitles: newTitleArr
        }))
      }
    }
    
    if (sellOrderList) {
      const sellOrderObj = sellOrderList[0]
      if(sellOrderObj && sellOrderTitles.length === 0) {
        let keyList = Object.getOwnPropertyNames(sellOrderObj)
        let newTitleArr = keyList.map(capitalizeTitles.handleSingleTitle.bind(capitalizeTitles))
        this.setState((prevState, state) => ({
          sellOrderTitles: newTitleArr
        }))
      }
    }
    
    if (this.props.refinedProfitLossTransactionList) {
      const profitLossTransactionObj = refinedProfitLossTransactionList[0]
      if(profitLossTransactionObj && profitLossTransactionTitles.length === 0) {
        let keyList = Object.getOwnPropertyNames(profitLossTransactionObj)
        let newTitleArr = keyList.map(capitalizeTitles.handleSingleTitle.bind(capitalizeTitles))
        this.setState((prevState, state) => ({
          profitLossTransactionTitles: newTitleArr
        }))
      }
    }

    const selectedStyle = {
      'color': '#fcfafa',
      'background': '#c21500',
      'background': '-webkit-linear-gradient(to right, #FFA900, #c21500)',
      'background': 'linear-gradient(to right, #FFA900, #c21500)',
      'border': 'solid #fcfafa .1rem'
    }

    const config = {
      buy_order: {
        header: 'Buy Orders',
        titles: buyOrderTitles,
        list: buyOrderList
      },
      sell_order: {
        header: 'Sell Orders',
        titles: sellOrderTitles,
        list: sellOrderList
      },
      pl_transaction: {
        header: 'Actualized Profit/Loss',
        titles: profitLossTransactionTitles,
        list: refinedProfitLossTransactionList
      }
    }

    if((buyOrderList && buyOrderList !== 0) || 
       (sellOrderList && sellOrderList !== 0) || 
       (refinedProfitLossTransactionList && refinedProfitLossTransactionList !== 0)
      ) {
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
          <TableContainerDiv>
            <TransactionTable
              buy_order_config={ displayBuyOrders && config.buy_order }
              sell_order_config={ displaySellOrders && config.sell_order }
              pl_transaction_config={ displayActualizedPL && config.pl_transaction }
            />
          </TableContainerDiv>
        </ContainerDiv>
      )
    }
    return <LoadingDiv><h2>Loading...</h2></LoadingDiv>
  }
}


function mapStateToProps({ buyOrderList, sellOrderList, refinedProfitLossTransactionList }) {
  return { buyOrderList, sellOrderList, refinedProfitLossTransactionList }
}

export default connect(mapStateToProps, { getBuyOrderList, getSellOrderList, getProfitLossTransactionList })(Transactions)