import React from 'react'
import {
  Button,
  Card,
  ContextMenu,
  ContextMenuItem,
  IconCopy,
  IconRemove,
  SafeLink,
} from '@aragon/ui'
import { Title, ResetStyle, ActionLabel, IconWrapper } from './ui-components'
import styled from 'styled-components'
import { markdown } from 'markdown'

const defaultPage = 'Welcome'

const defaultText = `
This is a censorship resistant wiki, that stores the content on IPFS and saves
its state on the blockchain. If you are a token holder, you can edit it.
`

// Alternative: <iframe src="https://ipfs.io/ipfs/QmSrCRJmzE4zE1nAfWPbzVfanKQNBhp7ZWmMnEdbiLvYNh/mdown#sample.md" />
export const ViewPanel = ({
  page,
  hash,
  isProtected = false,
  text = defaultText,
  handleEdit,
  handleCreate,
  handleProtect,
  handleRemove,
}) => (
  <Main>
    <Card width="100%" className="padded">
      {hash && (
        <PageActions>
          <Button onClick={handleEdit} mode="text">
            Edit
          </Button>
          <ProtectButton
            page={page || defaultPage}
            isProtected={isProtected}
            handleProtect={handleProtect}
          />
          <div className="inline-block">
            <ContextMenu>
              <ContextMenuItem onClick={() => openIpfs(hash)}>
                <IconWrapper>
                  <IconCopy />
                </IconWrapper>
                <ActionLabel>
                  <SafeLink href={getIpfs(hash)}>View on IPFS</SafeLink>
                </ActionLabel>
              </ContextMenuItem>
              <ContextMenuItem onClick={handleRemove}>
                <IconWrapper>
                  <IconRemove />
                </IconWrapper>
                <ActionLabel>Remove Page</ActionLabel>
              </ContextMenuItem>
            </ContextMenu>
          </div>
        </PageActions>
      )}
      <Title>{page}</Title>
      <ResetStyle dangerouslySetInnerHTML={{ __html: markdown.toHTML(text) }} />
      {!hash ? (
        <Button mode="strong" onClick={handleEdit}>
          Create Page
        </Button>
      ) : null}
    </Card>
  </Main>
)

const getIpfs = hash => 'https://gateway.ipfs.io/ipfs/' + hash

const openIpfs = hash => {
  let win = window.open()
  win.opener = null
  win.location = getIpfs(hash)
  win.target = '_blank'
}

const Main = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  div:first-child {
    flex-grow: 1;
  }
  .inline-block {
    display: inline-block;
  }
  .padded {
    padding: 34px;
  }
`

const ProtectButton = ({ page, isProtected = false, handleProtect }) => (
  <Button onClick={e => handleProtect(page, !isProtected)} mode="text">
    {isProtected ? 'Unprotect' : 'Protect'}
  </Button>
)

const PageActions = styled.div`
  float: right;
`
