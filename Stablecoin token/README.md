# Stablecoin contract documentation

This contract represents standard token contract with extention for minting/burning tokens by approved Depos smart contracts and with extention for decentralized governance contract to have right for some critical administrative initiatives.

### Roles and privileges

| Name | Description and privilege |
|--|--|
| `init_owner`      | Initial owner of the contract. Most other roles are initialised with this value |
| `init_gov_contract`| Initial decentralized governance contract.  |
| `owner`           | Current owner, initialised with `init_owner`. Admin account, has permission for critical actions like changing other roles executors except the `gov_contract` |
| `pauser`          | Can pause/unpause contract |
| `blacklister`     | Can blacklist/unblacklist addresses |
|`approvedSpender`  | A token holder can designate a certain address to send up to a certain number of tokens on its behalf. These addresses will be called `approvedSpender`  |
| `contractApprover` | A role which can designate a certain address to mint/burn stablecoins. Only smart contracts will be approved |
|`approvedContract` | An internal smart contract representing Depos logic module which has rights to mint/burn tokens |
|`gov_contract`| A contract which can change `owner` and its own value. Is independent from `owner` and provides security if `owner` misbehave (ex. can dismiss `owner`, upload and approve new contract for logic implementation). |

### Immutable fields

The table below lists the parameters that are defined at the contract deployment time and hence cannot be changed later on.

| Name | Type | Description |
|--|--|--|
|`name`         | `String`  | A human readable token name. |
|`symbol`       | `String`  | A ticker symbol for the token. |
|`decimals`     | `Uint32`  | Defines the smallest unit of the tokens|
|`init_owner`   | `ByStr20` | The initial owner of the contract. |
| `init_gov_contract`| `ByStr20` | The initial decentralized governance contract.  |

### Mutable fields

The table below presents the mutable fields of the contract and their initial values.

#### Simple fields
| Name | Type | Initial Value |Description |
|--|--|--|--|
|`owner`        | `ByStr20` | `init_owner`  | Current `owner` in the contract. |
|`pauser`       | `ByStr20` | `init_owner`  | Current `pauser` in the contract. |
|`blacklister`  | `ByStr20` | `init_owner`  | Current `blacklister` in the contract.|
|`contractApprover`| `ByStr20` | `init_owner`  | Current `contractApprover` in the contract.|
|`paused`       | `Bool`    | `False`       | Keeps track of whether the contract is current paused or not. `True` means the contract is paused. |
|`totalSupply`  | `Uint128` | `0`           | The total number of tokens that is in the supply. |
|`gov_contract`| `Bystr20` | `init_gov_contract` | Current `gov_contract` in the contract.

#### Maps

| Name | Type | Initial Value |Description |
|--|--|--|--|
|`blacklisted`          | `Map ByStr20 Uint128` | Empty | Records the addresses that are blacklisted. An address that is present in the map is blacklisted irrespective of the value it is mapped to. |
|`balances`             | `Map ByStr20 Uint128` | Empty | Keeps track of the number of tokens that each token holder owns. |
|`allowed`              | `Map ByStr20 (Map ByStr20 Uint128)` | Empty | Keeps track of the `approvedSpender` for each token holder and the number of tokens that she is allowed to spend on behalf of the token holder. |
|`approvedContracts`          | `Map ByStr20 Uint128` | Empty | Records internal approved smart contracts. |


### Transitions

All the transitions in the contract can be categorized into three categories:
- _housekeeping transitions_ meant to facilitate basic admin realted tasks.
- _pause_ transitions to pause and pause the contract.
- _minting-related transitions_ that allows mining and burning of tokens.
- _token transfer transitions_ allows to transfer tokens from one user to another.

Each of these category of transitions are presented in further details below:

#### HouseKeeping Transitions

