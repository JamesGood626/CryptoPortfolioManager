import React from 'react'
import styled from 'styled-components'


const TableDiv = styled.div`
  height: 40%;
  width: 100%;
  overflow: auto;
  margin: 0;
  background-color: #fcfafa;
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`

const Th = styled.th`
  padding: .4rem;
  // These adjust table header title width
  padding-left: 5rem;
  padding-right: 5rem;
  border: .1rem solid #1C1C1C;
  font-size: 2.2vh;
  color: #1C1C1C;

  // @media (min-width: 900px) {
  //   font-size: 1rem;
  // }
`

const Tr = styled.tr`
  text-align: center;
  font-size: 2.3vh;
  background: #fcfafa;
`

const Td = styled.td`
  padding: 1rem;
  border: .1rem solid #1C1C1C;
`

const portfolioTable = ({ titles, cryptoAssetList }) => {
  const titleKeys = Object.getOwnPropertyNames(cryptoAssetList[0])
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
              }) : null
            } 
          </Tr>
        </thead>
        <tbody>
            { cryptoAssetList ?
             cryptoAssetList.map(cryptoAsset => {
              return ( 
                <Tr>
                  { 
                    titleKeys.map(property => { 
                      return <Td>{ cryptoAsset[property] }</Td> 
                    }) 
                  }
                </Tr>
              )
            }) : null
            }
        </tbody>
      </Table>
    </TableDiv>
  )
}

export default portfolioTable

// return (
//                 <Tr>
//                   <Td>{ cryptoAsset.ticker }</Td>
//                   <Td>{ cryptoAsset.quantity }</Td>
//                   <Td>{ cryptoAsset.initial_investment_fiat }</Td>
//                   <Td>{ cryptoAsset.initial_investment_btc }</Td>
//                 </Tr>
//               )