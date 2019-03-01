import React from 'react'
import { AppView, BaseStyles, observe } from '@aragon/ui'
import { Main, TwoPanels } from './components/ui-components'
import PageList from './components/page-list'
import EditPanel from './components/edit-panel'
import { ViewPanel } from './components/view-panel'
import { utf8ToHex } from 'web3-utils'
import { get, save } from './lib/ipfs-util'
import makeCancelable from 'makecancelable'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      mode: 'view',
      page: 'Welcome',
    }
    this.handleCreate = this.handleCreate.bind(this)
    this.handlePageChange = this.handlePageChange.bind(this)
    this.handleEdit = this.handleEdit.bind(this)
    this.handleRemove = this.handleRemove.bind(this)
    this.handleProtect = this.handleProtect.bind(this)
  }

  handlePageChange(page) {
    this.setState({ page, mode: 'view' })
  }

  handleCreate(page, text) {
    if (page === true || page === false) {
      this.setState({ mode: page ? 'create' : 'view' })
      return
    }
    const { app } = this.props
    save(page, text).then(hex => {
      const onSaved = () => this.setState({ page: page, mode: 'view' })
      app.create(utf8ToHex(page), hex).subscribe(onSaved)
    })
  }

  handleEdit(page, text) {
    if (page === true || page === false) {
      this.setState({ mode: page ? 'edit' : 'view' })
      return
    }
    console.log(page, this.props)
    const {
      app,
      pages: { [page]: value },
    } = this.props
    const isProtected = value ? value.isProtected : false
    save(page, text).then(hex => {
      const onUpdated = () => this.setState({ mode: 'view' })
      isProtected
        ? app.editProtected(utf8ToHex(page), hex).subscribe(onUpdated)
        : app.edit(utf8ToHex(page), hex).subscribe(onUpdated)
    })
  }

  handleRemove(page) {
    const { app } = this.props
    app.remove(utf8ToHex(page)).subscribe(() => {
      if (page === this.state.page) {
        this.setState({ page: 'Main' })
      }
    })
  }

  handleProtect(page, protect) {
    const { app } = this.props
    const pageHex = utf8ToHex(page)
    if (protect) {
      app.protect(pageHex)
    } else {
      app.unprotect(pageHex)
    }
  }

  getHash(props, state) {
    const { pages } = props
    const page = pages[state.page]
    return page ? page.hash : null
  }

  componentDidUpdate(prevProps, prevState) {
    const hash = this.getHash(this.props, this.state)
    const prevHash = this.getHash(prevProps, prevState)
    if (hash && hash !== prevHash) {
      // https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html
      this.cancelIPFS = makeCancelable(get(hash), text => {
        console.log(text)
        this.setState({ text })
      })
    }
  }

  componentWillUnmount() {
    if (this.cancelIPFS) this.cancelIPFS()
  }

  render() {
    const { mode, page, text } = this.state
    const { pages } = this.props
    const { hash, isProtected } = pages[page]
      ? pages[page]
      : { hash: null, isProtected: false }
    return (
      <div>
        <BaseStyles />
        <AppView title="DAO Wiki">
          <TwoPanels>
            <Main>
              {mode === 'view' ? (
                <ViewPanel
                  handleEdit={() => this.handleEdit(true)}
                  handleProtect={this.handleProtect}
                  handleRemove={this.handleRemove}
                  page={page}
                  hash={hash}
                  text={text}
                  isProtected={isProtected}
                />
              ) : (
                <EditPanel
                  page={page}
                  text={text}
                  mode={mode}
                  handleSubmit={
                    mode === 'edit' ? this.handleEdit : this.handleCreate
                  }
                />
              )}
            </Main>
            <PageList
              create={() => this.handleCreate(true)}
              change={this.handlePageChange}
              pages={pages}
              selectedPage={page}
            />
          </TwoPanels>
        </AppView>
      </div>
    )
  }
}

export default observe(
  observable =>
    observable.map(state => {
      return state
    }),
  { pages: {} }
)(App)
