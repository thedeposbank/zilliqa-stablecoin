# Unit tests for withdrawer contract

* SubmitTransaction
    * NonOwnerCannotSubmit
    * Ok
* SignTransaction
    * NonOwnerCannotSign
    * UnknownTransactionId
    * Ok
* ExecuteTransaction
    * UnknownTransactionId
    * SenderMayNotExecute
    * NoSignatureListFound
    * NotEnoughSignatures
    * Ok
* RevokeSignature
    * NotAlreadySigned
    * IncorrectSignatureCount, no count at all
    * IncorrectSignatureCount, count is zero
    * Ok

### Note on addresses in tests

addresses starting with:

* 0x0 - addresses for roles
    * `0x0000000000000000000000000000000000000001` - `owners_list[0]`
    * `0x0000000000000000000000000000000000000002` - `owners_list[1]`
    * `0x0000000000000000000000000000000000000003` - `owners_list[2]`
* 0x1 - addresses for contracts
    * `0x1000000000000000000000000000000000000001` - `fundraising`
* 0x2 - for external users
    * `0x2000000000000000000000000000000000000001` - `recipient`
