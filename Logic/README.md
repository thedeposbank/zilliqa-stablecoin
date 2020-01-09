# Depos logic contract documentation

### Roles and privileges

| Name | Description and privilege |
|--|--|
| `init_owner`      | Initial owner of the contract. Most other roles are initialised with this value |
| `owner`           | Current owner, initialised with `init_owner`. Admin account, has permission for critical actions like changing all other roles executors except the `gov_contract`|
| `dBond_approver`  | Can approve certain dBond token contract with its owner to hold such tokenized debt as collateral |
| `oracle_approver` | Can manage oracles for price datafeeds for liquid crypto (ex. `ZIL`) |
| `ZIL_oracle` | Can send notifications of the price change to the system |
| `dBond_issuer`    | Owner of the dBond token contract, can put/withdraw dBond tokens to the stablecoin contract in exchange of stablecoins. Needs to be explicitely approved by `dBond_approver`. Usually, there are several `dBond_issuers`, who are known partners of Depos |
|`gov_contract`| An address which can do critical system changes if collects enough votes in `DPS` tokens, ex. can change `owner`. Only `gov_contract` itself can change its value, so that it is independent of `owner`|
|`param_changer`| An address for changing parameters of the system |

### Immutable fields

The table below lists the parameters that are defined at the contract deployment time and hence cannot be changed later on.

| Name | Type | Description |
|--|--|--|
|`init_owner`   | `ByStr20` | The initial owner of the contract. |
|`dps_contract` | `ByStr20` | Address of utility token contract |
|`dusd_contract` | `ByStr20` | Address of usd-pegged stablecoin contract |

### Mutable fields

The table below presents the mutable fields of the contract and their initial values.

#### Simple fields
| Name | Type | Initial Value |Description |
|--|--|--|--|
|`owner`        | `ByStr20` | `init_owner`  | Current `owner` of the contract. |
|`gov_contract`| `ByStr20` | `init_owner`  | Current `governance_contract` of the contract. |
|`dBond_approver`| `ByStr20` | `init_owner`  | Current `dBond_approver` of the contract.|
|`oracle_approver`| `ByStr20` | `init_owner`  | Current `oracle_approver` of the contract.|
|`param_changer`| `ByStr20` | `init_owner`  | Current `oracle_approver` of the contract.|
|`ZIL_oracle`| `Bystr20` | `default oracle address` | Current `ZIL_oracle` of the contract. |
|`coll_value`| `Uint128` | `Uint128 0 ` | Reflects current total collateral value. Is updated iteratively on every change of price or balance. `DUSD` supply supposed to be equal or close to that value. |


#### Custom structures

| Structure name | Field type | Field description |
|--|--|--|
| `dBond_info`  | `Uint128` | Stablecoin contract balance of dBond tokens |
|               | `Uint128` | Most recent received dBond price |
|               | `Uint32`  | Timestamp of last price update of dBond |
|               | `ByStr20` | PayOff contract of the dBond token |

#### Maps

| Name | Type | Initial Value |Description |
|--|--|--|--|
|`valid_dBonds_info`    | `Map ByStr20 dBond_info` | Empty | Only if dBond token address is contained as a key it can be accepted as collateral. Maintaines balances of the contract for different dBonds for collateral value on-fly estimation.|
| `sys_params` | `Map ByStr20 Uint128` | Empty | Needs to be set after contract publishing |
| `dps_staked` | `Map ByStr20 Uint128` | Empty | Reflects how many `DPS` token was staked by users |



### Transitions

All the transitions in the contract can be categorized into three categories:
- _housekeeping transitions_ meant to facilitate basic admin realted tasks.
- _DPS token usage transitions_ that provide utility functions for DPS token
- _supply adjustment related transitions_ which keep the number of stablecoins issued close to the present total value of collateral
- _dBond tokens management related transitions_ which allow usage of tokenized bonds within the Depos DAO
- _`ZIL` transfer transitions_ which allow to send `ZIL` to/from system with clear purpose

Please note, that these are only direct-call transitions. All incoming transfer processing documentation is presented in next _Procedures_ block.

Each of these category of transitions are presented in further details below:

