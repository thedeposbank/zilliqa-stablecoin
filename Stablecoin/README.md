# Depos Technologies

Depos creates a stablecoin, which is collaralized with tokenized debts and obligations. This approach combines best of fiat-collateralized and crypto-collateralized approaches: it is fully transparent on the one hand and infinitaly scalable on the other. On top of that it has proven and robust bank-like business model and built-in on-chain liquidity support for stablecoin holders.

For more info on tokenized debt please visit [dBonds protocol repo](https://github.com/thedeposbank/zilliqa-dbonds)

## System structure overview
**1.** On the one side contract holds collateral which consists of to parts:
  * Major part is tokenized debts, which is quite stable in value and produces predictable fixed income to the system as the `Issuers` who put them inside pay interest in stablecoins (say, 2% apr) to the contract.
  * Minor part consists of liquid crypto (ex. `ZIL`) which has some volatility, though that doesn't affect the system much as it is the minor part of the whole pie. Minor part serves as easy in-and-out for `Users` and in analogy with bank can be compared with cash on bank balance, which any card-holder can deposit/withdraw within some limits. This part brings income to the system via market-making.

**2.** On the other side there is stablecoin supply.
From time to time system makes sure, that total supply of stablecoins equals to the total value of collateral, so that every stablecoin is 100% collateralized with valuable on-chain assets. To absorb all volatility/losses/revenue contract has its own stablecoin `capital`, which is originated and maintained by selling `DPS` - utility and governance token.

## `Capital` and `DPS`
All system revenues/losses are absorbed by the `capital`, so that new stablecoins are either issued to the `capital` or are burnt from it depending on the case. `DPS` has `nominal price` which is simply a share of `capital` for one `DPS` token. `DPS` token can be used at nominal price for `[TODO: WHAT ARE THE UTILITY FUNCTIONS OF DPS WITH NOMINAL PRICE]`, though the `market price` of `DPS` is supposed to reflect all future dicounted cashflows (interest, market-making, future FX services etc.) and expected to be much higher than `nominal price`. In case system experiences lack of `capital` to absorb sudden loss and keep every stablecoin collateralized, new `DPS` tokens are issued and sold to the market to replenish the `capital`, given that in long-term system is proven to be profitable.



## What functionallity is supported in stablecoin contract

### How stablecoins are minted/redeemed
**1.** `User` can mint/redeem stablecoins directly via smartcontract in exchange for supported liquid crypto 1:1 at current market rate. `User` can consider it as a direct decentralized one-call trade with the contract. As the value of collateral changes, total stablecoin supply also changes.

Notes: 
  * to avoid oracle front-running trade is made within next block after registering.
  * such a trade can be declined by the contract if it brings the system out of correct risk-management state (ex. order is too large or contract ran out of the liquidity)

**2.** `Issuer` can buy/sell stablecoins
for pre-authorized tokenized debt at currrent debt-internal price. Only available for tokenized debts originated by the `Issuer` themselves. As the value of collateral changes, total stablecoin supply also changes.

Notes:
  * such a trade can be declined by the contract if it brings the system out of correct risk-management state (ex. order is too large or contract ran out of the liquidity)

**3.** Collateral in form of either liquid crypto or tokenized debts can be put into contract in order to replenish `capital` (collateral is put inside, stablecoins are issued to the `capital`).

Notes: 
  * If the `DPS` token is spent as utility token, it does not affect the stablecoin supply but may change `DPS` nominal price as the supply of `DPS` tokens may change.


## Support of tokenized debts lifecycle

**1.** Approve tokenized debt token contract

**2.** If the tokenized debt is paid off, contract can claim the payment back (see [dBonds protocol repo](https://github.com/thedeposbank/zilliqa-dbonds)

## Support of `DPS` utility functions

**1.** In order to have some amount of tokenized debt sold to the contract `Issuer` has to stake appropriate amount of `DPS` inside the contract.

**2.** TODO: something else?

## Governance and housekeeping

**1.** Pause/unpause contract
**2.** Blacklist/unblacklist someone
**3.** Have different premitions for different roles
**4.** Have account to manage permitions for roles

## Suport of `DPS` governance functions (in future)

**1.** Approve/decline governance roles substitution
**2.** Approve/decline contract upgrades
**3.** Approve/decline system parameters upgrade
