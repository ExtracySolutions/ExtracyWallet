import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { COINGECKO_BASE_URL } from './endpoint'

export type PriceTokenResult = {
  coingecko_id: string
  usd: number
  include_market_cap: number
  usd_24h_vol: number
  usd_24h_change: number
}

export const PriceTokenApi = createApi({
  reducerPath: 'priceTokenApi',
  baseQuery: fetchBaseQuery({ baseUrl: COINGECKO_BASE_URL }),
  endpoints: (builder) => ({
    priceTokens: builder.query<PriceTokenResult[], string>({
      query: (ids) =>
        `/simple/price?vs_currencies=usd&ids=${ids}&include_24hr_change=true`,
    }),
  }),
})
export const { usePriceTokensQuery } = PriceTokenApi
