import React, { FC } from 'react'

import { ManagerTabsAction, Container, Header } from '@components'
import { useAppSelector } from '@hooks'
import { FilterToken, SelectedNetwork } from '@screens'
import { makeStyles } from '@themes'
import { View } from 'react-native'

export type FilterProps = {}

type Tab = {
  name: string
  label: string
  component: React.ComponentType
}

export const Filter: FC<FilterProps> = (props) => {
  const themeStore = useAppSelector((state) => state.root.theme.theme)
  const styles = useStyles(props, themeStore)

  const TabArr: Tab[] = [
    {
      name: 'filter',
      label: 'NETWORK',
      component: SelectedNetwork,
    },
    {
      name: 'token',
      label: 'TOKEN',
      component: FilterToken,
    },
  ]
  return (
    <Container edges={['right', 'left', 'bottom']} style={styles.root}>
      <Header title={'Filter'} />
      <View style={styles.body}>
        <ManagerTabsAction TabArr={TabArr} />
      </View>
    </Container>
  )
}

const useStyles = makeStyles<FilterProps>()(({ normalize }) => ({
  root: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: normalize(10)('moderate'),
  },
  body: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 6,
  },
}))
