import React, { Component } from 'react'
import styled from 'styled-components'

// import CurrencyDropDown from '../../SharedComponents/FormComponents/currencyDropDown'
import Header from '../../SharedComponents/FormComponents/header'
import Form from './Form'

import PieChart from '../../SharedComponents/D3Components/PieChart'


const ContainerDiv= styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;

  @media (min-width: 900px) {
    justify-content: center;
  }
`

const OrderTypeDiv = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: 2.8rem;
  width: 20rem;
  margin: 0;
  margin-bottom: 1.4rem;
  margin-top: 4rem;
  padding: 0;

  @media (min-width: 900px) {
    height: 5.5rem;
    width: 24rem;
    margin-top: 0;
  }
`

const BuyButton = styled.button`
  width: 7rem;
  height: 2.8rem;
  margin: 0;
  margin-right: 2rem;
  font-size: 1rem;
  line-height: 2.8rem;
  text-align: center;
  color: #fcfafa;
  background: #aaa;
  border-top-right-radius: 14px;
  border-bottom-left-radius: 14px;
  box-shadow: 2px 2px 3px #ccc;

  &:hover {
    background: #17CA4A;
  }
  &:focus {
    outline: 0;
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
`

type State = {
  buyOrder: boolean,
  sellOrder: boolean
}
// ComponentWillMount will make an API call to the Python backend so that it may query
class Update extends Component<State> {
  constructor(props) {
    super(props)
    this.state = {
      buyOrder: true,
      sellOrder: false
    }

    this.selectOrderType = this.selectOrderType.bind(this)
    this.toggleBuy = this.toggleBuy.bind(this)  
    this.toggleSell = this.toggleSell.bind(this)  
  }

  toggleBuy() {
    this.setState((prevState, state) => ({
        buyOrder: !prevState.buyOrder
    }))
  }

  toggleSell() {
    this.setState((prevState, state) => ({
        sellOrder: !prevState.sellOrder
    }))
  }

  selectOrderType(e) {
    if (e.target.innerHTML === "Buy") {
      this.toggleSell()
      this.toggleBuy()
    }
    else if (e.target.innerHTML === "Sell") {
      this.toggleBuy()
      this.toggleSell()
    }
  }

  render() {
    const { buyOrder, sellOrder } = this.state
    const selectedStyle = {
      'color': '#fffbfc',
      'background': '#c21500',
      'background': '-webkit-linear-gradient(to right, #FFA900, #c21500)',
      'background': 'linear-gradient(to right, #FFA900, #c21500)',
      'border': 'solid #fffbfc .1rem'
    }

    return (
      <ContainerDiv>
        {/* <CurrencyDropDown/> */}
        <OrderTypeDiv>
          <BuyButton style={ buyOrder ? selectedStyle : null } onClick={ sellOrder ? this.selectOrderType : null }>Buy</BuyButton>
          <SellButton style={ sellOrder ? selectedStyle : null } onClick={ buyOrder ? this.selectOrderType : null }>Sell</SellButton>
        </OrderTypeDiv>
        {/* <PieChart/> */}
        <Header>Add a New Transaction</Header>
        <Form buyOrder={ buyOrder } sellOrder={ sellOrder }/>
      </ContainerDiv>
    )
  }
}

export default Update