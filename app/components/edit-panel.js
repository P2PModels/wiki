import React from 'react'

import { Button, Card } from '@aragon/ui'
import { Title, Textarea } from './ui-components'

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

export default EditPanel
