import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { addNewCrypto, getSymbolList } from '../../actions'
import { Field, reduxForm } from 'redux-form'


import Input from '../../SharedComponents/FormComponents/input'
import SubmitButton from '../../SharedComponents/submitButton'
// import { getSymbolList } from '../../actions'
// import validateEmails from '../../utils/validateEmail'

import ErrorBoundary from '../ErrorBoundary'


const CenteredForm = styled.form`
  display: flex;
  flex-direction: column;
  height: 22rem;
  width: 20rem;
  font-family: 'Quattrocento', serif;
  color: #371732;
  background-color: #fcfafa;

  @media (min-width: 900px) {
    height: 26rem;
    width: 24rem;
    margin-bottom: 1rem;
  }
`

const Div = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`

const BUY_FIELDS = [
  { name: 'quantity', label: 'Quantity' },
  { name: 'purchase_price_btc', label: 'Purchase Price BTC' },
  { name: 'purchase_price_fiat', label: 'Purchase Price' },
  { name: 'exchange_fee_btc', label: 'Exchange Fee BTC' },
  { name: 'exchange_fee_fiat', label: 'Exchange Fee' }
]

const SELL_FIELDS = [
  { name: 'quantity', label: 'Quantity' },
  { name: 'sell_price_btc', label: 'Sell Price BTC' },
  { name: 'sell_price_fiat', label: 'Sell Price' },
  { name: 'exchange_fee_btc', label: 'Exchange Fee BTC' },
  { name: 'exchange_fee_fiat', label: 'Exchange Fee' }
]


class Form extends Component {
  constructor(props) {
    super(props)

    this.checkLabel = this.checkLabel.bind(this)
  }

  componentWillMount() {
    if (!Array.isArray(this.props.symbolList)) {
      this.props.getSymbolList()
    }
  }

  checkLabel(label) {
    if (label === "Purchase Price" || label === "Sell Price" || label === "Exchange Fee") {
      return true
    }
    return false
  }

  renderFields() {
    const { buyOrder, sellOrder } = this.props
    const fiatOption = 'USD'
    const fiatOptionTwo = 'JPY'
    if (buyOrder) {
      return BUY_FIELDS.map( ({ label, name }) => {
        return (
          <Field
            key={ name }
            label={ this.checkLabel(label) ? `${label} ${fiatOption}` : label  }
            name={ name }
            type="text"
            component={ Input }
          />
        )
      })
    }
    else if (sellOrder) {
      return SELL_FIELDS.map( ({ label, name }) => {
        return (
          <Field
            key={ name }
            label={ this.checkLabel(label) ? `${label} ${fiatOptionTwo}` : label  }
            name={ name }
            type="text"
            component={ Input }
          />
        )
      })
    }
  }
  
  render() {
    const { handleSubmit, reset, submitSucceeded, symbolList, buyOrder, sellOrder } = this.props
    
    const onSubmit = (values) => {
      if (buyOrder) {
        values.buyOrder = true
      }
      else if (sellOrder) {
        values.sellOrder = true
      }
      console.log(values)
      this.props.addNewCrypto(values)
    }

    // const fieldStyles = {
    //   'color': '#371732'
    // }

    if(submitSucceeded) {
      reset()
    }

    return(
      <CenteredForm onSubmit={ handleSubmit(onSubmit) }>
        <Div>
          <datalist id="cryptos">
            { Array.isArray(symbolList) ? 
              symbolList.map((symbol, index) => {
                  return(
                    <option key={ index } value={ symbol }/>
                  )
                }) 
              : null 
            }
          </datalist>
          <Field label="Add New Crypto" name="ticker" type="text" list="cryptos" component={ Input } /> 
          { this.renderFields() }
          <SubmitButton type="submit">Submit</SubmitButton>
        </Div>
      </CenteredForm>
    )
  }
}

// function validate(values) {
//   const errors = {}

//   errors.email = validateEmails(values.email || '')

//   if(!values.name || values.name.length < 3) {
//     errors.name = 'Enter your Name'
//   }
//   if(!values.email) {
//     errors.email = 'Enter your Email Address'
//   }
//   if(!values.projectInfo) {
//     errors.projectInfo = 'Please provide some information about your project'
//   }
//   return errors
// }


function mapStateToProps({ symbolList }) {
  return { symbolList }
}

export default reduxForm({
  form: 'AddNewCryptoForm'
})(
  connect(mapStateToProps, { getSymbolList, addNewCrypto })(Form)
)