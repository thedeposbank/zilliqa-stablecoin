# Fundraising contract documentation

This contract is used to collect system coins (ZIL) in exchange for DPS tokens.
After deployment, DPS contract's owner mints enough amount of DPS tokens to fundraising contract address.
After fundraising, contract owner burns rest of DPS tokens.

### Roles and privileges

| Name | Description and privilege |
|--|--|
| `init_owner`      | Initial owner of the contract. Most other roles are initialised with this value |
| `owner`           | Current owner, initialised with `init_owner`. Admin account, has permission for critical actions like changing other roles executors |
| `withdrawer`      | Contract/person allowed to withdraw funds and, optionally, pass this allowance to another address. |

### Immutable fields

The table below lists the parameters that are defined at the contract deployment time and hence cannot be changed later on.

| Name | Type | Description |
|--|--|--|
|`init_owner`   | `ByStr20` | The initial owner of the contract. |
|`init_withdrawer`|`ByStr20`| The initial withdrawer in the contract. |
|`dps_contract` | `ByStr20` | Address of DPS token contract. |
|`start_block`  | `BNum`    | Start block number. From this block fundraising is enabled. |
|`end_block`    | `Bnum`    | End block number. From this block fundrasing is disabled. |
|`dps_amount`   | `Uint128` | Amount of DPS to sell. |
|`dps_price`    | `Uint128` | Price for one DPS token. |
|`public`       | `Boolean` | Are fundraisng transfers are received from any address or from approved addresses only. |

### Mutable fields

The table below presents the mutable fields of the contract and their initial values.

#### Simple fields

| Name | Type | Initial Value |Description |
|--|--|--|--|
|`owner`        | `ByStr20` | `init_owner`  | Current `owner` of the contract. |
|`withdrawer`   | `ByStr20` | `init_withdrawer` | Current `withdrawer` in the contract. |
|`dps_sold`     | `Uint128` | 0             | Amount of DPS sold by the moment. |

#### Maps

| Name | Type | Initial Value |Description |
|--|--|--|--|
|`whitelist`          | `Map ByStr20 Uint128` | Empty | If fundraising is not public, only address from this map are allowed to do exchange transfers. |

### Transitions

#### Fundrasing transitions

| Name | Params | Description | `_sender` |
|--|--|--|--|
|`buyDPS`| `-` | Swap `_amount` of ZIL to appropriate amount of DPS. Available only strictly within (`start_block`, `end_block`) interval | any (whitelisted, if sale is not public)|
|`withdraw`| `to : ByStr20` | Transfer all collected funds to given address. When fundraising contract is deployed, there is no known target address for collected funds, so we need this transition to manually point the target address. | `withdrawer` |
|`onFundrConnect`|`-`|Processes notification when this contract is connected to `dps_contract` as fundrasing contract, as a responce calls `onStartFundrasing` | `dps_contract` |
| `endFundrasing` | `-` | Calls `onFundrasingEnd` transition of `dps_contract`. Might be called any time no matter block number and total amount of sold `DPS` tokens. Expected that all `DPS` balance of current contract is burnt after the call  | `owner` |

#### Housekeeping Transitions

| Name | Params | Description | `_sender` |
|--|--|--|--|
|`whitelist`| `address : ByStr20` | Add `address` to whitelist. |`owner` |
|`unWhitelist`| `address : ByStr20` | Remove `address` from whitelist.| `owner` |
|`transferOwnership`|`newOwner : ByStr20`|Allows the current `owner` to transfer control of the contract to a `newOwner` | `owner`|
|`updateWithdrawer`| `to : ByStr20` | Replace the current `withdrawer` with the `newWithdrawer`| `withdrawer`|

