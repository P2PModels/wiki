import React from 'react'
import {
  AragonApp,
  Button,
  Text,
  Card,

  observe
} from '@aragon/ui'
import Aragon, { providers } from '@aragon/client'
import styled from 'styled-components'
import { Observable } from 'rxjs'
import {markdown} from 'markdown';

import ipfsAPI from 'ipfs-api'
var ipfs = ipfsAPI('localhost', '5001', {protocol: 'http'})

const AppContainer = styled(AragonApp)`
  display: flex;
  align-items: center;
  justify-content: center;
`
// Alternative: <iframe src="https://ipfs.io/ipfs/QmSrCRJmzE4zE1nAfWPbzVfanKQNBhp7ZWmMnEdbiLvYNh/mdown#sample.md" />

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: false,
    }
    this.onClick = this.onClick.bind(this);
    this.onSave = this.onSave.bind(this);
  }
  onClick() {
    this.setState({ editing: !this.state.editing });
  }
  onSave() {
    this.setState({ editing: false });
  }
  render () {
    return (
      <AppContainer>
        <div>
          {
            this.state.editing ?
              <span>
                <Button onClick={this.onSave}>Save</Button>
                <Button onClick={this.onClick}>Cancel</Button>
              </span>
            :
            <Button onClick={this.onClick}>Edit</Button>
          }
          <Card width="100%" height="100%">
            {
              this.state.editing ?
              <ObservedTextarea observable={this.props.observable} />
              :
              <ObservedText observable={this.props.observable} />
            }
          </Card>
          <Button onClick={() => this.props.app.decrement(1)}>Decrement</Button>
        </div>
      </AppContainer>
    )
  }
}

function getText(hash){
  return Observable.fromPromise(new Promise((resolve, reject) => {
    ipfs.get(hash).then(o => resolve({text: o[0].content.toString('utf8')}))
  }))
}

const ObservedX = observe(
  observable => getText('/ipfs/QmYhjFtSfCqdoc8bsNrbbZUw8LEaKu3CnsNeRcqMQJbRWU'),
  { text: 'hello world' }
)

const ObservedText = ObservedX (
  // FIXME: Sanitize or use an iframe to make it safe
  ({ text }) => <div dangerouslySetInnerHTML={{ __html: markdown.toHTML(text) }}></div>
)

const ObservedTextarea = ObservedX (
  ({ text }) => <textarea style={{"width":"60vw","height":"40vh"}} value={text} onChange={(event)=>text = event.target.value}></textarea>
)
