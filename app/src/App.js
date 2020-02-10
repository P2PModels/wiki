import React, { useState, useEffect } from 'react'
import { Main, Button } from '@aragon/ui'
import PageList from './components/page-list'
import EditPanel from './components/edit-panel'
import ViewPanel from './components/view-panel'
import { utf8ToHex } from 'web3-utils'
import { get, save } from './lib/ipfs-util'
import makeCancelable from 'makecancelable'
import { useAragonApi, useGuiStyle } from '@aragon/api-react'
import styled from 'styled-components'
import AppHeader from './components/AppHeader'

function App() {
  const { api, appState } = useAragonApi()
  const { appearance } = useGuiStyle()
  const { pages, isSyncing } = appState

  const [mode, setMode] = useState('view')
  const [currentPage, setPage] = useState('Welcome')
  const [text, setText] = useState('')

  const [isFinal, setFinal] = useState(false)

  const { hash, isProtected } = pages[currentPage] || {
    hash: null,
    isProtected: false,
  }

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
      api.protect(pageHex).toPromise()
    } else {
      api.unprotect(pageHex).toPromise()
    }
  }

  useEffect(() => {
    if (hash && isFinal)
      return makeCancelable(get(hash), text => {
        console.log(text)
        setText(text)
      })
  }, [hash, isFinal])

  // TODO Something better than a timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setFinal(true)
    }, 800)
    return () => {
      clearTimeout(timer)
    }
  }, [hash])

  return (
    <Main theme={appearance} assetsUrl="./aragon-ui">
      <>
        <AppHeader
          heading="Wiki"
          action1={
            Object.keys(pages).length > 0 && (
              <Button
                mode="strong"
                label="Create page"
                onClick={() => handleCreate(true)}
              />
            )
          }
        />
        <Wrapper>
          <div css="min-width: 75%">
            {mode === 'view' ? (
              <ViewPanel
                handleEdit={() => handleEdit(true)}
                handleProtect={handleProtect}
                handleRemove={() => handleRemove(currentPage)}
                page={currentPage}
                hash={hash}
                syncing={isSyncing || !isFinal}
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
          </div>
          <div css="max-width: 25%; margin-left: 1rem;">
            <PageList
              change={handlePageChange}
              pages={pages}
              selectedPage={currentPage}
            />
          </div>
        </Wrapper>
      </>
    </Main>
  )
}

const Wrapper = styled.div`
  display: flex;
`

export default App
