import React from 'react'
import { Button, Text, Card } from '@aragon/ui'
import { Title, ResetStyle } from './ui-components'
import { markdown } from 'markdown'

const ViewPanel = ({
  page,
  hash,
  isProtected,
  text = '',
  handleSwitch,
  handleProtect,
}) => (
  <div>
    <Title>View {page} Page</Title>
    <Button mode="strong" onClick={handleSwitch}>
      Edit
    </Button>
    <ProtectButton
      page={page}
      isProtected={isProtected}
      handleProtect={handleProtect}
    />
    <Card width="100%">
      <ResetStyle dangerouslySetInnerHTML={{ __html: markdown.toHTML(text) }} />
    </Card>
    <Text.Block>{hash}</Text.Block>
  </div>
)

const ProtectButton = ({ page, isProtected = false, handleProtect }) =>
  !isProtected ? (
    <Button onClick={e => handleProtect(page, true)}>Protect</Button>
  ) : (
    <Button onClick={e => handleProtect(page, false)}>Unprotect</Button>
  )

export default ViewPanel
