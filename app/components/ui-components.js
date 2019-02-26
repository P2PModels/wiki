import styled from 'styled-components'

const SpacedBlock = styled.div`
  margin-top: 30px;
  &:first-child {
    margin-top: 0;
  }
`
const Title = styled.h1`
  margin-top: 10px;
  margin-bottom: 20px;
  font-weight: 600;
`
const Main = styled.div`
  width: 100%;
`
const TwoPanels = styled.div`
  display: flex;
  width: 100%;
  min-width: 800px;
`
const SideBar = styled.aside`
  flex-shrink: 0;
  flex-grow: 0;
  width: 260px;
  margin-left: 30px;
  min-height: 100%;
`

const Textarea = styled.textarea`
  width: 100%;
  height: inherit;
`

const ResetStyle = styled.div`
  font: 9pt/1.5em sans-serif;
  padding: 25px;

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
export { SpacedBlock, Title, Main, TwoPanels, SideBar, Textarea, ResetStyle }
