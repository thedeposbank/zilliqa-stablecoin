# Fundraising contract documentation

This contract is used to collect system coins (ZIL) in exchange for DPS tokens.
After deployment, DPS contract's owner mints enough amount of DPS tokens to fundraising contract address.
After fundraising, contract owner burns rest of DPS tokens.

### Roles and privileges

| Name | Description and privilege |
|--|--|
| `init_owner`      | Initial owner of the contract. Most other roles are initialised with this value |
| `owner`           | Current owner, initialised with `init_owner`. Admin account, has permission for critical actions like changing other roles executors |
| `dev_fund`        | Development fund address. For each sold DPS token, `dev_ratio` DPS tokens are sent to `dev_fund`. |
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
|`dev_fund`     | `ByStr20` | Development fund address is known by the time of fundraising contract deployment. |
|`dev_ratio`    | `Uint128` | Ratio of dev share DPS tokens amount to all sold DPS amount.

### Mutable fields

The table below presents the mutable fields of the contract and their initial values.

#### Simple fields

| Name | Type | Initial Value |Description |
|--|--|--|--|
|`owner`        | `ByStr20` | `init_owner`  | Current `owner` of the contract. |
|`withdrawer`   | `ByStr20` | `init_withdrawer` | Current `withdrawer` in the contract. |
|`paused`       | `Bool`    | `False`       | Keeps track of whether the contract is current paused or not. `True` means the contract is paused. |
|`dps_sold`     | `Uint128` | `Uint128 0`  | Amount of DPS sold by the moment. |
|`transferred_to_dev`| `Uint128` | `Uint128 0` | Amount already transferred to `dev_fund` |

#### Maps

| Name | Type | Initial Value |Description |
|--|--|--|--|
|`whitelist`          | `Map ByStr20 Uint128` | Empty | If fundraising is not public, only address from this map are allowed to do exchange transfers. |

### Transitions

#### Fundrasing Transitions
| Name | Params | Description |
|--|--|--|--|
|`buyDPS`| `-` | Swap `_amount` of ZIL to appropriate amount of DPS. `_sender` must be in `whitelist` map. |
|`withdraw`| `to : ByStr20` | Transfer all collected funds to given address. `_sender` must be `withdrawer`. When fundraising contract is deployed, there is no known target address for collected funds, so we need this transition to manually point the target address. |
|`transferToDev`| `-` | Transfer dev share of DPS to `dev_fund` |

#### Housekeeping Transitions

| Name | Params | Description |
|--|--|--|--|
|`whitelist`| `address : ByStr20` | Add `address` to whitelist. `_sender` must be `owner`. |
|`unWhitelist`| `address : ByStr20` | Remove `address` from whitelist. `_sender` must be `owner`. |
|`transferOwnership`|`newOwner : ByStr20`|Allows the current `owner` to transfer control of the contract to a `newOwner`. <br>  :warning: **Note:** `_sender` must be the current `owner` in the contract.  |
|`updateWithdrawer`| `to : ByStr20` | Replace the current `withdrawer` with the `newWithdrawer`. <br>  :warning: **Note:** `_sender` must be the current `withdrawer` in the contract. |
