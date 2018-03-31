import React, { Component } from 'react'
import styled from 'styled-components'


const Div = styled.div`
  display: flex;
`

const ContainerDiv = Div.extend`
  flex-direction: column;
  width: 48rem;
  height: 36rem;
`

const HeaderDiv = Div.extend`
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 5.5rem;
  padding-left: 2.2rem;
  padding-right: 2.2rem;
  background-color: #371732;
  color: #f2f2f2;
`

const TableDiv = Div.extend`
  height: 80%;
  width: 100%;
  overflow: auto;
  background-color: #fcfafa;
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
  background-color: #4eb089;
  color: #f2f2f2;
`

const Tr = styled.tr`
  width: 2rem;
  text-align: center;
`

const Td = styled.td`
  padding: 1rem;
  border-bottom: .1rem solid #272d2d;
`

class PortfolioPerformance extends Component {
  render() {
    return (
      <ContainerDiv>
        <HeaderDiv>
          <h3>Total Portfolio Value:</h3>
          <h3>Gain/Loss</h3>
        </HeaderDiv>
        <TableDiv>
          <Table>
            <thead>
              <Tr>
                <Th>Ticker</Th>
                <Th>Quantity</Th>
                <Th>Total</Th>
                <Th>BTC Price</Th>
                <Th>USD Price</Th>
                <Th>1hr % Change</Th>
                <Th>24hr % Change</Th>
                <Th>7d % Change</Th>
              </Tr>
            </thead>
            <tbody>
              <Tr>
                <Td>Rick</Td>
                <Td>Johansen</Td>
                <Td>RJ@mail.com</Td>
                <Td>92345.00</Td>
              </Tr>
            </tbody>
          </Table>
        </TableDiv>
      </ContainerDiv>
    )
  }
}

export default PortfolioPerformance

// Basic table structure
// <table>
//   <tr>
//     <th>First Name</th>
//     <th>Last Name</th>
//     <th>Email</th>
//   </tr>
//   <tr>
//     <td>Rick</td>
//     <td>Johansen/td>
//     <td>RJ@mail.com</td>
//   </tr>
// </table>