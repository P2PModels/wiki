import React from 'react'

import { Button, Card, TextInput } from '@aragon/ui'
import { Textarea } from './ui-components'
import styled from 'styled-components'

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
      <Main>
        <Card className="padded" width="100%" height="100%">
          <form onSubmit={e => e.preventDefault()}>
            <TitleTextInput value={page} onChange={f => f} disabled wide />
            <Textarea
              value={text}
              onChange={e => this.setState({ text: e.target.value })}
            />
            <Buttons>
              <Button mode="strong" onClick={e => handleEdit(text)}>
                Save
              </Button>
              <Button type="button" onClick={e => handleEdit(false)}>
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
    textarea {
      flex-grow: 1;
    }
  }
`
const Buttons = styled.div`
  button {
    float: right;
  }
`

const TitleTextInput = styled(TextInput)`
  font-size: 2em;
  margin-bottom: 5px;
`

export default EditPanel
