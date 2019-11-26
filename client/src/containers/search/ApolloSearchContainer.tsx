import Fdc3Context from 'containers/fdc3/fdc3-context'
import React, { useContext, useEffect, useState } from 'react'
import { RouteComponentProps } from 'react-router'
import { withRouter } from 'react-router-dom'
import {
  MarketSegment,
  search as SimpleSearchQuery,
  search_symbols,
  searchQuery,
  searchQueryVariables,
  searchVariables,
} from '../../__generated__/types'
import apolloClient from '../../apollo/client'
import { AppQuery } from '../../common/AppQuery'
import { IApolloContainerProps } from '../../common/IApolloContainerProps'
import OpenfinService from '../../openfin/OpenfinService'
import { SearchInput } from './components'
import SearchConnection from './graphql/SearchConnection.graphql'
import SimpleSearchConnection from './graphql/SimpleSearchConnection.graphql'

interface IProps extends IApolloContainerProps {
  url?: string
  market: MarketSegment
}

type Props = RouteComponentProps & IProps

const ApolloSearchContainer: React.FunctionComponent<Props> = ({ id, history, url, market }: Props) => {
  const [currentSymbol, setCurrentSymbol] = useState<search_symbols | null>(null)
  const [currentText, setCurrentText] = useState<string>('')

  const currencyPairContext = useContext(Fdc3Context)
  const hasCurrencyPairContext = currencyPairContext && currencyPairContext.market === 'CURRENCY'
  const instrumentId = hasCurrencyPairContext ? currencyPairContext.name : id

  const placeholderTest = {
    crypto: 'Enter a crypto currency or ticket symbol...',
    currency: 'Enter a currency pair...',
    stock: 'Enter a stock or symbol...',
  }

  useEffect(() => {
    if (instrumentId) {
      apolloClient
        .query<searchQuery, searchQueryVariables>({
          query: SearchConnection,
          variables: { id: instrumentId, market },
        })
        .then((result: any) => {
          if (result.data && result.data.symbol) {
            setCurrentSymbol({
              __typename: 'SearchResult',
              id: result.data.symbol.id,
              name: result.data.symbol.name,
            } as search_symbols)

            if (hasCurrencyPairContext) {
              history.replace(`/${url}/${result.data.symbol.id}`)
              OpenfinService.NavigateToStock(result.data.symbol.id)
            }
          }
        })
    } else {
      setCurrentSymbol(null)
    }
  }, [instrumentId, market, url, hasCurrencyPairContext, history])

  const onTextChange = (text: string) => {
    setCurrentText(text)
  }

  const handleChange = (symbol: search_symbols | null) => {
    setCurrentSymbol(symbol)
    if (symbol) {
      history.push(`/${url}/${symbol.id}`)
      OpenfinService.NavigateToStock(symbol.id)
    } else {
      history.push(`/${url}`)
    }
  }

  const onSearchInputResults = ({ symbols }: SimpleSearchQuery): JSX.Element => {
    return (
      <SearchInput
        initialItem={currentSymbol ? currentSymbol : null}
        items={symbols}
        onChange={handleChange}
        onTextChange={onTextChange}
        placeholder={placeholderTest[market.toLowerCase()]}
      />
    )
  }

  return (
    <AppQuery<SimpleSearchQuery, searchVariables>
      query={SimpleSearchConnection}
      variables={{ text: currentText, marketSegment: market.toUpperCase() as MarketSegment }}
    >
      {onSearchInputResults}
    </AppQuery>
  )
}

export default withRouter(ApolloSearchContainer)