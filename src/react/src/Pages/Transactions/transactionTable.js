import React from 'react'
import styled from 'styled-components'


const TableDiv = styled.div`
  height: 80%;
  width: 100%;
  overflow: auto;
  margin: 0;
  background-color: #fcfafa;
`

const Table = styled.table`
  width: 20rem;
  border-collapse: collapse;
`

const Th = styled.th`
  width: 7rem;
  padding: .4rem;
  // These adjust table header title width
  padding-left: 5rem;
  padding-right: 5rem;
  border-right: .2rem solid #fcfafa;
  background-color: #4eb089;
  font-size: 1rem;
  color: #f2f2f2;
`

const Tr = styled.tr`
  width: 4rem;
  text-align: center;
`

const Td = styled.td`
  padding: 1rem;
  border-bottom: .1rem solid #272d2d;
`

const logIt = (item) => {
  console.log(item)
}

const transactionTable = ({ titles, buyOrderList, sellOrderList }) => {
  console.log("Buy order list inside transaction table")
  console.log(buyOrderList)
  return (
    <TableDiv>
      <Table>
        <thead>
          <Tr>
             { titles ?
             titles.map(title => {
                return (
                  <Th>{ title }</Th>
                )
              })
              :
              null
            } 
          </Tr>
        </thead>
        <tbody>
            { buyOrderList ?
             buyOrderList.map(buyOrder => {
              return (
                <Tr>
                  <Td>{ buyOrder.ticker }</Td>
                  <Td>{ buyOrder.quantity }</Td>
                  <Td>{ buyOrder.purchase_price_fiat }</Td>
                  <Td>{ buyOrder.purchase_price_btc }</Td>
                  <Td>{ buyOrder.exchange_fee_fiat }</Td>
                  <Td>{ buyOrder.exchange_fee_btc }</Td>
                </Tr>
              )
            })
            :
            null
          }
          { sellOrderList ?
             sellOrderList.map(sellOrder => {
              return (
                <Tr>
                  <Td>{ sellOrder.ticker }</Td>
                  <Td>{ sellOrder.quantity }</Td>
                  <Td>{ sellOrder.sell_price_fiat }</Td>
                  <Td>{ sellOrder.sell_price_btc }</Td>
                  <Td>{ sellOrder.exchange_fee_fiat }</Td>
                  <Td>{ sellOrder.exchange_fee_btc }</Td>
                </Tr>
              )
            })
            :
            null
          }   
        </tbody>
      </Table>
    </TableDiv>
  )
}

export default transactionTable