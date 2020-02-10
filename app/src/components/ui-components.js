import React from 'react'
import styled from 'styled-components'
import { useTheme, GU } from '@aragon/ui'

export const Title = ({ children, ...props }) => {
  const theme = useTheme()
  return (
    <h1
      {...props}
      css={`
        margin-top: 10px;
        margin-bottom: 20px;
        font-weight: 600;
        font-size: 22px;
        color: ${theme.contentSecondary};
      `}
    >
      {children}
    </h1>
  )
}

export const Textarea = ({ children, ...props }) => {
  const theme = useTheme()
  return (
    <textarea
      {...props}
      css={`
        width: 100%;
        background-color: ${theme.surface};
        padding: ${2 * GU}px;
      `}
    >
      {children}
    </textarea>
  )
}

export const ActionLabel = styled.span`
  margin-left: 15px;
  a {
    text-decoration: none;
  }
`

export const IconWrapper = ({ children, ...props }) => {
  const theme = useTheme()
  return (
    <span
      {...props}
      css={`
        display: flex;
        align-content: center;
        margin-top: -3px;
        color: ${theme.contentSecondary};
        &.accent {
          color: ${theme.accent};
        }
      `}
    >
      {children}
    </span>
  )
}

export const ResetStyle = styled.div`
  pre,
  code,
  tt {
    font: 1em/1.5em 'Andale Mono', 'Lucida Console', monospace;
  }
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  b,
  strong {
    font-weight: bold;
  }
  h1 {
    font-size: 1.5em;
  }
  em,
  i,
  dfn {
    font-style: italic;
  }
  p,
  code,
  pre,
  kbd {
    margin: 0 0 1.5em 0;
  }
  blockquote {
    margin: 0 1.5em 1.5em 1.5em;
  }
  cite {
    font-style: italic;
  }
  li ul,
  li ol {
    margin: 0 1.5em;
  }
  ul,
  ol {
    margin: 0 1.5em 1.5em 1.5em;
  }
  ul {
    list-style-type: disc;
  }
  ol {
    list-style-type: decimal;
    padding-inline-start: unset;
  }
  del {
    text-decoration: line-through;
  }
  pre {
    margin: 1.5em 0;
    white-space: pre;
  }
`
