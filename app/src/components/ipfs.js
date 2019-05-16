import React, { useState, useEffect } from 'react'
import { ipfs } from '../lib/ipfs-util'
import { SafeLink } from '@aragon/ui'
import { Trans } from 'react-i18next'

function IpfsIsConnected() {
  /* Peers status:
   * true: uninitialized
   * false: not connected
   * int: number of peers
   */
  const [peers, setPeersStatus] = useState(true)

  useEffect(() => {
    const checkPeers = () => {
      try {
        ipfs.swarm
          .peers()
          .then(peers => {
            console.log(peers.length + ' IPFS peers')
            setPeersStatus(peers.length)
          })
          .catch(e => setPeersStatus(false))
      } catch (e) {
        setPeersStatus(false)
      }
    }
    const interval = setInterval(checkPeers, 5000)
    return () => clearInterval(interval)
  })

  return peers === false ? (
    <div style={{ color: 'red' }}>
      <Trans i18nKey="ipfs-not-running">
        ⚠ Warning: IPFS daemon is not running or is not available in your
        computer. Please{' '}
        <SafeLink href="https://dist.ipfs.io/#go-ipfs" target="_blank">
          <strong>install it</strong>
        </SafeLink>{' '}
        and run <strong>ipfs daemon</strong> on your console.
      </Trans>
    </div>
  ) : peers === 0 ? (
    <div style={{ color: 'red' }}>
      <Trans i18nKey="ipfs-not-connected">
        ⚠ Warning: IPFS is not connected to any peer. The content of your edits
        is not going to be propagated. Please, check your internet connection.
      </Trans>
    </div>
  ) : null
}

export default IpfsIsConnected
