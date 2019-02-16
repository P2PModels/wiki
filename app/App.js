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
import { get, save, strToHex } from './ipfs-util'
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
      app.create(strToHex(title), hex).subscribe(onSaved)
    })
  }

  handleEdit(text) {
    if (text === false) {
      this.setState({ editing: false })
      return
    }
    const { app } = this.props
    save(text).then(hex => {
      const onUpdated = () => this.setState({ editing: false })
      app.edit(strToHex(this.state.page), hex).subscribe(onUpdated)
    })
  }

  handleRemove(page) {
    const { app } = this.props
    app.remove(strToHex(page)).subscribe(() => {
      if (page === this.state.page) {
        this.setState({ page: 'Main' })
      }
    })
  }

  getHash(props, state) {
    const { pages } = props
    return pages[state.page]
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
    const hash = pages[page]
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
                    page={page}
                    hash={hash}
                    text={text}
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

const ViewPanel = ({ page, hash, text = '', handleSwitch }) => (
  <div>
    <Title>View {page} Page</Title>
    <Button mode="strong" onClick={handleSwitch}>
      Edit
    </Button>
    <Card width="100%">
      <ResetStyle dangerouslySetInnerHTML={{ __html: markdown.toHTML(text) }} />
    </Card>
    <Text.Block>{hash}</Text.Block>
  </div>
)

export default observe(
  observable =>
    observable.map(state => {
      return state
    }),
  { pages: { Main: null } }
)(App)
