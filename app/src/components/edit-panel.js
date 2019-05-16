import React, { useState } from 'react'

import { Button, Card, TextInput } from '@aragon/ui'
import { Textarea } from './ui-components'
import styled from 'styled-components'
import { withTranslation } from 'react-i18next'

function EditPanel({ mode, handleSubmit, t, text: _text, page: _page }) {
  const [text, setText] = useState(mode === 'create' ? '' : _text)
  const [page, setPage] = useState(mode === 'create' ? '' : _page)
  return (
    <Main>
      <Card className="padded" width="100%" height="100%">
        <form onSubmit={e => e.preventDefault()}>
          <TextInput
            value={page}
            onChange={e => setPage(e.target.value)}
            disabled={mode === 'edit'}
            placeholder={mode === 'create' ? t('New Page') : ''}
            autoFocus={mode === 'create'}
            wide
          />
          <Textarea
            value={text}
            onChange={e => setText(e.target.value)}
            autoFocus={mode === 'edit'}
          />
          <Buttons>
            <Button mode="strong" onClick={e => handleSubmit(page, text)}>
              {t('Save')}
            </Button>
            <Button
              type="button"
              mode="outline"
              onClick={e => handleSubmit(false)}
            >
              {t('Cancel')}
            </Button>
          </Buttons>
        </form>
      </Card>
    </Main>
  )
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

export default withTranslation()(EditPanel)
