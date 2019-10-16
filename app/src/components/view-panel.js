import React from 'react'
import {
  Button,
  Box,
  ContextMenu,
  ContextMenuItem,
  IconBlock,
  IconRemove,
  SafeLink,
  IconLock,
  IconUnlock,
  IconEdit,
} from '@aragon/ui'
import { Title, ResetStyle, ActionLabel, IconWrapper } from './ui-components'
import styled from 'styled-components'
import remark from 'remark'
import remark2react from 'remark-react'
import { withTranslation, Trans } from 'react-i18next'

// Alternative: <iframe src="https://ipfs.io/ipfs/QmSrCRJmzE4zE1nAfWPbzVfanKQNBhp7ZWmMnEdbiLvYNh/mdown#sample.md" />
const ViewPanel = ({
  page,
  hash,
  syncing,
  isProtected = false,
  text = '',
  handleEdit,
  handleCreate,
  handleProtect,
  handleRemove,
  t,
}) => {
  const jsx = remark().use(remark2react).processSync
  const textJSX = jsx(text).contents
  return (
    <Main>
      {hash && (
        <div css={{ float: 'right' }}>
          <ContextMenu>
            <ContextMenuItem onClick={handleEdit}>
              <IconWrapper>
                <IconEdit />
              </IconWrapper>
              <ActionLabel>{t('Edit')}</ActionLabel>
            </ContextMenuItem>
            <ContextMenuItem onClick={() => handleProtect(page, !isProtected)}>
              <IconWrapper>
                {!isProtected ? <IconLock /> : <IconUnlock />}
              </IconWrapper>
              <ActionLabel>
                {!isProtected ? t('Protect') : t('Unprotect')}
              </ActionLabel>
            </ContextMenuItem>
            <ContextMenuItem onClick={() => openIpfs(hash)}>
              <IconWrapper>
                <IconBlock />
              </IconWrapper>
              <ActionLabel>
                <SafeLink
                  href={getIpfs(hash)}
                  target="_blank"
                  css={{ color: 'inherit' }}
                >
                  {t('View on IPFS')}
                </SafeLink>
              </ActionLabel>
            </ContextMenuItem>
            <ContextMenuItem onClick={handleRemove}>
              <IconWrapper>
                <IconRemove />
              </IconWrapper>
              <ActionLabel>{t('Remove Page')}</ActionLabel>
            </ContextMenuItem>
          </ContextMenu>
        </div>
      )}
      {syncing ? (
        <Title>{t('Loading…')}</Title>
      ) : hash || syncing ? (
        <div>
          <Title>
            {page} {isProtected && <IconLock />}
          </Title>
          <ResetStyle>{textJSX}</ResetStyle>
        </div>
      ) : (
        <div>
          <Title>{t('Welcome')}</Title>
          <ResetStyle>
            <Trans i18nKey="default-wiki-text">
              This is a censorship resistant wiki, that stores the content on
              IPFS its state on the blockchain. If you are a token holder, you
              can edit it.
            </Trans>
          </ResetStyle>
          <div className="padded-vertically">
            <Button mode="strong" onClick={handleEdit}>
              {t('Create Page')}
            </Button>
          </div>
        </div>
      )}
    </Main>
  )
}

const getIpfs = hash => 'https://gateway.ipfs.io/ipfs/' + hash

const openIpfs = hash => {
  const win = window.open()
  win.opener = null
  win.location = getIpfs(hash)
  win.target = '_blank'
}

const Main = styled(Box)`
  height: 100%;
  display: flex;
  flex-direction: row;
  padding: 10px 30px;
  > div:first-child {
    flex-grow: 1;
    min-height: 60vh;
  }
  .padded-vertically {
    padding: 20px 0;
  }
`

export default withTranslation()(ViewPanel)
