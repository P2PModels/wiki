import React from 'react'
import {
  AragonApp,
  Button,
  Text,
  Card,
  AppView,
  BaseStyles,
  observe,
} from '@aragon/ui'
import {
  SpacedBlock,
  Title,
  Main,
  TwoPanels,
  SideBar,
  Textarea,
  ResetStyle,
} from './ui-components'
import { markdown } from 'markdown'
import { utf8ToHex } from 'web3-utils'
import { get, save } from './ipfs-util'
import makeCancelable from 'makecancelable'

// Alternative: <iframe src="https://ipfs.io/ipfs/QmSrCRJmzE4zE1nAfWPbzVfanKQNBhp7ZWmMnEdbiLvYNh/mdown#sample.md" />

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
      <AragonApp>
        <BaseStyles />
        <AppView title="DAO Wiki">
          <TwoPanels>
            <Main>
              <SpacedBlock>
                {!editing ? (
                  <ViewPanel
                    handleSwitch={this.handleSwitch}
                    handleProtect={this.handleProtect}
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
              </SpacedBlock>
            </Main>
            <SideBar>
              <h2>Pages</h2>
              <PageList
                create={this.handleCreate}
                change={this.handlePageChange}
                remove={this.handleRemove}
                pages={pages}
                selectedPage={page}
              />
            </SideBar>
          </TwoPanels>
        </AppView>
      </AragonApp>
    )
  }
}

class EditPanel extends React.Component {
  constructor(props) {
    super(props)
    this.state = { ...props }
  }

  componentWillReceiveProps(newProps) {
    this.setState({ ...newProps })
  }

  render() {
    const { text } = this.state
    const { handleEdit, page } = this.props
    return (
      <div>
        <Title>Edit {page} Page</Title>
        <form onSubmit={e => e.preventDefault()}>
          <Button mode="strong" onClick={e => handleEdit(text)}>
            Save
          </Button>
          <Button type="button" onClick={e => handleEdit(false)}>
            Cancel
          </Button>
          <Card width="100%">
            <Textarea
              value={text}
              onChange={e => this.setState({ text: e.target.value })}
            />
          </Card>
        </form>
      </div>
    )
  }
}

const defaultText = `
# This is a DAO wiki

This is a censorship resistant wiki, that stores the content on IPFS and saves
its state on the blockchain. If you are a token holder, you can edit it.
`

const PageList = ({ pages, selectedPage = 'Main', create, change, remove }) => (
  <div>
    <ul>
      {Object.keys(pages).map(page => (
        <li onClick={e => change(page)} key={page}>
          {selectedPage === page ? <strong>{page}</strong> : page}
          {page !== 'Main' && (
            <Button
              onClick={e => {
                remove(page)
                e.stopPropagation()
              }}
            >
              x
            </Button>
          )}
        </li>
      ))}
    </ul>
    <Button mode="strong" onClick={create}>
      Create
    </Button>
  </div>
)

const ViewPanel = ({
  page,
  hash,
  isProtected,
  text = '',
  handleSwitch,
  handleProtect,
}) => (
  <div>
    <Title>View {page} Page</Title>
    <Button mode="strong" onClick={handleSwitch}>
      Edit
    </Button>
    <ProtectButton
      page={page}
      isProtected={isProtected}
      handleProtect={handleProtect}
    />
    <Card width="100%">
      <ResetStyle dangerouslySetInnerHTML={{ __html: markdown.toHTML(text) }} />
    </Card>
    <Text.Block>{hash}</Text.Block>
  </div>
)

const ProtectButton = ({ page, isProtected = false, handleProtect }) =>
  !isProtected ? (
    <Button onClick={e => handleProtect(page, true)}>Protect</Button>
  ) : (
    <Button onClick={e => handleProtect(page, false)}>Unprotect</Button>
  )

export default observe(
  observable =>
    observable.map(state => {
      return state
    }),
  { pages: { Main: { hash: null } } }
)(App)
