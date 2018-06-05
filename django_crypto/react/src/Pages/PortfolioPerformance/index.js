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
  height: 100vh;
  padding-top: 5%;

  @media (min-width: 900px) {
    width: 100%;
  }
  @media (max-width: 899px) {
    justify-content: flex-end;
  }
`

const LoadingDiv = Div.extend`
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
`

const ChartTypeDiv = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: 2.8rem;
  width: 20rem;
  margin: 0;
  padding: 0;

  @media (min-width: 900px) {
    height: 4rem;
    width: 24rem;
    margin-top: 0;
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

const PieChartButton = styled.button`
  width: 7rem;
  height: 2.8rem;
  margin: 0;
  margin-right: 2rem;
  font-size: 2vh;
  line-height: 2.8rem;
  text-align: center;
  color: #fcfafa;
  background: #aaa;
  border-top-right-radius: 14px;
  border-bottom-left-radius: 14px;
  box-shadow: 2px 2px 3px #ccc;


  @media (min-height: 740px) {
    font-size: 0.8rem;
  }

  &:hover {
    background: #17CA4A;
  }
  &:focus {
    outline: 0;
  }
`

const BarChartButton = styled.button`
  width: 7rem;
  height: 2.8rem;
  margin: 0;
  margin-left: 2rem;
  font-size: 2vh;
  line-height: 2.8rem;
  text-align: center;
  color: #fcfafa;
  background: #aaa;
  border-top-left-radius: 14px;
  border-bottom-right-radius: 14px;
  box-shadow: 2px 2px 3px #ccc;


  @media (min-height: 740px) {
    font-size: 0.8rem;
  }

  &:hover {
    background: #17CA4A;
  }
  &:focus {
    outline: 0;
  }
`

class PortfolioPerformance extends Component {
  constructor(props) {
    super(props)

    this.state = {
      cryptoAssetTitles: [],
      showPieChart: true,
      showBarChart: false,
      pieChartData: null,
      barChartData: null
    }
  }
  
  componentDidMount() {
    this.props.getCryptoAssetList()
  }

  toggleCharts = () => {
    this.setState((prevState, state) => ({
      showPieChart: !prevState.showPieChart,
      showBarChart: !prevState.showBarChart
    }))
  }

  render() {
    const { cryptoAssetTitles, showPieChart, showBarChart, pieChartData, barChartData } = this.state
    const { cryptoAssetList, coinMarketApiDataList } = this.props
    if(!pieChartData && !barChartData) {
      if (coinMarketApiDataList) {
        const cryptoAssetObj = coinMarketApiDataList[0]
        if(cryptoAssetObj && this.state.cryptoAssetTitles.length === 0) {
          let keyList = Object.getOwnPropertyNames(cryptoAssetObj)
          let newTitleArr = keyList.map(capitalizeTitles.handleSingleTitle.bind(capitalizeTitles))
          this.setState((prevState, state) => ({
            cryptoAssetTitles: newTitleArr
          }))
        }
        var pieData = coinMarketApiDataList.reduce((acc, curr) => {
          let data = {
            'number': curr.quantity,
            'name': curr.ticker
          }
          acc.push(data)
          return acc
        }, [])
        var barData = coinMarketApiDataList.reduce((acc, curr) => {
          let data = {
            'number': curr.gain_loss_percentage,
            'name': curr.ticker
          }
          acc.push(data)
          return acc
        }, [])
        this.setState((prevState, state) => ({
          barChartData: barData,
          pieChartData: pieData
        }))
      }
    }

    const selectedStyle = {
      'color': '#fffbfc',
      'background': '#c21500',
      'background': '-webkit-linear-gradient(to right, #FFA900, #c21500)',
      'background': 'linear-gradient(to right, #FFA900, #c21500)',
      'border': 'solid #fffbfc .1rem'
    }
    const hidden = {
      'visibility': 'hidden'
    }

    if ((pieChartData && pieChartData.length !== 0) || (barChartData && barChartData.length !== 0)) {
      return (
        <ContainerDiv>
          <ChartTypeDiv>
            <PieChartButton style={ showPieChart ? selectedStyle : null } onClick={ !showPieChart ? this.toggleCharts : null }>Quantity</PieChartButton>
            <BarChartButton style={ showBarChart ? selectedStyle : null } onClick={ !showBarChart ? this.toggleCharts : null }>Percentage P/L</BarChartButton>
          </ChartTypeDiv>
            { (pieChartData && showPieChart)
            ? <PieChart pieChartData={ pieChartData }/>
            : null
          } 
          { (barChartData && showBarChart)
            ? <BarChart barChartData={ barChartData }/>
            : null
          }
          { coinMarketApiDataList
            ?
            <PortfolioTable 
              titles={ cryptoAssetTitles && cryptoAssetTitles } 
              cryptoAssetList={ coinMarketApiDataList.length > 0 && coinMarketApiDataList } 
            />
            :
            null
          }
        </ContainerDiv>
      )
    }
    return <LoadingDiv><h2>Loading...</h2></LoadingDiv>
  }
}

function mapStateToProps({ cryptoAssetList, coinMarketApiDataList }) {
  return { cryptoAssetList, coinMarketApiDataList }
}

export default connect(mapStateToProps, { getCryptoAssetList })(PortfolioPerformance)
