# Utility token contract documentation

### Roles and privileges

| Name | Description and privilege |
|--|--|
| `init_owner`      | Initial owner of the contract. Most other roles are initialised with this value |
| `owner`           | Current owner, initialised with `init_owner`. Admin account, has permission for critical actions like changing other roles executors |
| `pauser`          | Can pause/unpause contract |
| `approvedSpender` | A token holder can designate a certain address to send up to a certain number of tokens on its behalf. These addresses will be called `approvedSpender`.  |
| `fundraisingManager` | Address allowed to change `fund_con` field |
| `approvedContract` | Approved internal address allowed to mint/burn tokens |
| `contractApprover` | Address which can approve/revoke addresses with mint/burn permition |

### Immutable fields

The table below lists the parameters that are defined at the contract deployment time and hence cannot be changed later on.

| Name | Type | Description |
|--|--|--|
|`name`         | `String`  | A human readable token name. |
|`symbol`       | `String`  | A ticker symbol for the token. |
|`decimals`     | `Uint32`  | Defines the smallest unit of the tokens|
|`init_owner`   | `ByStr20` | The initial owner of the contract. |

### Mutable fields

The table below presents the mutable fields of the contract and their initial values.

#### Simple fields
| Name | Type | Initial Value |Description |
|--|--|--|--|
|`owner`        | `ByStr20` | `init_owner`  | Current `owner` in the contract. |
|`pauser`       | `ByStr20` | `init_owner`  | Current `pauser` in the contract. |
|`fund_con`  |`Oprional ByStr20`| `None`    | Current address of fundraising contract if fundrasing is active.|
|`paused`       | `Bool`    | `False`       | Keeps track of whether the contract is current paused or not. `True` means the contract is paused. |
| `contractApprover` | `ByStr20` | `init_owner` | Current `cotractApprover` in the contract |
|`totalSupply`  | `Uint128` | `0`           | The total number of tokens that is in the supply. |

#### Maps

| Name | Type | Initial Value |Description |
|--|--|--|--|
|`balances`             | `Map ByStr20 Uint128` | Empty | Keeps track of the number of tokens that each token holder owns. |
|`allowed`              | `Map ByStr20 (Map ByStr20 Uint128)` | Empty | Keeps track of the `approvedSpender` for each token holder and the number of tokens that she is allowed to spend on behalf of the token holder. |
| `approvedContracts` | `Map ByStr20 Uint128` | Empty | Each key in this map represetns approved address no matter what value it is mapped to. |

### Transitions

#### Housekeeping Transitions

| Name | Params | Description | Callable when paused? |
|--|--|--|--|
|`transferOwnership`|`newOwner : ByStr20`|Allows the current `owner` to transfer control of the contract to a `newOwner`. <br>  :warning: **Note:** `_sender` must be the current `owner` in the contract.  | :heavy_check_mark: |
|`updatePauser`| `newPauser : ByStr20` |  Replace the current `pauser` with the `newPauser`.  <br>  :warning: **Note:** `_sender` must be the current `owner` in the contract. | :heavy_check_mark: |
|`updateFundraisingManager`| `newFundraisingManager : ByStr20` | Replace the current `fundraisingManager` with the `newFundraisingManager`.  <br>  :warning: **Note:** `_sender` must be the current `owner` in the contract. | :heavy_check_mark: |
|`connectFundraisingContract`|`address : ByStr20`| Set new address of fundraising contract. <br>  :warning: **Note:** `_sender` must be the current `fundraisingManager`.| :heavy_check_mark: |
|`updateContractApprover`| `newContractApprover : ByStr20` | Set new `contractApprover` with `newContractApprover` value.
|`approveContract`| `address : ByStr20` | Approve `address` for minting/burning of tokens. |
|`revokeontract`| `address : ByStr20` | Revoke previously approved `address` |

#### Pause-related Transitions

| Name | Params | Description | Callable when paused? |
|--|--|--|--|
|`pause`|  | Pause the contract to temporarily stop all transfer of tokens and other operations. Only the current `pauser` can invoke this transition.  <br>  :warning: **Note:** `_sender` must be the current `pauser` in the contract.  | :heavy_check_mark: |
|`unpause`|  | Unpause the contract to re-allow all transfer of tokens and other operations. Only the current `pauser` can invoke this transition.  <br>  :warning: **Note:** `_sender` must be the current `pauser` in the contract.  | :heavy_check_mark: |

#### Token Transitions

| Name | Params | Description | Callable when paused? |
|--|--|--|--|
|`BalanceOf`| `tokenOwner : ByStr20` | Transition to learn balance of some token owner. Sends back message `BalanceOfResponse` with fields `address` and `balance`. | :heavy_check_mark: |
|`Approve`| `spender : ByStr20, value : Uint128` | Approve a `spender` to spend on behalf of a token holder (`_sender`) upto the `value` amount. <br> `spender` and `_sender` must not be blacklisted. | :x:  |
|`Transfer`| `to : ByStr20, value : Uint128, code : Uint32` | Transfer `value` number of tokens from the `_sender` to the `to` address.  <br>  `_sender` and `to` addresses must not be blacklisted.| :x: |
|`TransferFrom`| `from : ByStr20, to : ByStr20, value : Uint128, code : Uint32` | Transfer `value` number of tokens on behalf of the `from` to the `to` address.  <br>  `_sender`, `from`, `to` addresses must not be blacklisted.| :x:  |

#### Minting-related Transitions

| Name | Params | Description | Callable when paused? |
|--|--|--|--|
|`mint`| `to: ByStr20, value : Uint128` | Mint `value` number of new tokens and allocate them to the `to` address.  <br>  :warning: **Note:** `sender` must be an `approvedContract`. Minting can only be done when the contract is not paused. | <center>:x:</center> |
|`burn`| `from: ByStr20, value : Uint128` | Burn `value` number of tokens on address `from`.  <br>  :warning: **Note:**   1) `_sender` must be an aproved contract 2) Burning can only be done when the contract is not paused.| <center>:x:</center>  |
