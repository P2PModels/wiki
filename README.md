# P2P Models Wiki dApp

An Unstoppable Wiki for the Right to Access Knowledge.

> There is more than one way to burn a book. And the world is full of people running about with lit matches. – Ray Bradbury, Fahrenheit 451

> The Internet treats censorship as a malfunction and routes around it. – John Perry Barlow

This Wiki dApp uses [Aragon](https://aragon.org) and [IPFS](https://ipfs.io) in order to enable a distributed editable and permissioned wiki. Wikis like that are imperative in a world where [Wikipedia is censored](https://blog.ipfs.io/24-uncensorable-wikipedia/) in some states.

## This is how it looks like

### Edition

Pages can be edited using markdown:

![Edit a page](https://p2pmodels.eu/wp-content/uploads/edit.gif)

### Many Pages

In the sidebar there are the wiki pages, and more can be created:

![Create a page](https://p2pmodels.eu/wp-content/uploads/create.gif)

### Page protection

A page can be protected, so only people or apps with the right permissions can edit it:

![Protect a page](https://p2pmodels.eu/wp-content/uploads/protect.gif)

## Usage

You can start the wiki on a local Ethereum devchain as follows:

```sh
git clone https://github.com/p2pmodels/wiki
cd wiki
npm install
npm start
```

## Installing the Wiki dApp on a Rinkeby DAO

This Wiki Aragon app is published in the AragonPM package manager on Rinkeby, so it can be
installed to any Aragon DAO on that network. In order to deploy this app on an existing DAO,
you can do the following:

```sh
$ npm install -g @aragon/cli --unsafe-perms=true
$ dao install <dao-name>.aragonid.eth wiki.open.aragonpm.eth --environment aragon:rinkeby
# -> Depending on your DAO permissions, a voting may have been issued. The voting must pass in order to continue.
$ dao apps --all <dao-name>.aragonid.eth --environment aragon:rinkeby
# -> You should see a list of apps, and the <wiki-addr> listed under permissionless apps.
$ dao acl create <dao-name>.aragonid.eth <wiki-addr> EDIT_ROLE <your-addr> <your-addr> --environment aragon:rinkeby
$ dao acl create <dao-name>.aragonid.eth <wiki-addr> CREATE_ROLE <your-addr> <your-addr> --environment aragon:rinkeby
$ dao acl create <dao-name>.aragonid.eth <wiki-addr> PROTECT_ROLE <your-addr> <your-addr> --environment aragon:rinkeby
# -> You may vote all this permission changes
```

### Using HTTP for development

Running your app using HTTP will allow for a faster development process of your app's front-end, as it can be hot-reloaded without the need to execute `aragon run` every time a change is made.

- First start your app's development server running `npm run start:app`, and keep that process running. By default it will rebuild the app and reload the server when changes to the source are made.

- After that, you can run `npm run start:aragon:http` or `npm run start:aragon:http:kit` which will compile your app's contracts, publish the app locally and create a DAO. You will need to stop it and run it again after making changes to your smart contracts.

Changes to the app's background script (`app/script.js`) cannot be hot-reloaded, after making changes to the script, you will need to either restart the development server (`npm run start:app`) or rebuild the script `npm run build:script`.

### npm Scripts

- **start** or **start:aragon:ipfs**: Runs your app inside a DAO served from IPFS
- **start:aragon:http**: Runs your app inside a DAO served with HTTP (hot reloading)
- **start:aragon:ipfs:kit**: Creates a DAO with the Kit and serves the app from IPFS
- **start:aragon:http:kit**: Creates a DAO with the Kit and serves the app with HTTP (hot reloading)
- **start:app**: Starts a development server for your app
- **compile**: Compile the smart contracts
- **build**: Builds the front-end and background script
- **build:app**: Builds the front-end
- **build:script**: Builds the background script
- **test**: Runs tests for the contracts
- **publish:minor**: Release a minor version to aragonPM
- **publish:major**: Release a major version to aragonPM with a potentially new contract address for on-chain upgrades
- **lint**: Shows the ES6 and Solidity style errors
- **lint:fix**: Fixes the ES6 and Solidity style errors

## Licensing

The entire app is licensed as `AGPL-3.0-or-later`.
