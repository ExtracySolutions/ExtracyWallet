import React, { FC, useCallback, useEffect } from 'react'

import { Container } from '@components'
import { useAppSelector, useAppDispatch } from '@hooks'
import { createSelector } from '@reduxjs/toolkit'
import { makeStyles } from '@themes'
import { Dimensions, View } from 'react-native'
import { captureScreen } from 'react-native-view-shot'
import { HOMEPAGE_URL } from 'ultils'

import { NetworkType } from '../@extracy-wallet-controller'
import { updateTab, toggleShowTabs, createNewTab } from '../../reduxs/reducers'
import { RootState } from '../../reduxs/store'
import { MemoizedBrowserTab } from '../BrowserTab'
import { TabsView } from './TabsView'

const { height, width } = Dimensions.get('screen')

//=======Selector========//

const selectTheme = (state: RootState) => state.theme.theme
const selectTabs = (state: RootState) => state.browser.tabs
const selectActiveTab = (state: RootState) => state.browser.activeTabId
const selectShowTab = (state: RootState) => state.browser.showTab
const selectIsTakePhoto = (state: RootState) => state.browser.isTakePhoto
const selectAccountIndex = (state: RootState) =>
  state.engine.backgroundState.PreferencesController?.selectedAccountIndex

const browserSelector = createSelector(
  [
    selectTheme,
    selectTabs,
    selectActiveTab,
    selectShowTab,
    selectIsTakePhoto,
    selectAccountIndex,
  ],
  (theme, tabs, activeTabId, showTab, isTakePhoto, selectedAccountIndex) => {
    return {
      theme,
      tabs,
      activeTabId,
      showTab,
      isTakePhoto,
      selectedAccountIndex,
    }
  },
)

const THUMB_WIDTH = width / 2 - 40
const THUMB_HEIGHT = height / 3 - 40

export type BrowserProps = {}

const Browser: FC<BrowserProps> = (props) => {
  const {
    theme: themeStore,
    tabs,
    showTab,
    activeTabId,
    isTakePhoto,
    selectedAccountIndex,
  } = useAppSelector((state) => browserSelector(state.root))

  const styles = useStyles(props, themeStore)
  const dispatch = useAppDispatch()

  const takeScreenshot = useCallback(
    async (url: string, tabID: number) => {
      return new Promise((resolve, reject) => {
        captureScreen({
          format: 'jpg',
          quality: 0.2,
          width: THUMB_WIDTH,
          height: THUMB_HEIGHT,
        })
          .then((uri) => {
            dispatch(
              updateTab({
                id: tabID,
                url,
                image: uri,
              }),
            )
            resolve(true)
          })
          .catch((error) => reject(error))
      })
    },
    [dispatch],
  )

  const showTabs = useCallback(async () => {
    try {
      const activeTab = tabs.find((tab) => tab.id === activeTabId)
      activeTab && (await takeScreenshot(activeTab.url || '', activeTab.id))

      dispatch(toggleShowTabs(true))
    } catch (error) {
      console.log('[takeScreenshot error]', error)
    }
  }, [activeTabId, dispatch, tabs, takeScreenshot])

  const updateTabBrowser = useCallback(
    async ({ tabID, url }: { tabID: number; url: string }) => {
      if (isTakePhoto === true && activeTabId === tabID) {
        await takeScreenshot(url, tabID)
      }
    },
    [activeTabId, isTakePhoto, takeScreenshot],
  )

  const renderBrowserTabs = useCallback(() => {
    return tabs.map((tab) => {
      return (
        <MemoizedBrowserTab
          key={`${tab.id}`}
          tabID={tab.id}
          initialURL={tab.url || ''}
          incognito={tab.incognito}
          showTabs={showTabs}
          updateTabBrowser={updateTabBrowser}
        />
      )
    })
  }, [showTabs, tabs, updateTabBrowser])

  useEffect(() => {
    // if have no tabs => open default url
    if (tabs.length === 0) {
      dispatch(
        createNewTab({
          url: HOMEPAGE_URL,
          networkID: 'ethereum',
          networkType: NetworkType.ERC20,
          accountIndex: selectedAccountIndex ?? 0,
        }),
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabs])

  const renderTabsView = useCallback(() => {
    if (showTab) {
      return (
        <Container edges={['right', 'left']} style={styles.container}>
          <TabsView tabs={tabs} />
        </Container>
      )
    }
    return null
  }, [showTab, styles.container, tabs])

  return (
    <View style={styles.root}>
      {renderBrowserTabs()}
      {renderTabsView()}
    </View>
  )
}

function propsAreEqual() {
  return true
}

export const MemoizedBrowser = React.memo(Browser, propsAreEqual)

const useStyles = makeStyles()(() => ({
  root: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
  },
}))
