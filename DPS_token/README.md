# Utility token contract documentation

### Roles and privileges

| Name | Description and privilege |
|--|--|
| `init_owner`      | Initial owner of the contract. Most other roles are initialised with this value |
| `owner`           | Current owner, initialised with `init_owner`. Admin account, has permission for critical actions like changing other roles executors |
| `pauser`          | Can pause/unpause contract |
| `approvedSpender` | A token holder can designate a certain address to send up to a certain number of tokens on its behalf. These addresses will be called `approvedSpender`.  |
| `fundraisingManager` | Address allowed to change `fundrContract` field. |
| `fundrContract` | Fundraising contract |
| `devAcc` | Development fund account, to accumulate development fee |
| `devAccChanger` | Address allowed to change `devAcc` |
| `approvedContract` | Approved internal address allowed to burn tokens |
| `contractApprover` | Address which can approve/revoke addresses with burn permission |

### Constants

`devRate` -- Amount of DPS issued to `devAcc` for each one DPS sold at fundraising.

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
|`contractApprover` | `ByStr20` | `init_owner` | Current `contractApprover` in the contract. |
|`fundrContract`  |`Option ByStr20`| `None`    | Current address of fundraising contract if fundraising is active, `None` if no fundraising in process. |
|`fundraisingManager`| `ByStr20` | `init_owner` | Address allowed to change `fundrContract` field. |
|`devAcc`       | `Option ByStr20` | `None` | Development fund account. |
|`devAccChanger`| `ByStr20` | `init_owner`  | Current `devAccChanger` in the contract. |
|`paused`       | `Bool`    | `False`       | Keeps track of whether the contract is current paused or not. `True` means the contract is paused. |
|`fundrInProcess`|`Bool`    | `False`       | Indicates if fundraising is in process. |
|`totalSupply`  | `Uint128` | `0`           | The total number of tokens that is in the supply. |
|`beforeFundrSupply` | `Uint128` | `0`      | DPS Supply before fundraising. |
|`alreadyTransferredToDev` | `Uint128` | `0` | DPS already transferred to dev account in current fundraising. |

#### Maps

| Name | Type | Initial Value |Description |
|--|--|--|--|
|`balances`             | `Map ByStr20 Uint128` | Empty | Keeps track of the number of tokens that each token holder owns. |
|`allowed`              | `Map ByStr20 (Map ByStr20 Uint128)` | Empty | Keeps track of the `approvedSpender` for each token holder and the number of tokens that she is allowed to spend on behalf of the token holder. |
| `approvedContracts` | `Map ByStr20 Bool` | Empty | Each key in this map represents `approvedContract` no matter what value it is mapped to. |

### Procedures

| Name | Params | Description |
|--|--|--|
| `mint` | `to : ByStr20, value : Uint128` | Mint `value` tokens on `to` account. |
| `burnAll` | `from : ByStr20` | Burn all tokens on `from` account. Used in `onFundraisingEnd` transition. |
| `transferToDevProc` | | Mint to `devAcc` accumulated at the moment development fund share. Update `alreadyTransferredToDev`. |

### Transitions

#### Housekeeping Transitions

| Name | Params | Description | `_sender` | Callable when paused? |
|--|--|--|--|--|
|`transferOwnership`|`newOwner : ByStr20`|Allows the current `owner` to transfer control of the contract to a `newOwner`. | `owner` | :heavy_check_mark: |
|`updatePauser`| `newPauser : ByStr20` |  Replace the current `pauser` with the `newPauser`. | `owner` | :heavy_check_mark: |
|`updateFundraisingManager`| `newFundraisingManager : ByStr20` | Replace the current `fundraisingManager` with the `newFundraisingManager`. | `owner` | :heavy_check_mark: |
|`updateDevAccChanger`| `newDevAccChanger : ByStr20` | Replace the current `devAccChanger` with `newDevAccChanger` | `devAccChanger` | :heavy_check_mark: |
|`updateContractApprover`| `newContractApprover : ByStr20` | Set new `contractApprover` with `newContractApprover` value. | `owner` | :heavy_check_mark: |
|`approveContract`| `address : ByStr20` | Approve `address` for minting/burning of tokens. | `contractApprover` | :heavy_check_mark: |
|`revokeContract`| `address : ByStr20` | Revoke previously approved `address` | `contractApprover` | :heavy_check_mark: |

#### Fundraising-related Transitions

| Name | Params | Description | `_sender` | Callable when paused? |
|--|--|--|--|--|
| `transferToDev` | | Call `transferToDev` procedure. Fail if `devAcc` is `None` or if `fundrInProgress` is `False`. | any | :heavy_check_mark: |
| `onFundraisingStart` | `amount : Uint128` | Set `fundrInProgress` to `True`. Mint `amount` of tokens to `fundrContract` | `fundrContract` | :heavy_check_mark: |
| `onFundraisingEnd` | | Mint to `devAcc` the rest of development fund share. Set `fundrInProgress` to `False`. Burn the rest of DPS tokens on `fundrContract`. | `fundrContract` | :heavy_check_mark: |
|`connectFundraisingContract`|`address : ByStr20`| Set new address of fundraising contract, send to this address message `onFundrConnect`. Works only when `fundrInProcess` is `False`. | `fundraisingManager` | :heavy_check_mark: |
| `changeDevAcc` | `newDevAcc : ByStr20` | Replace the current `devAcc` to `newDevAcc` | `devAccChanger` | :heavy_check_mark: |

#### Pause-related Transitions

| Name | Params | Description | `_sender` | Callable when paused? |
|--|--|--|--|--|
|`pause`|  | Pause the contract to temporarily stop all transfer of tokens and other operations. Only the current `pauser` can invoke this transition. | `pauser` | :heavy_check_mark: |
|`unpause`|  | Unpause the contract to re-allow all transfer of tokens and other operations. Only the current `pauser` can invoke this transition. | `pauser` | :heavy_check_mark: |

#### Token Transitions

| Name | Params | Description | `_sender` | Callable when paused? |
|--|--|--|--|--|
|`BalanceOf`| `tokenOwner : ByStr20` | Transition to learn balance of some token owner. Sends back message `BalanceOfResponse` with fields `address` and `balance`. | any | :heavy_check_mark: |
|`Approve`| `spender : ByStr20, value : Uint128` | Approve a `spender` to spend on behalf of a token holder (`_sender`) upto the `value` amount. | any | :x: |
|`Transfer`| `to : ByStr20, value : Uint128, code : Uint32` | Transfer `value` number of tokens from the `_sender` to the `to` address. | `from` | :x: |
|`TransferFrom`| `from : ByStr20, to : ByStr20, value : Uint128, code : Uint32` | Transfer `value` number of tokens on behalf of the `from` to the `to` address. | any | :x: |

#### Minting-related Transitions

| Name | Params | Description | `_sender` | Callable when paused? |
|--|--|--|--|--|
|`burn`| `value : Uint128` | Burn `value` number of tokens on address of `_sender`. | `owner` or `approvedContract` | <center>:x:</center>  |
