import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { getSymbolList, getHistoricalRate, getBitcoinHistoricalRate } from '../../actions'
import { Field, reduxForm } from 'redux-form'

import Input from '../../SharedComponents/FormComponents/input'
import SubmitButton from '../../SharedComponents/submitButton'

import validateDateTime from '../../Utils/validateDateTime'
import ErrorBoundary from '../ErrorBoundary'


const CenteredForm = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 16rem;
  width: 18rem;
  font-family: 'Quattrocento', serif;
  background: #c21500;  /* fallback for old browsers */
  background: -webkit-linear-gradient(to right, #FFA900, #c21500);  /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to right, #FFA900, #c21500); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  border-bottom-left-radius: 25px;
  box-shadow: 2px 2px 4px #aaa;

  @media (min-width: 742px) {
    height: 23rem;
    width: 22rem;
    margin-bottom: 1rem;
  }

  @media (min-width: 1024px) {
    height: 25rem;
    width: 24rem;
    margin-bottom: 1rem;
  }
`

const FormDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  
  width: 100%;
`

const FIELDS = [
  { name: 'baseCurrency', label: 'Base Currency' },
  { name: 'quoteCurrency', label: 'Quote Currency' },
  { name: 'price', label: 'Price' },
  { name: 'quantity', label: 'Quantity' },
  { name: 'fee', label: 'Fee' },
  { name: 'dateTime', label: 'Date-Time' }
]

class Form extends Component {
  componentDidMount() {
    // Coinmarketcap ticker list for dropdown options
    if (!Array.isArray(this.props.symbolList)) {
      this.props.getSymbolList()
    }
  }

  renderFields(withdrawDepositOrder = false) {
    if(withdrawDepositOrder) {
      return FIELDS.map(({ label, name }) => {
        if(name === 'quoteCurrency') {
          return
        }
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
    return FIELDS.map(({ label, name }) => {
      if(name === 'baseCurrency' || name === 'quoteCurrency') {
        return (
          <Field
            key={ name }
            label={ label }
            name={ name }
            type="text"
            list="cryptos"
            component={ Input }
          />
        )
      }
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
    const { 
      handleSubmit,
      reset,
      submitSucceeded,
      symbolList,
      buyOrder,
      sellOrder,
      deposit,
      withdraw,
      addNewCryptoSuccess,
      addNewCryptoErr
    } = this.props
    
    const onSubmit = values => {
      // Sets necessary flag so that action creator can issue
      // a POST to the correct DRF api url
      if (buyOrder || sellOrder) {
        if (buyOrder) {
          values.buyOrder = true
        }
        else if (sellOrder) {
          values.sellOrder = true
        }
        this.props.getHistoricalRate(values)
      }
      if(deposit || withdraw) {
        if (deposit) {
          values.deposit = true
        }
        else if (withdraw) {
          values.withdraw = true
        }
        this.props.getBitcoinHistoricalRate(values)
      }
    }

    if(submitSucceeded) {
      reset()
    }

    return (
      <CenteredForm onSubmit={ handleSubmit(onSubmit) }>
        <datalist id="cryptos">
          { Array.isArray(symbolList) ? 
            symbolList.map((symbol, index) => {
                return (
                  <option key={ index } value={ symbol }/>
                )
              }) 
            : null 
          }
        </datalist>
        { this.props.withdraw || this.props.deposit ? this.renderFields(true) : this.renderFields() }
        <SubmitButton type="submit">Submit</SubmitButton>
      </CenteredForm>
    )
  }
}

// add more regex to prevent scripting
function validate(values) {
  const errors = {}

  errors.dateTime = validateDateTime(values.dateTime || '')

  return errors
}


function mapStateToProps({ symbolList }) {
  return { symbolList }
}

export default reduxForm({
  validate,
  form: 'AddNewCryptoForm'
})(
  connect(mapStateToProps, { getSymbolList, getHistoricalRate, getBitcoinHistoricalRate })(Form)
)