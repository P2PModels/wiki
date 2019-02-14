import '@babel/polyfill'

import Aragon from '@aragon/client'
import { hexToStr, hexToIpfs } from './ipfs-util'
import { of } from './rxjs'

const INITIALIZATION_TRIGGER = Symbol('INITIALIZATION_TRIGGER')
const app = new Aragon()

const initialState = {
  pages: { Main: null },
}
app.store(
  (state, event) => {
    console.log(state, event)
    const { event: eventName } = event

    if (eventName === INITIALIZATION_TRIGGER || state === null) {
      state = initialState
    }

    switch (eventName) {
      case 'Edit': {
        const { page, newValue } = event.returnValues
        const pageName = hexToStr(page)
        const hash = hexToIpfs(newValue)
        return { ...state, pages: { ...state.pages, [pageName]: hash } }
      }
      case 'Create': {
        const { page, value } = event.returnValues
        const pageName = hexToStr(page)
        const hash = hexToIpfs(value)
        const newState = {
          ...state,
          pages: { ...state.pages, [pageName]: hash },
        }
        console.log(newState)
        return newState
      }
      case 'Delete': {
        const { page } = event.returnValues
        const newState = { ...state }
        delete newState.pages[page]
        return newState
      }
      default:
        return state
    }
  },
  [of({ event: INITIALIZATION_TRIGGER })]
)
