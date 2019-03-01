import styled from 'styled-components'
import { theme } from '@aragon/ui'
import IconEdit from '../icons/components/IconEdit'
import IconProtect from '../icons/components/IconProtect'

const SpacedBlock = styled.div`
  margin-top: 30px;
  height: 100%;
  &:first-child {
    margin-top: 0;
  }
`
const Title = styled.h1`
  margin-top: 10px;
  margin-bottom: 20px;
  font-weight: 600;
  font-size: 22px;
`
const Main = styled.div`
  width: 100%;
`
const TwoPanels = styled.div`
  display: flex;
  width: 100%;
  min-width: 800px;
  flex-grow: 1;
`
const SideBar = styled.aside`
  flex-shrink: 0;
  flex-grow: 0;
  width: 16.66%;
  margin-left: 30px;
  min-height: 100%;
`

const Textarea = styled.textarea`
  width: 100%;
`

const ActionLabel = styled.span`
  margin-left: 15px;
  a {
    text-decoration: none;
  }
`

const IconWrapper = styled.span`
  display: flex;
  align-content: center;
  margin-top: -3px;
  color: ${theme.textSecondary};
  &.accent {
    color: ${theme.accent};
  }
`

const ResetStyle = styled.div`
  font: 15px sans-serif;

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
  }
  del {
    text-decoration: line-through;
  }
  pre {
    margin: 1.5em 0;
    white-space: pre;
  }
`
export {
  SpacedBlock,
  Title,
  Main,
  TwoPanels,
  SideBar,
  Textarea,
  ResetStyle,
  ActionLabel,
  IconWrapper,
  IconEdit,
  IconProtect,
}
