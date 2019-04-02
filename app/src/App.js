import React, { useState, useEffect } from 'react'
import { AppView, BaseStyles } from '@aragon/ui'
import { Main, TwoPanels } from './components/ui-components'
import PageList from './components/page-list'
import EditPanel from './components/edit-panel'
import { ViewPanel } from './components/view-panel'
import IpfsIsConnected from './components/ipfs'
import { utf8ToHex } from 'web3-utils'
import { get, save } from './lib/ipfs-util'
import makeCancelable from 'makecancelable'
import { useAragonApi } from '@aragon/api-react'

function App() {
  const { api, appState } = useAragonApi()
  const { pages } = appState
  const [mode, setMode] = useState('view')
  const [currentPage, setPage] = useState('Welcome')
  const [text, setText] = useState('')
  const [syncing, setSyncing] = useState(true)
  const { hash, isProtected } = pages[currentPage]
    ? pages[currentPage]
    : { hash: null, isProtected: false }

  const handlePageChange = page => {
    setPage(page)
    setMode('view')
  }

  const handleCreate = (page, text) => {
    if (page === true || page === false) {
      setMode(page ? 'create' : 'view')
      return
    }
    save(page, text).then(hex => {
      const onSaved = () => {
        setPage(page)
        setMode('view')
      }
      api.create(utf8ToHex(page), hex).subscribe(onSaved)
    })
  }

  const handleEdit = (page, text) => {
    if (page === true || page === false) {
      setMode(page ? 'edit' : 'view')
      return
    }
    const {
      pages: { [page]: value },
    } = appState
    const isProtected = value && value.isProtected
    save(page, text).then(hex => {
      const onUpdated = () => setMode('view')
      isProtected
        ? api.editProtected(utf8ToHex(page), hex).subscribe(onUpdated)
        : api.edit(utf8ToHex(page), hex).subscribe(onUpdated)
    })
  }

  const handleRemove = page => {
    api.remove(utf8ToHex(page)).subscribe(() => {
      if (page === currentPage) {
        setPage('Welcome')
      }
    })
  }

  const handleProtect = (page, protect) => {
    const pageHex = utf8ToHex(page)
    if (protect) {
      api.protect(pageHex)
    } else {
      api.unprotect(pageHex)
    }
  }

  useEffect(() => {
    if (hash)
      return makeCancelable(get(hash), text => {
        console.log(text)
        setText(text)
      })
  }, [hash])

  // TODO Something better than a timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setSyncing(false)
    }, 400)
    return () => {
      clearTimeout(timer)
    }
  }, [hash])

  return (
    <div>
      <BaseStyles />
      <AppView title="DAO Wiki">
        <TwoPanels>
          <Main>
            {mode === 'view' ? (
              <ViewPanel
                handleEdit={() => handleEdit(true)}
                handleProtect={handleProtect}
                handleRemove={() => handleRemove(currentPage)}
                page={currentPage}
                hash={hash}
                syncing={syncing}
                text={text}
                isProtected={isProtected}
              />
            ) : (
              <EditPanel
                page={currentPage}
                text={text}
                mode={mode}
                handleSubmit={mode === 'edit' ? handleEdit : handleCreate}
              />
            )}
          </Main>
          <PageList
            create={() => handleCreate(true)}
            change={handlePageChange}
            pages={pages}
            selectedPage={currentPage}
          />
        </TwoPanels>
        <IpfsIsConnected />
      </AppView>
    </div>
  )
}

export default App
