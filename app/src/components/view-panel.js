import React from 'react'
import {
  Button,
  Card,
  ContextMenu,
  ContextMenuItem,
  IconCopy,
  IconRemove,
  SafeLink,
  theme,
} from '@aragon/ui'
import {
  Title,
  ResetStyle,
  ActionLabel,
  IconWrapper,
  IconEdit,
  IconProtect,
} from './ui-components'
import styled from 'styled-components'
import { markdown } from 'markdown'

// Alternative: <iframe src="https://ipfs.io/ipfs/QmSrCRJmzE4zE1nAfWPbzVfanKQNBhp7ZWmMnEdbiLvYNh/mdown#sample.md" />
export const ViewPanel = ({
  page,
  hash,
  syncing,
  isProtected = false,
  text = '',
  handleEdit,
  handleCreate,
  handleProtect,
  handleRemove,
}) => (
  <Main>
    <Card width="100%" className="padded">
      {hash && (
        <PageActions>
          <Button onClick={handleEdit} mode="text" className="accent">
            <IconEdit />
            <span className="label">Edit</span>
          </Button>
          <ProtectButton
            page={page}
            isProtected={isProtected}
            handleProtect={handleProtect}
          />
          <div className="context-menu">
            <ContextMenu>
              <ContextMenuItem onClick={() => openIpfs(hash)}>
                <IconWrapper>
                  <IconCopy />
                </IconWrapper>
                <ActionLabel>
                  <SafeLink href={getIpfs(hash)} target="_blank">
                    View on IPFS
                  </SafeLink>
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
      {syncing ? (
        <Title>Loading…</Title>
      ) : hash || syncing ? (
        <div>
          <Title>{page}</Title>
          <ResetStyle
            dangerouslySetInnerHTML={{ __html: markdown.toHTML(text) }}
          />
        </div>
      ) : (
        <div>
          <Title>Welcome</Title>
          <ResetStyle>
            This is a censorship resistant wiki, that stores the content on IPFS
            its state on the blockchain. If you are a token holder, you can edit
            it.
          </ResetStyle>
          <div className="padded-vertically">
            <Button mode="strong" onClick={handleEdit}>
              Create Page
            </Button>
          </div>
        </div>
      )}
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
  .context-menu {
    display: inline-block;
    vertical-align: 6px;
    margin-left: 15px;
  }
  .padded {
    padding: 34px;
  }
  .padded-vertically {
    padding: 34px 0;
  }
`

const ProtectButton = ({ page, isProtected = false, handleProtect }) =>
  isProtected ? (
    <Button
      onClick={e => handleProtect(page, !isProtected)}
      mode="text"
      className="protected"
      title="Unprotect"
    >
      <IconProtect />
    </Button>
  ) : (
    <Button
      onClick={e => handleProtect(page, !isProtected)}
      mode="text"
      className="unprotected"
      title="Protect"
    >
      <IconProtect />
    </Button>
  )

const PageActions = styled.div`
  float: right;
  button {
    &.accent {
      color: ${theme.accent};
    }
    &.protected:not(:hover),
    &.unprotected:hover {
      color: ${theme.positive};
    }
    font-size: 15px;
    .label {
      padding-left: 5px;
      vertical-align: 3px;
    }
  }
`
