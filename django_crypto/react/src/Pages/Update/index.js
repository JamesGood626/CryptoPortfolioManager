import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import Header from '../../SharedComponents/FormComponents/header'
import Form from './Form'
import TickReveal from './TickReveal'

// this component is prime for a compound component refactor
// in a new file

const ContainerDiv= styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;

  // @media (min-width: 900px) {
  //   justify-content: center;
  // }
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
  width: 4rem;
  height: 2rem;
  margin: 0;
  font-size: 2vh;
  line-height: 2rem;
  text-align: center;
  color: #fcfafa;
  background: #aaa;
  border-top-right-radius: 14px;
  border-bottom-left-radius: 14px;
  box-shadow: 2px 2px 3px #ccc;

  @media (min-width: 900px) {
    width: 5.5rem;
    height: 2.8rem;
    line-height: 2.8rem;
    margin-right: 1.6rem;
  }
  @media (min-height: 740px) {
    font-size: 0.9rem;
  }

  &:hover {
    background: #17CA4A;
  }
  &:focus {
    outline: 0;
  }
`

const SellButton = styled.button`
  width: 4rem;
  height: 2rem;
  margin: 0;
  font-size: 2vh;
  line-height: 2rem;
  text-align: center;
  color: #fcfafa;
  background: #aaa;
  border-top-left-radius: 14px;
  border-bottom-right-radius: 14px;
  box-shadow: 2px 2px 3px #ccc;

  @media (min-width: 900px) {
    width: 5.5rem;
    height: 2.8rem;
    line-height: 2.8rem;
    margin-left: 1.6rem;
  }

  @media (min-height: 740px) {
    font-size: 0.9rem;
  }

  &:hover {
    background: #17CA4A;
  }
  &:focus {
    outline: 0;
  }
`

class Update extends Component {
  constructor(props) {
    super(props)
    this.state = {
      buyOrder: true,
      sellOrder: false,
      withdraw: false,
      deposit: false
    }
  }

  toggleBuy = () => {
    this.setState((prevState, state) => ({
        buyOrder: !prevState.buyOrder,
        sellOrder: false,
        deposit: false,
        withdraw: false
    }))
  }

  toggleSell = () => {
    this.setState((prevState, state) => ({
        sellOrder: !prevState.sellOrder,
        buyOrder: false,
        deposit: false,
        withdraw: false
    }))
  }

  toggleWithdraw = () => {
    this.setState((prevState, state) => ({
        withdraw: !prevState.withdraw,
        buyOrder: false,
        sellOrder: false,
        deposit: false
    }))
  }

  toggleDeposit = () => {
    this.setState((prevState, state) => ({
        deposit: !prevState.deposit,
        buyOrder: false,
        sellOrder: false,
        withdraw: false
    }))
  }

  selectOrderType = e => {
    if (e.target.innerHTML === "Buy") {
      this.toggleBuy()
    }
    else if (e.target.innerHTML === "Sell") {
      this.toggleSell()
    }
    else if (e.target.innerHTML === "Withdraw") {
      this.toggleWithdraw()
    }
    else if (e.target.innerHTML === "Deposit") {
      this.toggleDeposit()
    }
  }

  render() {
    const { buyOrder, sellOrder, withdraw, deposit } = this.state
    const { submitInProgress, addNewCryptoSuccess, addNewCryptoErr } = this.props
    const selectedStyle = {
      'color': '#fffbfc',
      'background': '#c21500',
      'background': '-webkit-linear-gradient(to right, #FFA900, #c21500)',
      'background': 'linear-gradient(to right, #FFA900, #c21500)',
      'border': 'solid #fffbfc .1rem'
    }

    if(submitInProgress) {
      return (
        <ContainerDiv>
          <h2>Loading...</h2>
        </ContainerDiv>
      )
    }
    if(addNewCryptoSuccess) {
      return (
        <ContainerDiv>
          <TickReveal/>
        </ContainerDiv>
      )
    }
    if(addNewCryptoErr) {
      return (
        <ContainerDiv>
          <h2>An error occurred.</h2>
        </ContainerDiv>
      )
    }

    return (
      <ContainerDiv>
        <OrderTypeDiv>
          <BuyButton style={ buyOrder ? selectedStyle : null } onClick={ !buyOrder && this.selectOrderType }>Buy</BuyButton>
          <BuyButton style={ deposit ? selectedStyle : null } onClick={ !deposit && this.selectOrderType }>Deposit</BuyButton>
          <SellButton style={ withdraw ? selectedStyle : null } onClick={ !withdraw && this.selectOrderType }>Withdraw</SellButton>
          <SellButton style={ sellOrder ? selectedStyle : null } onClick={ !sellOrder && this.selectOrderType }>Sell</SellButton>
        </OrderTypeDiv>
        <Header>Add a New Transaction</Header>
        <Form buyOrder={ buyOrder } sellOrder={ sellOrder } withdraw={ withdraw } deposit={ deposit }/>
      </ContainerDiv>
    )
  }
}


function mapStateToProps({ submitInProgress, addNewCryptoSuccess, addNewCryptoErr }) {
  return { submitInProgress, addNewCryptoSuccess, addNewCryptoErr }
}

export default connect(mapStateToProps, null)(Update)