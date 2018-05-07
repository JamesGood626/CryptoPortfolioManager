import React, { Component } from 'react'
import styled from 'styled-components'

import { connect } from 'react-redux'
import { getCryptoAssetList } from '../../actions'

import PortfolioTable from './portfolioTable'
import PieChart from '../../SharedComponents/D3Components/PieChart'
import BarChart from '../../SharedComponents/D3Components/BarChart'

import capitalizeTitles from '../../Utils/capitalizeTitles'

const Div = styled.div`
  display: flex;
`

const ContainerDiv = Div.extend`
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 100vw;
  height: 100%;
  padding-top: 14%;

  @media (min-width: 900px) {
    width: 100%;
  }
`

const HeaderDiv = Div.extend`
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 5.5rem;
  padding-left: 2.2rem;
  padding-right: 2.2rem;
  background-color: #fffbfc;
  color: #011627;
`

const TableDiv = Div.extend`
  height: 80%;
  width: 100vw;
  overflow: auto;
  background-color: #fffbfc;

  @media (min-width: 900px) {
    //compensates for navbar width
    width: calc(100vw-16rem);
  }
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`

const Th = styled.th`
  width: 4rem;
  padding: .4rem;
  padding-left: 3rem;
  padding-right: 3rem;
  border-right: .2rem solid #fcfafa;
  background-color: #011627;
  color: #011627;
`

const Tr = styled.tr`
  width: 2rem;
  text-align: center;
`

const Td = styled.td`
  padding: 1rem;
  border-bottom: 2px solid #011627;
`

class PortfolioPerformance extends Component {
  constructor(props) {
    super(props)

    this.state = {
      cryptoAssetTitles: []
    }
  }
  
  componentDidMount() {
    this.props.getCryptoAssetList()
  }

  render() {
    const { cryptoAssetList, coinMarketApiDataList } = this.props
    if (coinMarketApiDataList) {
      console.log("THIS IF STATEMENT INSIDE OF THE RENDER FUNCTION RUNNING")
      const cryptoAssetObj = coinMarketApiDataList[0]
      if(cryptoAssetObj && this.state.cryptoAssetTitles.length === 0) {
        let keyList = Object.getOwnPropertyNames(cryptoAssetObj)
        let newTitleArr = keyList.map(capitalizeTitles.handleSingleTitle.bind(capitalizeTitles))
        this.setState((prevState, state) => ({
          cryptoAssetTitles: newTitleArr
        }))
      }
      var pieChartData = coinMarketApiDataList.reduce((acc, curr) => {
        let data = {
          'number': curr.initial_investment_fiat,
          'name': curr.ticker
        }
        acc.push(data)
        return acc
      }, [])
      var barChartData = coinMarketApiDataList.reduce((acc, curr) => {
        let data = {
          'number': curr.gain_loss_percentage,
          'name': curr.ticker
        }
        acc.push(data)
        return acc
      }, [])
    }

    const { cryptoAssetTitles } = this.state
    return (
      <ContainerDiv>
         <BarChart barChartData={ barChartData }/> 
        {/* <HeaderDiv>
          <h3>Total Portfolio Value:</h3>
          <h3>Gain/Loss:</h3>
        </HeaderDiv> */}
        { coinMarketApiDataList
          ?
          <PortfolioTable 
            titles={ cryptoAssetTitles && cryptoAssetTitles } 
            cryptoAssetList={ coinMarketApiDataList.length > 0 && coinMarketApiDataList } 
          />
          :
          null
        }
        {/* <PieChart pieChartData={pieChartData}/> */}
      </ContainerDiv>
    )
  }
}

function mapStateToProps({ cryptoAssetList, coinMarketApiDataList }) {
  return { cryptoAssetList, coinMarketApiDataList }
}

export default connect(mapStateToProps, { getCryptoAssetList })(PortfolioPerformance)
