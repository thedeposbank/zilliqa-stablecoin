# Unit tests for utility token contract

* Housekeeping

    * `transferOwnership`
        * by `owner`
        * by someone else
    * `updatePauser`
        * by `owner`
        * by someone else
    * `updateFundraisingManager`
        * by `owner`
        * by someone else
    * `updateDevAccChanger`
        * by `devAccChanger`
        * by someone else
    * `updateContractApprover`
        * by `owner`
        * by someone else
    * `approveContract`
        * by `contractApprover`
        * by someone else
    * `revokeContract`
        * by `contractApprover`
        * by someone else

* Fundraising-related

    * `transferToDev`
        * no dev account
        * fundraising is not in progress
        * dev account is defined and fundraising in process, `to_transfer` > 0
        * dev account is defined and fundraising in process, `to_transfer` <= 0
    * `onFundraisingStart`
        * no fundraising contract
        * called by someone except `fundrContract`
        * called by `fundrContract`, fundraising in progress
        * called by `fundrContract`, fundraising not in progress
    * `onFundraisingEnd`
        * no fundraising contract
        * called not by `fundrContract`
        * called by `fundrContract`, fundraising not in progress
        * called by `fundrContract`, fundraising in progress
    * `connectFundraisingContract`
        * called not by `fundraisingManager`
        * called by `fundraisingManager`, fundraising in progress
        * called by `fundraisingManager`, fundraising not in progress
    * `changeDevAcc`
        * by `devAccChanger`
        * by someone else

* Pause-related

    * `pause`
        * by `pauser`
        * by someone else
    * `unpause`
        * by `pauser`
        * by someone else

* Minting-related

    * `burn`
        * called neither by `owner` nor by any approved address
        * called by `owner`, contract is paused
        * called by `owner`, contract is not paused, balance is not enough
        * called by approved address, contract is not paused, balance in not enough
        * called by `owner`, contract is not paused, balance is enough
