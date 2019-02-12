import '@babel/polyfill'

import Aragon from '@aragon/client'
import { get as ipfsGet, hexToIpfs, hexToStr } from './ipfs-util'
import { of } from './rxjs'

const INITIALIZATION_TRIGGER = Symbol('INITIALIZATION_TRIGGER')
const app = new Aragon()

const initialState = {
  hash: null,
  text: '',
  pages: ['Main'],
}
app.store(
  async (state, event) => {
    console.log(state, event)
    const { event: eventName } = event

    if (eventName === INITIALIZATION_TRIGGER || state === null) {
      state = initialState
    }

    switch (eventName) {
      case 'Edit':
        const hash = hexToIpfs(event.returnValues.newValue)
        const text = await ipfsGet(hash)
        return { ...state, hash, text }
      case 'Create':
        const newState = {
          ...state,
          pages: [...state.pages, hexToStr(event.returnValues.page)],
        }
        console.log(newState)
        return newState
      case 'Delete':
        return {
          ...state,
          pages: state.pages.filter(a => a !== event.returnValues.page),
        }
      default:
        return state
    }
  },
  [of({ event: INITIALIZATION_TRIGGER })]
)
