import React from 'react'

import { Button, Card, TextInput } from '@aragon/ui'
import { Textarea } from './ui-components'
import styled from 'styled-components'

class EditPanel extends React.Component {
  constructor(props) {
    super(props)
    if (props.mode === 'create') {
      this.state = { ...props, page: '', text: '' }
    } else {
      this.state = { ...props }
    }
  }

  componentWillReceiveProps(newProps) {
    this.setState({ ...newProps })
  }

  render() {
    const { text, page } = this.state
    const { handleSubmit, mode } = this.props
    return (
      <Main>
        <Card className="padded" width="100%" height="100%">
          <form onSubmit={e => e.preventDefault()}>
            <TextInput
              value={page}
              onChange={e => this.setState({ page: e.target.value })}
              disabled={mode === 'edit'}
              placeholder={mode === 'create' ? 'New Page' : ''}
              autoFocus={mode === 'create'}
              wide
            />
            <Textarea
              value={text}
              onChange={e => this.setState({ text: e.target.value })}
              autoFocus={mode === 'edit'}
            />
            <Buttons>
              <Button mode="strong" onClick={e => handleSubmit(page, text)}>
                Save
              </Button>
              <Button
                type="button"
                mode="outline"
                onClick={e => handleSubmit(false)}
              >
                Cancel
              </Button>
            </Buttons>
          </form>
        </Card>
      </Main>
    )
  }
}

const Main = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  .padded {
    padding: 34px;
    flex-grow: 1;
  }
  form {
    height: 100%;
    display: flex;
    flex-direction: column;
    input[type='text'] {
      font-size: 2em;
      margin-bottom: 5px;
    }
    textarea {
      flex-grow: 1;
    }
  }
`
const Buttons = styled.div`
  margin-top: 8px;
  button {
    float: right;
    margin-left: 5px;
  }
`

export default EditPanel