| Name | Params | Description | Callable when paused? |
|--|--|--|--|
|`transferOwnership`|`newOwner : ByStr20`|Allows the current `owner` to transfer control of the contract to a `newOwner`. <br>  :warning: **Note:** `_sender` must be the current `owner` in the contract.  | :heavy_check_mark: |
|`updatePauser`| `newPauser : ByStr20` |  Replace the current `pauser` with the `newPauser`.  <br>  :warning: **Note:** `_sender` must be the current `owner` in the contract. | :heavy_check_mark: |
|`blacklist`|`address : ByStr20`| Blacklist a given address. A blacklisted address can neither send or receive tokens. A `minter` can also be blacklisted. <br> :warning: **Note:**   `_sender` must be the current `blacklister` in the contract.| :heavy_check_mark: |
|`unBlacklist`|`address : ByStr20`| Remove a given address from the blacklist.  <br> :warning: **Note:** `_sender` must be the current `blacklister` in the contract.| :heavy_check_mark: |
|`updateBlacklister`|`newBlacklister : ByStr20`| Replace the current `blacklister` with the `newBlacklister`.  <br> :warning: **Note:**  `_sender` must be the current `owner` in the contract.| :heavy_check_mark: |
|`updateContractApprover`|`newContractApprover : ByStr20`| Replace the current `contractApprover` with the `newContractApprover`.  <br> :warning: **Note:**  `_sender` must be the current `owner` in the contract.| :heavy_check_mark: |
|`approveContract`|`address : ByStr20`| Approve contract address. An approved address can mint/burn tokens (burn only from `capital`). dBond tokens as collateral. <br> :warning: **Note:**   `_sender` must be the current `contractApprover` in the contract.| :heavy_check_mark: |
|`revokeContract`|`address : ByStr20`| Revoke previously approved contract address | :heavy_check_mark: |
|`transferGovernance`|`new_gov : ByStr20`|Allows the current `gov_contract` to change its value to a `new_gov`. <br>  :warning: **Note:** `_sender` must be the current `gov_contract` in the contract.  | :heavy_check_mark: |

#### Pause-related Transitions

| Name | Params | Description | Callable when paused? |
|--|--|--|--|
|`pause`|  | Pause the contract to temporarily stop all transfer of tokens and other operations. Only the current `pauser` can invoke this transition.  <br>  :warning: **Note:** `initiator` must be the current `pauser` in the contract.  | :heavy_check_mark: |
|`unpause`|  | Unpause the contract to re-allow all transfer of tokens and other operations. Only the current `pauser` can invoke this transition.  <br>  :warning: **Note:** `initiator` must be the current `pauser` in the contract.  | :heavy_check_mark: |

#### Minting-related Transitions

| Name | Params | Description | Callable when paused? |
|--|--|--|--|
|`mint`| `to: ByStr20, value : Uint128` | Mint `value` number of new tokens and allocate them to the `to` address.  <br>  :warning: **Note:** 1) Only the `approvedContract` can invoke this transition, i.e., `_sender` must be an `approvedContract`, 2) Minting can only be done when the contract is not paused. | <center>:x:</center> |
|`burn`| `from: ByStr20, value : Uint128` | Burn `value` number of tokens from `from` address.  <br>  :warning: **Note:**   1) Only the `approvedContract` can burn tokens. 2) Burning can only be done when the contract is not paused.| <center>:x:</center>  |

#### Token Transfer Transitions

| Name | Params | Description | Callable when paused? |
|--|--|--|--|
|`approve`| `spender : ByStr20, value : Uint128` | Approve a `spender` to spend on behalf of a token holder (`_sender`) upto the `value` amount. <br> :warning: **Note:** 1) Only the non-blacklisted minters can invoke this transition, i.e., `_sender` must be a non-blacklisted token holder, 2) The spender must also be non-blacklisted. | <center>:x:</center>  |
|`transfer`| `to : ByStr20, value : Uint128` | Transfer `value` number of tokens from the `_sender` to the `to` address.  <br>  :warning: **Note:**   1) The `_sender` and the `recipient` should not be blacklisted.|<center>:x:</center>  |
|`transferFrom`| `from : ByStr20, to : ByStr20, value : Uint128` | Transfer `value` number of tokens on behalf of the `_sender` to the `to` address.  <br>  :warning: **Note:**   1) The `_sender`, the `from` address and the `recipient` should not be blacklisted.|<center>:x:</center>  |