import React, { Component } from 'react'
import styled from 'styled-components'

// import CurrencyDropDown from '../../SharedComponents/FormComponents/currencyDropDown'
import Header from '../../SharedComponents/FormComponents/header'
import Form from './Form'


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
  background-color: #fcfafa;
  border: solid #371732 .1rem;

  &:hover {
    color: #fcfafa;
    background-color: #4eb089;
    border: solid #fcfafa .1rem;
  }
`

const SellButton = styled.button`
  width: 8rem;
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

// ComponentWillMount will make an API call to the Python backend so that it may query
class Update extends Component {
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
      'color': '#fcfafa',
      'backgroundColor': '#371732',
      'border': 'solid #fcfafa .1rem'
    }

    return (
      <ContainerDiv>
        {/* <CurrencyDropDown/> */}
        <OrderTypeDiv>
          <BuyButton style={ buyOrder ? selectedStyle : null } onClick={ sellOrder ? this.selectOrderType : null }>Buy</BuyButton>
          <SellButton style={ sellOrder ? selectedStyle : null } onClick={ buyOrder ? this.selectOrderType : null }>Sell</SellButton>
        </OrderTypeDiv>
        <Header>Add a New Transaction</Header>
        <Form buyOrder={ buyOrder } sellOrder={ sellOrder }/>
      </ContainerDiv>
    )
  }
}

export default Update