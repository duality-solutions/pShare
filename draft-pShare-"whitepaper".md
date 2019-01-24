# pShare - PrivateShare

## Abstract

Privately and securely share data with friends, family, and business associates.

pShare is a privacy oriented p2p (peer to peer), file-and-folder sharing application, allowing creation of public and private groups to manage your links and file sharing.

With pShare it is easy to share data with friends, family and business associates securely, without centralized administrators and prying eyes monitoring your activity.

## Technical Information

Needs content.

### Architecture

Needs content.

##### RPC

All system level communication apart from file sharing is handled by the local dynamicd instance of the user. Communication between the pShare desktop application and the dynamicd are controlled via RPC. The  base RPC library to fork from is [here](https://github.com/ruimarinho/bitcoin-core).

##### WebRTC

pShare establishes a direct WebRTC connections with peers in order to share data. Session data, needed to establish the WebRTC data channel, is communicated between peers using the existing Dynodes, allowing users to get up to date information about what resources are available from each peer.

##### Electron

pShare is built using the Electron framework.

##### End-to-End Encryption

Needs content.

##### Additional Libraries

Needs content.

### Installation

Needs content.

### User/Group Linking

Needs content.

### Data Sharing

Needs content.

##### Sharing a file

Needs content.

##### Fetching a file

Needs content.

### Link Management

Needs content.



