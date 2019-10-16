import React from 'react'

import { Box, theme } from '@aragon/ui'
import styled from 'styled-components'
import { withTranslation } from 'react-i18next'

const PageList = ({ pages, selectedPage = 'Welcome', change, t }) => (
  <Main>
    {Object.keys(pages).length > 0 && (
      <Box heading={t('Outline')}>
        <ul>
          {Object.keys(pages).map(page => (
            <li key={page}>
              <a onClick={e => change(page)}>
                {selectedPage === page ? <strong>{page}</strong> : page}
              </a>
            </li>
          ))}
        </ul>
      </Box>
    )}
  </Main>
)

const Main = styled.aside`
  flex-shrink: 0;
  flex-grow: 0;
  min-width: 260px;
  min-height: 100%;
  .accent {
    color: ${theme.accent};
  }
  ul {
    margin-left: 20px;
    a {
      cursor: pointer;
      text-align: left;
      &:hover {
        color: ${theme.selectionForeground};
      }
    }
  }
`

export default withTranslation()(PageList)
