# Fundraising contract documentation

This contract is used to collect system coins in exchange for DPS tokens.

### Roles and privileges

| Name | Description and privilege |
|--|--|
| `init_owner`      | Initial owner of the contract. Most other roles are initialised with this value |
| `owner`           | Current owner, initialised with `init_owner`. Admin account, has permission for critical actions like changing other roles executors |
| `pauser`          | Can pause/unpause contract |
|`approvedSpender`  | A token holder can designate a certain address to send up to a certain number of tokens on its behalf. These addresses will be called `approvedSpender`.  |

### Immutable fields

The table below lists the parameters that are defined at the contract deployment time and hence cannot be changed later on.

| Name | Type | Description |
|--|--|--|
|`init_owner`   | `ByStr20` | The initial owner of the contract. |
|`dps_contract` | `ByStr20` | Address of DPS token contract. |
|`start_block`  | `BNum`    | Start block number. From this block fundraising is enabled. |
|`end_block`    | `Bnum`    | End block number. From this block fundrasing is disabled. |
|`dps_amount`   | `Uint128` | Amount of DPS to sell. |
|`public`       | `Boolean` | Are fundraisng transfers are received from any address or from approved addresses only. |

### Mutable fields

The table below presents the mutable fields of the contract and their initial values.

#### Simple fields

| Name | Type | Initial Value |Description |
|--|--|--|--|
|`owner`        | `ByStr20` | `init_owner`  | Current `owner` of the contract. |
|`pauser`       | `ByStr20` | `init_owner`  | Current `pauser` in the contract. |
|`paused`       | `Bool`    | `False`       | Keeps track of whether the contract is current paused or not. `True` means the contract is paused. |

#### Maps

| Name | Type | Initial Value |Description |
|--|--|--|--|
|`whitelist`          | `Map ByStr20 Uint128` | Empty | If fundraising is not public, only address from this map are allowed to do exchange transfers. |
