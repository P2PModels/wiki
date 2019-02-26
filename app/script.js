import '@babel/polyfill'

import Aragon from '@aragon/client'
import { toUtf8 } from 'web3-utils'
import { hexToIpfs } from './lib/ipfs-util'
import { of } from './rxjs'

const INITIALIZATION_TRIGGER = Symbol('INITIALIZATION_TRIGGER')
const app = new Aragon()

const initialState = {
  pages: { Main: { hash: null } },
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
      case 'Edit': {
        const { page, newValue } = event.returnValues
        const pageName = toUtf8(page)
        const hash = hexToIpfs(newValue)
        return {
          ...state,
          pages: {
            ...state.pages,
            [pageName]: { ...state.pages[pageName], hash },
          },
        }
      }
      case 'Create': {
        const { page, value } = event.returnValues
        const pageName = toUtf8(page)
        const hash = hexToIpfs(value)
        const newState = {
          ...state,
          pages: {
            ...state.pages,
            [pageName]: { ...state.pages[pageName], hash },
          },
        }
        console.log(newState)
        return newState
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
        const leaveMainPage = pages => {
          return !pages.Main ? { ...pages, Main: null } : pages
        }
        const newState = {
          ...state,
          pages: leaveMainPage(removeKeyFromObj(state.pages, pageName)),
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
