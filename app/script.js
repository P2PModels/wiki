import '@babel/polyfill'

import Aragon from '@aragon/client'
import { toUtf8 } from 'web3-utils'
import { hexToIpfs } from './lib/ipfs-util'
import { of } from './rxjs'

const INITIALIZATION_TRIGGER = Symbol('INITIALIZATION_TRIGGER')
const app = new Aragon()

const initialState = {
  pages: {},
  history: {},
}
app.store(
  (state, event) => {
    console.log(state, event)
    const { event: eventName } = event
    if (eventName === INITIALIZATION_TRIGGER || state === null) {
      state = initialState
    }

    console.log(eventName)
    switch (eventName) {
      case 'Create': // will execute Edit because of the lack of break or return instructions
      case 'Edit': {
        const { page, newValue } = event.returnValues
        const pageName = toUtf8(page)
        const hash = hexToIpfs(newValue)
        const newPage = { ...state.pages[pageName], hash }
        return {
          ...state,
          pages: {
            ...state.pages,
            [pageName]: newPage,
          },
          history: {
            ...state.history,
            [pageName]: [...state.history[pageName], hash],
          },
        }
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
        const newState = {
          ...state,
          pages: removeKeyFromObj(state.pages, pageName),
        }
        console.log(newState)
        return newState
      }
      case 'ChangePermissions': {
        const { page, isProtected } = event.returnValues
        const pageName = toUtf8(page)
        const newState = {
          ...state,
          pages: {
            ...state.pages,
            [pageName]: { ...state.pages[pageName], isProtected },
          },
        }
        console.log(newState)
        return newState
      }
      default:
        return state
    }
  },
  [of({ event: INITIALIZATION_TRIGGER })]
)
