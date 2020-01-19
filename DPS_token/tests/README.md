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
        * no fundraising contract
        * dev account is defined and fundraising in process, `to_transfer` > 0
        * dev account is defined and fundraising in process, `to_transfer` <= 0
    * `onFundraisingStart`
        * no fundraising contract
        * called not by `fundrContract`
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
        * called by `owner`, contract is not paused, balance is enough
        * called by approved address, contract is not paused, balance is enough

### Note on addresses in tests

addresses starting with:

* 0x0 - addresses for roles
    * `0x0000000000000000000000000000000000000001` - `init_owner`
    * `0x0000000000000000000000000000000000000002` - `owner`
    * `0x0000000000000000000000000000000000000003` - `pauser`
    * `0x0000000000000000000000000000000000000004` - `approvedSpender`
    * `0x0000000000000000000000000000000000000005` - `fundraisingManager`
    * `0x0000000000000000000000000000000000000006` - `devAcc`
    * `0x0000000000000000000000000000000000000007` - `devAccChanger`
    * `0x0000000000000000000000000000000000000008` - `contractApprover`
* 0x1 - addresses for contracts
    * `0x1000000000000000000000000000000000000001` - `fundrContract`
    * `0x1000000000000000000000000000000000000002` - `approvedContract`
* 0x2 - for external users
