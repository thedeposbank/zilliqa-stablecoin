## Fundrasing testing scenario

#### First scenario -- sold out
|`Caller`|`Transition/action`|`Expected behaviour`|
|--|--|--|
|`-`|`dps_contract -> deployment`|`-`|
|`-`|`mltsg_withdrawer -> deployment`|`-`|
|`-`|`fundr_contract -> deployment`|`-`|
|`owner`|`dps_contract -> changeDevAcc`| set development account address |
|`fundrasingManager`|`dps_contract-> connectFundraisingContract`|fundrasing started, `fundr_contract` receives `DPS` tokens for sale|
|`owner`|`fundr_contract -> whitelist`|an external `address1` is whitelisted for purchase|
|`address1`|`fundr_contract -> buyDPS`| `DPS` tokens are bought in exchange of `ZIL`, some `DPS` left for sale|
|`address1`|`fundr_contract -> buyDPS`| More `ZIL` is sent than total left `DPS` cost. `address1` receives change back in `ZIL`|
|`mltsg_withdrawer`| `fundr_contract -> withdraw` | `ZIL` is transferred to other address |
|`owner`| `fundr_contract -> endFundrasing` | Notification is sent to `dps_contract`, fundrasing is over. Some `DPS` are minted to `dev_account`. |

#### Second scenario -- early stop
|`Caller`|`Transition/action`|`Expected behaviour`|
|--|--|--|
|`-`|`dps_contract -> deployment`|`-`|
|`-`|`mltsg_withdrawer -> deployment`|`-`|
|`-`|`fundr_contract -> deployment`|`-`|
|`fundrasingManager`|`dps_contract-> connectFundraisingContract`|fundrasing started, `fundr_contract` receives `DPS` tokens for sale|
|`owner`|`fundr_contract -> whitelist`|an external `address1` is whitelisted for purchase|
|`address1`|`fundr_contract -> buyDPS`| `DPS` tokens are bought in exchange of `ZIL`, some `DPS` left for sale|
|`owner`| `fundr_contract -> endFundrasing` | Notification is sent to `dps_contract`, fundrasing is over. The `DPS` leftovers are burnt. Some `DPS` are minted to `dev_account`. |
|`mltsg_withdrawer`| `fundr_contract -> withdraw` | `mltsg_withdrawer` waits till the `end_block` of the fundrasing and then withdraw `ZIL` on other account |