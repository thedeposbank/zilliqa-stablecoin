# Unit tests for utility token contract

1. Housekeeping

  1. `transferOwnership`
    1. by `owner`
    1. by someone else
  1. `updatePauser`
    1. by `owner`
    1. by someone else
  1. `updateFundraisingManager`
    1. by `owner`
    1. by someone else
  1. `updateDevAccChanger`
    1. by `devAccChanger`
    1. by someone else
  1. `updateContractApprover`
    1. by `owner`
    1. by someone else
  1. `approveContract`
    1. by `contractApprover`
    1. by someone else
  1. `revokeContract`
    1. by `contractApprover`
    1. by someone else

1. Fundraising-related

  1. `transferToDev`
    1. no dev account
    1. fundraising is not in progress
    1. dev account is defined and fundraising in process, `to_transfer` > 0
    1. dev account is defined and fundraising in process, `to_transfer` <= 0
  1. `onFundraisingStart`
    1. no fundraising contract
    1. called by someone except `fundrContract`
    1. called by `fundrContract`, fundraising in progress
    1. called by `fundrContract`, fundraising not in progress
  1. `onFundraisingEnd`
    1. no fundraising contract
    1. called not by `fundrContract`
    1. called by `fundrContract`, fundraising not in progress
    1. called by `fundrContract`, fundraising in progress
  1. `connectFundraisingContract`
    1. called not by `fundraisingManager`
    1. called by `fundraisingManager`, fundraising in progress
    1. called by `fundraisingManager`, fundraising not in progress
  1. `changeDevAcc`
    1. by `devAccChanger`
    1. by someone else

1. Pause-related

  1. `pause`
    1. by `pauser`
    1. by someone else
  1. `unpause`
    1. by `pauser`
    1. by someone else

1. Minting-related

  1. `burn`
    1. called neither by `owner` nor by any approved address
    1. called by `owner`, contract is paused
    1. called by `owner`, contract is not paused, balance is not enough
    1. called by approved address, contract is not paused, balance in not enough
    1. called by `owner`, contract is not paused, balance is enough
