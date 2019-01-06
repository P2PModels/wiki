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
      const onUpdated = () => this.setState({editing: false})
      this.props.app.edit(hex).subscribe(onUpdated)
    })
  }
  render () {
    const shouldHide = (editing) => (editing?{display:'none'}:{})
    return (
      <AppContainer>
        <div>
          <div style={shouldHide(this.state.editing)}>
            <ObservedViewPanel observable={this.props.observable} callback={this.onClick} />
          </div>
          <div style={shouldHide(!this.state.editing)}>
            <ObservedEditPanel editing={this.state.editing} observable={this.props.observable} handleSubmit={this.onSave} />
          </div>
        </div>
      </AppContainer>
    )
  }
}

class EditPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {...props};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (this.state.text === this.props.text)
      this.setState({...newProps})
  }

  handleChange(event) {
    this.setState({text: event.target.value});
  }

  handleSubmit(event) {
    this.props.handleSubmit(this.state.text);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input type="submit" value="Save" />
        <div>
          <textarea value={this.state.text} onChange={this.handleChange} />
        </div>
      </form>
    );
  }
}

const obs = observe((state$) => state$, {hash: 'no hash', text: 'no text'})

const ObservedViewPanel = obs(
    ({hash, text, callback}) =>
    <Card width="100%" height="100%">
      <button onClick={callback}>Edit</button>
      <Text.Block>{hash}</Text.Block>
      <div dangerouslySetInnerHTML={{ __html: markdown.toHTML(text) }}></div>
    </Card>
  )

const ObservedEditPanel = obs(EditPanel)
