import 'core-js/stable'
import 'regenerator-runtime/runtime'
import Aragon, { events } from '@aragon/api'
import { toUtf8 } from 'web3-utils'
import { hexToIpfs } from './lib/ipfs-util'

const app = new Aragon()

app.store(async (state, { event, returnValues }) => {
  console.log(state, event, returnValues)
  let nextState = { ...state }

  // Initial state
  if (state == null) {
    nextState = {
      pages: {},
      history: {},
    }
  }

  switch (event) {
    case 'Create': // will execute Edit because of the lack of break or return instructions
    case 'Edit': {
      const { page, value } = returnValues
      const pageName = toUtf8(page)
      const hash = hexToIpfs(value)
      const newPage = { ...state.pages[pageName], hash }
      nextState = {
        ...state,
        pages: {
          ...state.pages,
          [pageName]: newPage,
        },
        history: {
          ...state.history,
          [pageName]: [...(state.history[pageName] || []), hash],
        },
      }
      break
    }
    case 'Remove': {
      const { page } = returnValues
      const pageName = toUtf8(page)
      const removeKeyFromObj = (obj, keyToRemove) =>
        Object.keys(obj)
          .filter(key => key !== keyToRemove)
          .reduce((o, key) => {
            o[key] = obj[key]
            return o
          }, {})
      nextState = {
        ...state,
        pages: removeKeyFromObj(state.pages, pageName),
      }
      break
    }
    case 'ChangePermissions': {
      const { page, isProtected } = returnValues
      const pageName = toUtf8(page)
      nextState = {
        ...state,
        pages: {
          ...state.pages,
          [pageName]: { ...state.pages[pageName], isProtected },
        },
      }
      break
    }
    case events.SYNC_STATUS_SYNCING:
      nextState = { ...nextState, isSyncing: true }
      break
    case events.SYNC_STATUS_SYNCED:
      nextState = { ...nextState, isSyncing: false }
      break
  }

  return nextState
})
