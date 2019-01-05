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
import {Buffer} from 'buffer';
import Multihashes from 'multihashes';

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
    ipfs.add(Buffer.from(Math.random()+"", "utf-8"))
    .then(value => {
      console.log("http://localhost:8080/ipfs/"+value[0].hash)
      let hex = ipfsToHex(value[0].hash)
      this.props.app.edit(hex)
    })
    this.setState({ editing: false });
  }
  render () {
    return (
      <AppContainer>
        <div>
          <ObservedHash observable={this.props.observable} />
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

function ipfsToHex(ipfsHash) {
  let buf = Multihashes.fromB58String(ipfsHash);
  let dig = Multihashes.decode(buf).digest;
  let hex = '0x' + Multihashes.toHexString(dig);
  return hex;
}

function hexToIpfs(hex) {
  let dig = Multihashes.fromHexString(hex.substring(2));
  let buf = Multihashes.encode(dig, 'sha2-256');
  let ipfsHash = Multihashes.toB58String(buf);
  return ipfsHash;
}

const ObservedX = observe(
  (state$) => state$,
  { hash: null, text: "" }
)

const ObservedText = ObservedX (
  // FIXME: Sanitize or use an iframe to make it safe
  ({ text }) => <div dangerouslySetInnerHTML={{ __html: markdown.toHTML(text) }}></div>
)

const ObservedTextarea = ObservedX (
  ({ text }) => <textarea style={{"width":"60vw","height":"40vh"}} id="editTextarea" value={text} onChange={(event)=>text = event.target.value}></textarea>
)

const ObservedHash = ObservedX(
  ({ hash }) => <Text.Block style={{ textAlign: 'right' }} size='large'>{hash}</Text.Block>
)
