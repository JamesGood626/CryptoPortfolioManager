import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { getSymbolList, getHistoricalRate } from '../../actions'
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
  background: #c21500;  /* fallback for old browsers */
  background: -webkit-linear-gradient(to right, #FFA900, #c21500);  /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to right, #FFA900, #c21500); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  border-bottom-left-radius: 25px;
  box-shadow: 2px 2px 4px #aaa;

  @media (min-width: 900px) {
    height: 26rem;
    width: 24rem;
    margin-bottom: 1rem;
  }
`

const FormDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`
// Need to change fields to require
// Base Currency
// Quote Currency
// Price
// Quantity
// Fee


const FIELDS = [
  { name: 'price', label: 'Price' },
  { name: 'quantity', label: 'Quantity' },
  { name: 'fee', label: 'Fee' },
  { name: 'dateTime', label: 'Date-Time' }
]

// const SELL_FIELDS = [
//   { name: 'quantity', label: 'Quantity' },
//   { name: 'sell_price_btc', label: 'Sell Price BTC' },
//   { name: 'sell_price_fiat', label: 'Sell Price' },
//   { name: 'exchange_fee_btc', label: 'Exchange Fee BTC' },
//   { name: 'exchange_fee_fiat', label: 'Exchange Fee' }
// ]


class Form extends Component {
  constructor(props) {
    super(props)

    // this.checkLabel = this.checkLabel.bind(this)
  }

  componentWillMount() {
    if (!Array.isArray(this.props.symbolList)) {
      this.props.getSymbolList()
    }
  }

  // checkLabel(label) {
  //   if (label === "Purchase Price" || label === "Sell Price" || label === "Exchange Fee") {
  //     return true
  //   }
  //   return false
  // }

  renderFields() {
    return FIELDS.map(({ label, name }) => {
      return (
        <Field
          key={ name }
          label={ label }
          name={ name }
          type="text"
          component={ Input }
        />
      )
    })
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
      this.props.getHistoricalRate(values)
    }

    // const fieldStyles = {
    //   'color': '#371732'
    // }

    if(submitSucceeded) {
      reset()
    }

    return(
      <CenteredForm onSubmit={ handleSubmit(onSubmit) }>
        <FormDiv>
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
          <Field label="Base Currency" name="baseCurrency" type="text" list="cryptos" component={ Input } />
          <Field label="Quote Currency" name="quoteCurrency" type="text" list="cryptos" component={ Input } />
          { this.renderFields() }
          <SubmitButton type="submit">Submit</SubmitButton>
        </FormDiv>
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
  connect(mapStateToProps, { getSymbolList, getHistoricalRate })(Form)
)

// Can remove this from renderFields() because there will be no difference in field names
// const { buyOrder, sellOrder } = this.props
// const fiatOption = 'USD'
// const fiatOptionTwo = 'JPY'
// if (buyOrder) {
//       return BUY_FIELDS.map( ({ label, name }) => {
//         return (
//           <Field
//             key={ name }
//             label={ this.checkLabel(label) ? `${label} ${fiatOption}` : label  }
//             name={ name }
//             type="text"
//             component={ Input }
//           />
//         )
//       })
//     }
//     else if (sellOrder) {
//       return SELL_FIELDS.map( ({ label, name }) => {
//         return (
//           <Field
//             key={ name }
//             label={ this.checkLabel(label) ? `${label} ${fiatOptionTwo}` : label  }
//             name={ name }
//             type="text"
//             component={ Input }
//           />
//         )
//       })
//     }