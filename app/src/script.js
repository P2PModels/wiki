import '@babel/polyfill'
import { of } from 'rxjs'
import AragonApi from '@aragon/api'
import { toUtf8 } from 'web3-utils'
import { hexToIpfs } from './lib/ipfs-util'

const INITIALIZATION_TRIGGER = Symbol('INITIALIZATION_TRIGGER')

const api = new AragonApi()

const reducer = (state, event) => {
  let newState

  switch (event.event) {
    case INITIALIZATION_TRIGGER:
      newState = {
        pages: {},
        history: {},
      }
      break
    case 'Create': // will execute Edit because of the lack of break or return instructions
    case 'Edit': {
      // TODO (sem): Deprecate newValue in a future release, it is not used anymore in the contract
      // We keep it for backwards compatibility, as we might get an event from the
      // old version of the contract, which would return {..., "newValue": <whatever>}
      const { page, value, newValue } = event.returnValues
      const pageName = toUtf8(page)
      const hash = hexToIpfs(value || newValue)
      const newPage = { ...state.pages[pageName], hash }
      newState = {
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
      const { page } = event.returnValues
      const pageName = toUtf8(page)
      const removeKeyFromObj = (obj, keyToRemove) =>
        Object.keys(obj)
          .filter(key => key !== keyToRemove)
          .reduce((o, key) => {
            o[key] = obj[key]
            return o
          }, {})
      newState = {
        ...state,
        pages: removeKeyFromObj(state.pages, pageName),
      }
      break
    }
    case 'ChangePermissions': {
      const { page, isProtected } = event.returnValues
      const pageName = toUtf8(page)
      newState = {
        ...state,
        pages: {
          ...state.pages,
          [pageName]: { ...state.pages[pageName], isProtected },
        },
      }
      break
    }
    default:
      newState = state
  }

  return newState
}

api.store(
  (state, event) => {
    try {
      return reducer(state, event)
    } catch (e) {
      console.error(e)
      throw e
    }
  },
  [
    // Always initialize the store with our own home-made event
    of({ event: INITIALIZATION_TRIGGER }),
  ]
)
