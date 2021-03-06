import React from 'react'
import styled from 'styled-components'


const TableDiv = styled.div`
  height: 40vh;
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

const transactionTable = ({ buy_order_config, sell_order_config, pl_transaction_config }) => {
  const config = buy_order_config || sell_order_config || pl_transaction_config
  if (config.list && config.list[0]) {
    var keys = Object.getOwnPropertyNames(config.list[0])
  }

  return (
    <TableDiv>
      <Table>
        <thead>
          <Tr>
            { config.titles ?
              config.titles.map(title => {
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
          { config.list && config.list[0]
            ?
            config.list.map(item => {
              return (
                <Tr>
                  {
                    keys.map(property => {
                      return <Td>{ item[property] }</Td>
                    })
                  }
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