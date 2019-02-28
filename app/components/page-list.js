import React from 'react'

import { Button } from '@aragon/ui'

const PageList = ({ pages, selectedPage = 'Main', create, change, remove }) => (
  <div>
    <ul>
      {Object.keys(pages).map(page => (
        <li onClick={e => change(page)} key={page}>
          {selectedPage === page ? <strong>{page}</strong> : page}
          {page !== 'Main' && (
            <Button
              onClick={e => {
                remove(page)
                e.stopPropagation()
              }}
            >
              x
            </Button>
          )}
        </li>
      ))}
    </ul>
    <Button mode="strong" onClick={create}>
      Create
    </Button>
  </div>
)

export default PageList
