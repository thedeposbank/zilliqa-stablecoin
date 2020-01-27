## Fundrasing testing scenario

#### First scenario -- sold out
|`Caller`|`Transition/action`|`Expected behaviour`|
|--|--|--|
|`-`|`dps_contract -> deployment`|`-`|
|`-`|`mltsg_withdrawer -> deployment`|`-`|
|`-`|`fundr_contract -> deployment`|`-`|
|`owner`|`dps_contract -> changeDevAcc`| set development account address |
|`owner`|`dps_contract -> updateFundraisingManager`| set fundraising manager address |
|`fundrasingManager`|`dps_contract-> connectFundraisingContract`|fundrasing started, `fundr_contract` receives `DPS` tokens for sale|
|`owner`|`fundr_contract -> whitelist`|an external `address1` is whitelisted for purchase|
|`address1`|`fundr_contract -> buyDPS`| `DPS` tokens are bought in exchange of `ZIL`, some `DPS` left for sale|
|`address1`|`fundr_contract -> buyDPS`| More `ZIL` is sent than total left `DPS` cost. `address1` receives change back in `ZIL`|
|`signer1`|`mltsg_withdrawer -> SubmitTransaction`| `signer1` submits transaction for calling `fundr_contract -> withdraw` |
|`signer2`|`mltsg_withdrawer -> SignTransaction`| `signer2` signs transaction |
|`signer1`|`mltsg_withdrawer -> ExecuteTransaction`| with 2/3 signatures transaction can be executed, so `signer1` intiates execution of `fundr_contract -> withdraw`, and raised ZILs are withdrawed from fundraising contract |
|`owner`| `fundr_contract -> endFundrasing` | Notification is sent to `dps_contract`, fundrasing is over. Some `DPS` are minted to `dev_account`. |

#### Second scenario -- early stop
|`Caller`|`Transition/action`|`Expected behaviour`|
|--|--|--|
|`-`|`dps_contract -> deployment`|`-`|
|`-`|`mltsg_withdrawer -> deployment`|`-`|
|`-`|`fundr_contract -> deployment`|`-`|
|`owner`|`dps_contract -> changeDevAcc`| set development account address |
|`owner`|`dps_contract -> updateFundraisingManager`| set fundraising manager address |
|`fundrasingManager`|`dps_contract-> connectFundraisingContract`|fundrasing started, `fundr_contract` receives `DPS` tokens for sale|
|`owner`|`fundr_contract -> whitelist`|an external `address1` is whitelisted for purchase|
|`address1`|`fundr_contract -> buyDPS`| `DPS` tokens are bought in exchange of `ZIL`, some `DPS` left for sale|
|`owner`| `fundr_contract -> endFundrasing` | Notification is sent to `dps_contract`, fundrasing is over. The `DPS` leftovers are burnt. Some `DPS` are minted to `dev_account`. |
|`mltsg_withdrawer`| `fundr_contract -> withdraw` | `mltsg_withdrawer` waits till the `end_block` of the fundrasing and then withdraw `ZIL` on other account |
|`signer1`|`mltsg_withdrawer -> SubmitTransaction`| `signer1` submits transaction for calling `fundr_contract -> withdraw` |
|`signer2`|`mltsg_withdrawer -> SignTransaction`| `signer2` signs transaction |
|`signer1`|`mltsg_withdrawer -> ExecuteTransaction`| with 2/3 signatures transaction can be executed, so `signer1` waits till the `end_block` of the fundrasing and intiates execution of `fundr_contract -> withdraw`. Raised ZILs are withdrawed from fundraising contract |
