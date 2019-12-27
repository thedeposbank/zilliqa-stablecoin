# Stablecoin contract documentation

### Roles and privileges

| Name | Description and privilege |
|--|--|
| `init_owner`      | Initial owner of the contract. Most other roles are initialised with this value |
| `owner`           | Current owner, initialised with `init_owner`. Admin account, has permission for critical actions like changing other roles executors |
| `pauser`          | Can pause/unpause contract |
| `blacklister`     | Can blacklist/unblacklist addresses |
| `dBond_approver`  | Can approve certain dBond token contract with its owner to hold such tokenized debt as collateral |
| `oracle_approver` | Can manage oracles for price datafeeds for liquid crypto (ex. `ZIL`) |
| `dBond_issuer`    | Owner of the dBond token contract, can put/withdraw dBond tokens to the stablecoin contract in exchange of stablecoins. Needs to be explicitely approved by `dBond_approver`. Usually, there are several `dBond_issuers`, who are known partners of Depos |
|`approvedSpender`  | A token holder can designate a certain address to send up to a certain number of tokens on its behalf. These addresses will be called `approvedSpender`.  |

### Immutable fields

The table below lists the parameters that are defined at the contract deployment time and hence cannot be changed later on.

| Name | Type | Description |
|--|--|--|
|`name`         | `String`  | A human readable token name. |
|`symbol`       | `String`  | A ticker symbol for the token. |
|`decimals`     | `Uint32`  | Defines the smallest unit of the tokens|
|`init_owner`   | `ByStr20` | The initial owner of the contract. |
|`proxy_address`| `ByStr20` | Address of the proxy contract. |
|`dps_contract` | `ByStr20` | Address of utility token contract |

### Mutable fields

The table below presents the mutable fields of the contract and their initial values.

#### Simple fields
| Name | Type | Initial Value |Description |
|--|--|--|--|
|`owner`        | `ByStr20` | `init_owner`  | Current `owner` of the contract. |
|`pauser`       | `ByStr20` | `init_owner`  | Current `pauser` in the contract. |
|`blacklister`  | `ByStr20` | `init_owner`  | Current `blacklister` in the contract.|
|`paused`       | `Bool`    | `False`       | Keeps track of whether the contract is current paused or not. `True` means the contract is paused. |
|`dBond_approver`| `ByStr20` | `init_owner`  | Current `dBond_approver` in the contract.|
|`oracle_approver`| `ByStr20` | `init_owner`  | Current `oracle_approver` in the contract.|
|`totalSupply`  | `Uint128` | `0`           | The total number of tokens that is in the supply. |

#### Custom structures

| Structure name | Field type | Field description |
|--|--|--|
| `dBond_info`  | `Uint128` | Stablecoin contract balance of dBond tokens |
|               | `Uint128` | Most recent received dBond price |
|               | `Uint32`  | Timestamp of last price update of dBond |

#### Maps

| Name | Type | Initial Value |Description |
|--|--|--|--|
|`valid_dBonds_info`    | `Map ByStr20 dBond_info` | Empty | Only if dBond token address is contained as a key it can be accepted as collateral. Maintaines balances of the contract for different dBonds for collateral value on-fly estimation.
|`blacklisted`          | `Map ByStr20 Uint128` | Empty | Records the addresses that are blacklisted. An address that is present in the map is blacklisted irrespective of the value it is mapped to. |
|`balances`             | `Map ByStr20 Uint128` | Empty | Keeps track of the number of tokens that each token holder owns. |
|`allowed`              | `Map ByStr20 (Map ByStr20 Uint128)` | Empty | Keeps track of the `approvedSpender` for each token holder and the number of tokens that she is allowed to spend on behalf of the token holder. |


### Transitions
Note that each of the transitions in the token contract takes `initiator` as a parameter which as explained above is the caller that calls the proxy contract which in turn calls the token contract.

All the transitions in the contract can be categorized into three categories:
- _housekeeping transitions_ meant to facilitate basic admin realted tasks.
- _pause_ transitions to pause and pause the contract.
- _minting-related transitions_ that allows mining and burning of tokens.
- _token transfer transitions_ allows to transfer tokens from one user to another.
- _DPS token usage transitions_ that provide utility functions for DPS token
- _supply adjustment related transitions_ which keep the number of stablecoins issued close to the present total value of collateral

Each of these category of transitions are presented in further details below:

#### HouseKeeping Transitions

| Name | Params | Description | Callable when paused? |
|--|--|--|--|
|`transferOwnership`|`newOwner : ByStr20, initiator : ByStr20`|Allows the current `owner` to transfer control of the contract to a `newOwner`. <br>  :warning: **Note:** `initiator` must be the current `owner` in the contract.  | :heavy_check_mark: |
|`updatePauser`| `newPauser : ByStr20, initiator : ByStr20` |  Replace the current `pauser` with the `newPauser`.  <br>  :warning: **Note:** `initiator` must be the current `owner` in the contract. | :heavy_check_mark: |
|`blacklist`|`address : ByStr20, initiator : ByStr20`| Blacklist a given address. A blacklisted address can neither send or receive tokens. A `minter` can also be blacklisted. <br> :warning: **Note:**   `initiator` must be the current `blacklister` in the contract.| :heavy_check_mark: |
|`unBlacklist`|`address : ByStr20, initiator : ByStr20`| Remove a given address from the blacklist.  <br> :warning: **Note:** `initiator` must be the current `blacklister` in the contract.| :heavy_check_mark: |
|`updateBlacklister`|`newBlacklister : ByStr20, initiator : ByStr20`| Replace the current `blacklister` with the `newBlacklister`.  <br> :warning: **Note:**  `initiator` must be the current `owner` in the contract.| :heavy_check_mark: |
|`updateDBondApprover`|`newDBondApprover : ByStr20, initiator : ByStr20`| Replace the current `dbond_approver` with the `newDBondApprover`.  <br> :warning: **Note:**  `initiator` must be the current `owner` in the contract.| :heavy_check_mark: |
|`approveDBond`|`address : ByStr20, initiator : ByStr20`| Approve dbond token address. An approved address can put/withdraw dBond tokens as collateral. <br> :warning: **Note:**   `initiator` must be the current `dbond_approver` in the contract.| :heavy_check_mark: |
|`updateOracleApprover`|`newOracleApprover : ByStr20, initiator : ByStr20`| Replace the current `oracle_approver` with the `newOracleApprover`.  <br> :warning: **Note:**  `initiator` must be the current `owner` in the contract.| :heavy_check_mark: |
|`approveOracle`|`address : ByStr20, Symbol : String, initiator : ByStr20`| Approve price feed oracle address for a given symbol. Approved address can send messages with price updates. <br> :warning: **Note:**   `initiator` must be the current `oracle_approver` in the contract.| :heavy_check_mark: |

### Procedures