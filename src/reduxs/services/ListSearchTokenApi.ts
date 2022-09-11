import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { itemTokenResult } from 'screens/AddToken/type'

import { GET_LIST_SEARCH_TOKEN } from './endpoint'

export const ListSearchTokenApi = createApi({
  reducerPath: 'listSearchTokenApi',
  baseQuery: fetchBaseQuery({ baseUrl: GET_LIST_SEARCH_TOKEN }),
  endpoints: (builder) => ({
    getListTokenFromServer: builder.query<itemTokenResult[], void>({
      query: () => {
        return `YOUR_URL`
      },
      transformResponse: (response: any) => response?.items,
    }),
  }),
})
export const { useGetListTokenFromServerQuery } = ListSearchTokenApi
