import React from 'react'
import {
  AragonApp,
  Button,
  Text,
  TextInput,
  Card,

  observe
} from '@aragon/ui'
import Aragon, { providers } from '@aragon/client'
import styled from 'styled-components'
import { Observable } from 'rxjs'
import {markdown} from 'markdown';
import {save as ipfsSave} from './ipfs-util';

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
  onSave(text) {
    ipfsSave(text).then(hex => {
      this.props.app.edit(hex)
      this.setState({ editing: false });
    })
  }
  render () {
    return (
      <AppContainer>
        <div>
          { !this.state.editing ?
            <ViewPanel observable={this.props.observable} callback={this.onClick} />
          :
            <ObservedEditPanel observable={this.props.observable} callback={this.onSave} />
          }
        </div>
      </AppContainer>
    )
  }
}

const ViewPanel = observe(
    (state$) => state$,
    {hash: 'no hash', text: 'no text'}
  )(
    ({hash, text, callback}) =>
    <Card width="100%" height="100%">
      <button onClick={callback}>Edit</button>
      <Text.Block>{hash}</Text.Block>
      <div dangerouslySetInnerHTML={{ __html: markdown.toHTML(text) }}></div>
    </Card>
  )

class EditPanel extends React.Component {
  constructor(props) {
    super(props);
    console.log(props)
    this.state = {...props};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({text: event.target.value});
  }

  handleSubmit(event) {
    this.props.callback(this.state.text);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input type="submit" value="Save" />
        <div>
          <TextInput wide value={this.state.text} onChange={this.handleChange} />
        </div>
      </form>
    );
  }
}

const ObservedEditPanel = observe(
    (state$) => state$,
    {hash: 'no hash', text: 'no text'}
  )(EditPanel)