#### HouseKeeping transitions

| Name | Params | Description |
|--|--|--|
|`transferOwnership`|`newOwner : ByStr20`|Allows the current `owner` or `gov_contract` to transfer control of the contract to a `newOwner`. <br>  :warning: **Note:** `_sender` must be the current `owner` or the current `gov_account`in the contract.  |
|`updateDBondApprover`|`newDBondApprover : ByStr20`| Replace the current `dbond_approver` with the `newDBondApprover`.  <br> :warning: **Note:**  `_sender` must be the current `owner` in the contract.|
|`approveDBond`|`address : ByStr20`| Approve dbond token address. An approved address can put/withdraw dBond tokens as collateral. <br> :warning: **Note:**   `_sender` must be the current `dbond_approver` in the contract.|
|`updateOracleApprover`|`newOracleApprover : ByStr20`| Replace the current `oracle_approver` with the `newOracleApprover`.  <br> :warning: **Note:**  `_sender` must be the current `owner` in the contract.|
|`approveOracle`|`address : ByStr20, Symbol : String`| Approve price feed oracle address for a given symbol. Approved address can send messages with price updates. <br> :warning: **Note:**   `_sender` must be the current `oracle_approver` in the contract.|
|`updateGovContract`| `address : ByStr20` | Update decentralize governance contract.  <br> :warning: **Note:**   `_sender` must be the current `gov_contract` in the contract. |
|`updateParamChanger`| `address : ByStr20` | Update address that can change parameters.  <br> :warning: **Note:**   `_sender` must be the current `owner` in the contract. |
|`updateParams`| `Map String Uint128` | Set new parameters to the system.  <br> :warning: **Note:**   `_sender` must be the current `param_changer` in the contract. |
|`TransferSuccess`| `sender : ByStr20, amount : Uint128, code : Uint32` | Every time the contract receives tokens this message is sent by token contract as an incoming transfer notification. Depending on the `_sender`, `sender` and `code` it may call different procedures to manage the transfer.

#### DPS token usage transitions
 Name | Params | Description |
|--|--|--|
|`stakeDPS`| `amount : Uint128` | Stake the `amount` number of `DPS` tokens within the contract. Transition `transferFrom` of the `DPS` contract is used, so `_sender` has to make sure appropriate amount of `DPS` tokens are approved to spent for the current contract. <br> :warning: **Note:**   `DPS` token can be also staked for governance functions, but it has nothing to do with this transition and contract |
|`unstakeDPS`| `amount : Uint128` | Unstake `amount` number of previously staked `DPS` tokens. Tokens are transferred back to `_sender`. |


#### Supply adjustment related transitions
 Name | Params | Description |
|--|--|--|
|`adjustDUSD`| `-` | This is public transition. Adjust current `DUSD` supply with respect to `valid_dBonds_info` map and `ZIL` balance, i.e. after this transition execution `DUSD` supply will be equal to the total value of underlying collateral - `coll_value`. It either mints new `DUSD` tokens to `capital` or burns them from it. |
|`requestDBondPrice`| `dbond_address : ByStr20` | Sends request to the dBond token contract to update and send back the current internal price. Receives respond to `DBondPriceResponse` transition.|
|`DBondPriceResponse`| `upd_price : Uint128` | This transition is called by dBond token contract as price update notification, so that it updates price in `valid_dBonds_info` for a `key = _sender` if such key exists. |
|`ZilPriceResponse`| `new_price : Uint128` | This transition is called by `ZIL_oracle` as price change notification. |
|`requestDBondBalance`| `dbond_address : ByStr20` | Sends request to the dBond token contract about system balance from the name of logic contract. Receives respond to `BalanceOfResponse` transition.|
|`BalanceOfResponse`| `address : ByStr20, balance : Uint128` | This transition is called by dBond token contract as a respond to request of the system balance, so that it updates balance in `valid_dBonds_info` for a `key = _sender` if such key exists. |
|`emergencyAdjustment`| `-` | This is public transition. First, it updates `coll_value` field by iterating over all collateral assets prices and balances kept in `valid_dBonds_info`. Second, it calls `adjustDUSD` transition. <br> :warning: **Note:**   Before calling that transition it is recommended to update balances and prices information about all collateral. Also, keep in mind that `coll_value` is maintained iteratively on every price/balance change, so this transition serves as an emergency adjustment. |


