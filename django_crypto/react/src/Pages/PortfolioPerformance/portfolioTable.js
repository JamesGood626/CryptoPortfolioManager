import React from 'react'
import styled from 'styled-components'


const TableDiv = styled.div`
  height: 40vh;
  width: 100%;
  overflow: auto;
  margin: 0;
  background-color: #fcfafa;
  
  @media (max-width: 749px) {
    height: 30vh;
  }
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
  if(cryptoAssetList && cryptoAssetList.length > 0) {
    const titleKeys = Object.getOwnPropertyNames(cryptoAssetList[0])
    return (
      <TableDiv>
        <Table>
          <thead>
            <Tr>
              { titles ?
              titles.map(title => {
                  return (
                    <Th key={ title }>{ title }</Th>
                  )
                }) : null
              } 
            </Tr>
          </thead>
          <tbody>
              { cryptoAssetList ?
                cryptoAssetList.map(cryptoAsset => {
                  return ( 
                    <Tr key={ cryptoAsset.ticker }>
                      { 
                        titleKeys.map((property, i) => { 
                          return <Td key={ cryptoAsset.ticker + i }>{ cryptoAsset[property] }</Td> 
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
  return <div></div>
}

export default portfolioTable