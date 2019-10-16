import styled from 'styled-components'
import { theme } from '@aragon/ui'

export const Title = styled.h1`
  margin-top: 10px;
  margin-bottom: 20px;
  font-weight: 600;
  font-size: 22px;
  color: ${theme.textSecondary};
`

export const Textarea = styled.textarea`
  width: 100%;
`

export const ActionLabel = styled.span`
  margin-left: 15px;
  a {
    text-decoration: none;
  }
`

export const IconWrapper = styled.span`
  display: flex;
  align-content: center;
  margin-top: -3px;
  color: ${theme.textSecondary};
  &.accent {
    color: ${theme.accent};
  }
`

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
