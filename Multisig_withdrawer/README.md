# Multisig withdrawer contract documentation

This contract implements `withdrawer` role of Fundraising contract, but also may be used as unified multisig instrument to call arbitrary contract transitions with single `ByStr20` parameter.
The source code is taken mostly from `wallet_2.scilla` of test contracts in scilla repository.

### Roles and privileges

| Name | Description and privilege |
|--|--|
| `owner` | Person/contract, allowed to sign off a payment. List of owners is passed to the contract at deployment. |
| `recipient` | Recipient of withdrawal. |
| `fundraising` | Fundraising contract. |

### Custom datatypes

| Name | Type | Description |
|--|--|--|
| `Transaction` | `ByStr20 ByStr20 Uint128 String` | Describes a withdrawal transaction: call transition of a contract at some `address1`, passing `address2` as a `to` parameter, sending `amount` with some `tag`. |

### Message types to send to fundraising contract

| Tag | Params | Description |
|--|--|--|
| `withdraw` | `to : ByStr20` | Withdraw funds to specified address. |
| `updateWithdrawer` | `to : ByStr20` | Set new withdrawer address. |

### Immutable fields

The table below lists the parameters that are defined at the contract deployment time and hence cannot be changed later on.

| Name | Type | Description |
|--|--|--|
| `owners_list`         | `List ByStr20` | List of owners. |
| `required_signatures` | `Uint32`       | Number of signatures required for withdrawal. |

### Mutable fields

The table below presents the mutable fields of the contract and their initial values.

| Name | Type | Initial Value |Description |
|--|--|--|--|
| `owners`           | `Map ByStr20 Bool`  | `owners_list` | Just `owners_list` as a set. |
| `transactionCount` | `Uint32`            | 0 | Current count of withdrawals. |
| `transactions`     | `Map Uint32 Transaction` | Empty | Array of withdrawal transactions. |
| `signatures`       | `Map Uint32 (Map ByStr20 Bool)` | Empty | Collected signatures for transactions. |
| `signature_counts` | `Map Uint32 Uint32` | Empty | Running count of collected signatures for transactions. |

### Transitions

| Name | Params | Description |
|--|--|--|
| `SubmitTransaction` | `recipient : ByStr20, amount : Uint128, tag : String` | Submit a transaction for future signoff. |
| `SignTransaction`   | `transactionId : Uint32` | Sign off on an existing transaction. |
| `ExecuteTransaction` | `transactionId : Uint32` | Execute signed-off transaction. |
| `RevokeSignature` | `transactionId : Uint32` | Revoke signature of existing transaction, if it has not yet been executed. |

