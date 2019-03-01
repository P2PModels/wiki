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
      editing: false,
      page: 'Main',
      text: defaultText,
    }
    this.handleSwitch = this.handleSwitch.bind(this)
    this.handleCreate = this.handleCreate.bind(this)
    this.handlePageChange = this.handlePageChange.bind(this)
    this.handleEdit = this.handleEdit.bind(this)
    this.handleRemove = this.handleRemove.bind(this)
    this.handleProtect = this.handleProtect.bind(this)
  }

  handleSwitch() {
    this.setState({ editing: !this.state.editing })
  }

  handlePageChange(page) {
    this.setState({ page })
  }

  handleCreate() {
    const { app } = this.props
    const title = 'Test'
    const text = 'This is a test page.'
    save(text).then(hex => {
      const onSaved = () => this.setState({ page: title })
      app.create(utf8ToHex(title), hex).subscribe(onSaved)
    })
  }

  handleEdit(text) {
    if (text === false) {
      this.setState({ editing: false })
      return
    }
    const { page } = this.state
    const {
      app,
      pages: {
        [page]: { isProtected },
      },
    } = this.props
    save(text).then(hex => {
      const onUpdated = () => this.setState({ editing: false })
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
    return pages[state.page].hash
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
    const { editing, page, text } = this.state
    const { pages } = this.props
    const { hash, isProtected } = pages[page]
    return (
      <div>
        <BaseStyles />
        <AppView title="DAO Wiki">
          <TwoPanels>
            <Main>
              {!editing ? (
                <ViewPanel
                  handleSwitch={this.handleSwitch}
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
                  handleEdit={this.handleEdit}
                />
              )}
            </Main>
            <PageList
              create={this.handleCreate}
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

const defaultText = `
## This is a DAO wiki

This is a censorship resistant wiki, that stores the content on IPFS and saves
its state on the blockchain. If you are a token holder, you can edit it.
`

export default observe(
  observable =>
    observable.map(state => {
      return state
    }),
  { pages: { Main: { hash: null } } }
)(App)
