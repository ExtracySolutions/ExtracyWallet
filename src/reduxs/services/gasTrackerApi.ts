import {
  createApi,
  fetchBaseQuery,
  FetchBaseQueryMeta,
} from '@reduxjs/toolkit/query/react'

import { OWLRACE_BASE_URL } from './endpoint'

export type GasSpeed = {
  acceptance: string
  gasPrice: string
  estimatedFee: string
}

export type GasTrackerResult = {
  speeds: GasSpeed[]
}

export const GasTrackerApi = createApi({
  reducerPath: 'GasTracker',
  baseQuery: fetchBaseQuery({ baseUrl: OWLRACE_BASE_URL }),
  endpoints: (builder) => ({
    gasTracker: builder.query<GasTrackerResult, string>({
      query: (network) => `/${network}/gas?apikey=YOUR_API_KEY`,
      transformResponse: (
        baseQueryReturnValue: any,
      ): GasTrackerResult | Promise<GasTrackerResult> => {
        // remove firts item

        baseQueryReturnValue.speeds.shift()

        const gasTrackerResult: GasTrackerResult = {
          speeds: [...baseQueryReturnValue.speeds],
        }
        return gasTrackerResult
      },
    }),
  }),
})

export const { useGasTrackerQuery, useLazyGasTrackerQuery } = GasTrackerApi
