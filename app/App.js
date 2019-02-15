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
import styled from 'styled-components'
import { markdown } from 'markdown'
import { save as ipfsSave, get as ipfsGet, strToHex } from './ipfs-util'
import makeCancelable from 'makecancelable'

const AppContainer = styled(AragonApp)``
// Alternative: <iframe src="https://ipfs.io/ipfs/QmSrCRJmzE4zE1nAfWPbzVfanKQNBhp7ZWmMnEdbiLvYNh/mdown#sample.md" />

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      editing: false,
      page: 'Test',
    }
    this.onClick = this.onClick.bind(this)
    this.create = this.create.bind(this)
    this.changePage = this.changePage.bind(this)
    this.onSave = this.onSave.bind(this)
  }
  onClick() {
    this.setState({ editing: !this.state.editing })
  }
  create() {
    const title = 'Test'
    const text = 'This is a test page.'
    ipfsSave(text).then(hex => this.props.app.create(strToHex(title), hex))
  }
  changePage(page) {
    this.setState({ page })
  }
  onSave(text) {
    if (text === false) {
      this.setState({ editing: false })
      return
    }
    ipfsSave(text).then(hex => {
      const onUpdated = () => this.setState({ editing: false })
      this.props.app.edit(strToHex(this.state.page), hex).subscribe(onUpdated)
    })
  }
  render() {
    const shouldHide = editing => (editing ? { display: 'none' } : {})
    const SpacedBlock = styled.div`
      margin-top: 30px;
      &:first-child {
        margin-top: 0;
      }
    `
    const Title = styled.h1`
      margin-top: 10px;
      margin-bottom: 20px;
      font-weight: 600;
    `
    const Main = styled.div`
      width: 100%;
    `
    const TwoPanels = styled.div`
      display: flex;
      width: 100%;
      min-width: 800px;
    `
    const SideBar = styled.aside`
      flex-shrink: 0;
      flex-grow: 0;
      width: 260px;
      margin-left: 30px;
      min-height: 100%;
    `
    const { editing, page } = this.state
    const { pages } = this.props
    return (
      <AppContainer>
        <BaseStyles />
        <AppView title="DAO Wiki">
          <TwoPanels>
            <Main>
              <div style={shouldHide(editing)}>
                <SpacedBlock>
                  <Title>View Main Page</Title>
                  <ViewPanel
                    title={page}
                    callback={this.onClick}
                    pages={pages}
                  />
                </SpacedBlock>
              </div>
              <div style={shouldHide(!editing)}>
                <SpacedBlock>
                  <Title>Edit Main Page</Title>
                  <EditPanel editing={editing} handleSubmit={this.onSave} />
                </SpacedBlock>
              </div>
            </Main>
            <SideBar>
              <h2>Pages</h2>
              <PageList
                create={this.create}
                change={this.changePage}
                pages={pages}
              />
            </SideBar>
          </TwoPanels>
        </AppView>
      </AppContainer>
    )
  }
}

class EditPanel extends React.Component {
  constructor(props) {
    super(props)
    this.state = { ...props }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
  }

  componentWillReceiveProps(newProps) {
    this.setState({ ...newProps })
  }

  handleChange(event) {
    this.setState({ text: event.target.value })
  }

  handleSubmit(event) {
    this.props.handleSubmit(this.state.text)
    event.preventDefault()
  }

  handleCancel(event) {
    this.props.handleSubmit(false)
  }

  render() {
    const textareaStyle = {
      width: '100%',
      height: 'inherit',
    }
    return (
      <form onSubmit={this.handleSubmit}>
        <Button mode="strong" onClick={this.handleSubmit}>
          Save
        </Button>
        <Button type="button" onClick={this.handleCancel}>
          Cancel
        </Button>
        <Card width="100%">
          <textarea
            value={this.state.text}
            onChange={this.handleChange}
            style={textareaStyle}
          />
        </Card>
      </form>
    )
  }
}

const defaultText = `
# This is a DAO wiki

This is a censorship resistant wiki, that stores the content on IPFS and saves
its state on the blockchain. If you are a token holder, you can edit it.
`

const PageList = ({ pages, create, change }) => (
  <div>
    <ul>
      {Object.keys(pages).map(page => (
        <li onClick={e => change(page)} key={page}>
          {page}
        </li>
      ))}
    </ul>
    <Button mode="strong" onClick={create}>
      Create
    </Button>
  </div>
)

const ResetStyle = styled.div`
  font: 9pt/1.5em sans-serif;
  padding: 25px;

  pre,
  code,
  tt {
    font: 1em/1.5em 'Andale Mono', 'Lucida Console', monospace;
  }
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  b,
  strong {
    font-weight: bold;
  }
  h1 {
    font-size: 1.5em;
  }
  em,
  i,
  dfn {
    font-style: italic;
  }
  p,
  code,
  pre,
  kbd {
    margin: 0 0 1.5em 0;
  }
  blockquote {
    margin: 0 1.5em 1.5em 1.5em;
  }
  cite {
    font-style: italic;
  }
  li ul,
  li ol {
    margin: 0 1.5em;
  }
  ul,
  ol {
    margin: 0 1.5em 1.5em 1.5em;
  }
  ul {
    list-style-type: disc;
  }
  ol {
    list-style-type: decimal;
  }
  del {
    text-decoration: line-through;
  }
  pre {
    margin: 1.5em 0;
    white-space: pre;
  }
`

class ViewPanel extends React.Component {
  constructor(props) {
    super(props)
    this.state = { text: defaultText }
  }

  getHashFromProps(props) {
    const { title } = props
    return props.pages[title]
  }

  componentDidMount() {
    const hash = this.getHashFromProps(this.props)
    if (hash) {
      // https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html
      this.cancelIPFS = makeCancelable(ipfsGet(hash),
        text => {
          console.log(text)
          this.setState({ text })
        }
      )
    }
  }

  componentWillUnmount() {
    if (this.cancelIPFS)
      this.cancelIPFS();
  }

  render() {
    const { title, callback } = this.props
    const { text } = this.state
    const hash = this.getHashFromProps(this.props)
    return (
      <div>
        <h1>{title}</h1>
        <Button mode="strong" onClick={callback}>
          Edit
        </Button>
        <Card width="100%">
          <ResetStyle
            dangerouslySetInnerHTML={{ __html: markdown.toHTML(text) }}
          />
        </Card>
        <Text.Block>{hash}</Text.Block>
      </div>
    )
  }
}

export default observe(
  observable =>
    observable.map(state => {
      return state
    }),
  { pages: { Main: null } }
)(App)
