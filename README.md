# Depos Technologies

Depos creates a stablecoin, which is collaralized with tokenized debts and obligations. This approach combines best of fiat-collateralized and crypto-collateralized approaches: it is fully transparent on the one hand and infinitaly scalable on the other. On top of that it has proven and robust bank-like business model and built-in on-chain liquidity support for stablecoin holders.

This is done alongside with the dBonds protocol of debt tokenization. For more info please visit [dBonds protocol repo](https://github.com/thedeposbank/zilliqa-dbonds)

## System structure overview
**1.** On the one side `Depos DAO` holds collateral which consists of to parts:
  * Major part is tokenized debts, which is quite stable in value and produces predictable fixed income to the system as the `bond_issuers` who put them inside pay interest in stablecoins (say, 2% apr) to the contract.
  * Minor part consists of liquid crypto (ex. `ZIL`) which has some volatility, though that doesn't affect the system much as it is the minor part of the whole pie. Minor part serves as an easy in-and-out from stablecoin to other crypto for `user` and in analogy with a bank can be compared with cash on bank balance, which any card-holder can deposit/withdraw within some limits. This part brings income to the system via decentralized market-making.

**2.** On the other side there is stablecoin supply.
From time to time system makes sure, that total supply of stablecoins equals to the total value of collateral, so that every stablecoin is 100% collateralized with valuable on-chain assets. To absorb all volatility/losses/revenue contract has its own stablecoin `capital`, which is originated and recapitalised by selling utility and governance `DPS` token.

## System design overview
The system is designed as follows
- There are two core token contracts now: `DUSD contract` for USD-pegged stablecoin token (more currencies in future) and `DPS contract` for utility and governance token. Both follow standards with minor extentions for governance. Both cannot be changed. Both can be called by appropriate parties, none of them calls any transitions from the outside of the contract itself.
- `DUSD contract` also holds all tokens owned by the `Depos DAO`: dBond tokens, liquid tokens (ex. `ZIL`, more in future) and internal `capital` in stablecoins. This funds can be transfered or used only by internal calls of other smart contracts and are out of control of any third party including `dev team`.
- All external calls and interactions with the system are done via `proxy contract`. The goal of this contract is to be publicly available and translate requests to the appropriate private contracts of the system with the logic implementation.
- Logic implementation is divided to several independent contracts and can be upated with time. Each contract can be called only either by `proxy contract` or by other logic implementation ontract.
- Internal `capital` of the `Depos DAO` can be recapitalized by additional public or private sale of utility and governance `DPS` tokens. For every recapitalization a new `fundrasing contract` is published which accepts payments in exchange of `DPS` tokens according to the rules, terms and prices difened by this contract. That leads to the inclrease of the total supply of `DPS` tokens.
- On the first stage governance and ownership belongs to the corresponding admin accounts. In future this functions will be passed to the decentralized governance for `DPS` holders to decide changes of the system.

### `Capital` and `DPS`
All system revenues/losses are absorbed by the `capital`, so that new stablecoins are either issued to the `capital` or are burnt from it depending on the case. `DPS` has `nominal price` which is simply a share of `capital` for one `DPS` token. `DPS` token can be used at nominal price for `[TODO: WHAT ARE THE UTILITY FUNCTIONS OF DPS WITH NOMINAL PRICE]`, though the `market price` of `DPS` is supposed to reflect all future dicounted cashflows (interest, market-making, future FX services etc.) and expected to be much higher than `nominal price`. In case system experiences lack of `capital` to absorb sudden loss and keep every stablecoin collateralized, new `DPS` tokens are issued and sold to the market to replenish the `capital`, given that in long-term system is proven to be profitable.



## What functionallity is supported

### How stablecoins are minted/redeemed
**1.** `user` can mint/redeem stablecoins directly via smartcontract in exchange for supported liquid crypto 1:1 at current market rate. `user` can consider it as a direct decentralized one-call trade with the contract. As the value of collateral changes, total stablecoin supply also changes.

Notes: 
  * to avoid oracle front-running trade is made within next block after registering.
  * such a trade can be declined if it brings the system out of correct risk-management state (ex. order is too large or system ran out of the liquidity)

**2.** `bond_issuer` can buy/sell stablecoins
for pre-authorized tokenized debt (see [dBonds](https://github.com/thedeposbank/zilliqa-dbonds)) at currrent debt-internal price. Only available for tokenized debts originated by the `bond_issuer` themselves. As the value of collateral changes, total stablecoin supply also changes.

Notes:
  * such a trade can be declined if it brings the system out of correct risk-management state (ex. liquidity pool is going to be relativaly too large or too low to the whole supply)

**3.** Collateral in form of either liquid crypto or tokenized debts can be deposited in order to replenish `capital` with new-minted `DUSD` stablecoins (collateral is stored, stablecoins are issued to the `capital`).

Notes: 
  * If the `DPS` token is spent as utility token, it does not affect the stablecoin supply but may change `nominal price` of `DPS` as the supply of `DPS` tokens may change.

**4.** When the collateral value changes and the stablecoin supply adjustment is triggered, system mints/burns to/from capital appropriate amount of stablecoins to maintain 1:1 collaterization.


### Support of tokenized debts lifecycle

**1.** Approve tokenized debt token contract

**2.** If the tokenized debt is paid off, contract can claim the payment back (see [dBonds](https://github.com/thedeposbank/zilliqa-dbonds))

### Governance and housekeeping

**1.** Pause/unpause contract

**2.** Blacklist/unblacklist address

**3.** Have different premitions for different administrative roles

**4.** Have account to manage permitions for roles

### Support of `DPS` utility functions

**1.** In order to have some amount of tokenized debt sold to the contract ` bond_issuer` has to stake appropriate amount of `DPS` inside the contract.

**2.** `DPS` can be used within [dBonds](https://github.com/thedeposbank/zilliqa-dbonds) protocol to pay debt

### Suport of `DPS` governance functions (in future)

**1.** Approve/decline governance roles substitution

**2.** Approve/decline contract upgrades

**3.** Approve/decline system parameters upgrade