#### dBond tokens management transitions
 Name | Params | Description |
|--|--|--|
|`approveDBond`| `dbond_address : ByStr20` | This transiton is called by `dBond_approver`. After the transition corresponding dBond tokens can be accepted by the system as the collateral for `DUSD` stablecoins. |
|`claimDBondPayment`| `dbond_address : ByStr20` | This is public transition. If dBond has been already paid off, the contract as a dBond token holder can exchange dBond tokens for the payment via dbond payoff contract represented in `valid_dBonds_info` table.

#### Exchange-related transitions
Once system collateral balance changes it is reflected in `valid_dBonds_info` map.

 Name | Params | Description |
|--|--|--|
|`getDUSDforZIL`| `-` | This is public transition. When `_sender` calls this transition, he should set the servise variable `_amount` with the value of `ZIL` he wants to send in exchange of `DUSD`. This request is registered and in the next block (to avoid price oracle frontrunning) `DUSD` will be transferred according to the current `ZIL/USD` market rate (or `ZIL` will be transferred back if the exhange is denied). <br> :warning: **Note:** System can deny such a trade in case it is out of risk management boundaries or other internal reasons written in smart contract |
|`ZILtoCapital`|`-`| This is public transition, it is used for fundrasing purposes and in case of sudden and emergance capital replenishment need. When `_sender` calls this transition, he should set the servise variable `_amount` with the value of `ZIL` he wants use to replenish `capital`. Transfered `ZIL` is accepted and new `DUSD` are issued to `capital` according to the current `ZIL/USD` market rate. <br> :warning: **Note:** Call this transition with care. By calling this transition `_sender` loses the possession of the tokens and its value. |

The following transitions follow the same pattern: these are public transitions, `transferFrom` transition is called inside, so `_sender` has to approve in advance appropriate amount of tokens to be spend by the current contract.

 Name | Params | Description |
|--|--|--|
|`getDUSDforDBond`| `amount : Uint128` |  DBond can be transferred only in order put it as collateral for new issued `DUSD`. If matches all conditions it is sent further to the system wallet. As a responce initiates mint of `DUSD` tokens with amount equal to the current price in `valid_dBonds_info` to the `sender`.  <br> :warning: **Note:** It is recommended for `sender` to call `requestDBondPrice` transition before transfering dBond to the system |
|`getDBondforDUSD`| `sender : ByStr20, amount : Uint128, code : Uint32` | `DUSD` can be transferred in order to buy back the dBond from the system at the current dBond internal price. That can only be done by the dBond contract owner. Accepted `DUSD` are burnt since underlying collateral is transferred out. <br> :warning: **Note:** It is recommended for `sender` to call `requestDBondPrice` transition before transfering `DUSD` to the system for this purpose. Also, system can deny such a trade in case it is out of risk management boundaries or other internal reasons written in smart contract. 
|`getZILforDUSD`| `sender : ByStr20, amount : Uint128, code : Uint32` | `DUSD` can be transferred to exchange it directly for `ZIL`, any `DUSD` holder can do that. This request is registered and in the next block (to avoid price oracle frontrunning) `ZIL` will be transferred according to the current `ZIL/USD` market rate. <br> :warning: **Note:** System can deny such a trade in case it is out of risk management boundaries or other internal reasons written in smart contract.  |

#### Risk management related procedures
 Name | Params | Description |
|--|--|--|
|`checkTrade`|`usd_value : Uint128, side : Uint32`| This procedure checks that current `DUSD-ZIL` exchange (or vise-versa) is valid in terms of volume and other factors. |
|`checkState`|`-`| After all calculations and changes for the current exchange is made, this procedure checks that final state of the system is correct. That is, there are some demands on the system characteristics, like relative size of `capital` or relative value of stored `ZIL` etc.
|`moveParams`| `-` |Some of the parameters from the `sys_params` are subject of internal management. That is, if system state changes it may cause change of some parameters(ex. fees).