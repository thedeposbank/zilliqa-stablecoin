'use strict';

const accounts = {
	owner: {
		privateKey: '401ae450de182f5c01b33db86a073e4cc10d02aa5a4999a66260b2ef41ae9ff7',
		address: '0xC260F2C046eC08A51bB1Cc9D1fd3f97CFF189617',
		bech32Address: 'zil1cfs09szxasy22xa3ejw3l5le0nl339sh76905p'
	},
	fundraisingManager: {
		privateKey: '83df11302a8a14662784e6c1ecf16972ea3e6dd48a2d261b06f035339c22258a',
		address: '0x010Fc1CD4f7DfCB6D2865aFe7A72f35dd64aA12B',
		bech32Address: 'zil1qy8urn200h7td55xttl85uhnthty4gft5c7sky'
	},
	buyer: {
		privateKey: '0d19351439e593a1aa142db61591f0e83f9cc6b97d3ef4466bc9ed0e4d81dc25',
		address: '0x86FD18E650b07053F538D0Ac55F18D8e33604042',
		bech32Address: 'zil1sm733ejskpc98afc6zk9tuvd3cekqszzwxcvde'
	},
	signer1: {
		privateKey: 'f9c2f376e183d0eb010cc473805807df3fbcd67aa3928ad346cc138672f09c36',
		address: '0x49bEa10843F17E1D91f4793dA3a46c0038a825BA',
		bech32Address: 'zil1fxl2zzzr79lpmy050y768frvqqu2sfd6kwnyj7'
	},
	signer2: {
		privateKey: 'd21fb21eb992e6ecbf38d7c91c1abc76c296da3f8694b1379a1a443b27d5641c',
		address: '0xA66450AA4e7217436E285C1c1E2D5153A1F425A2',
		bech32Address: 'zil15ej9p2jwwgt5xm3gtswput232wslgfdzfh2udx'
	},
	signer3: {
		privateKey: 'e1b5b216f4995e529cfa609798a02638ac57af4d28a6c8da1a9ad3e87e3e4de2',
		address: '0x12d9387AE8942a90086782Ed8f272d68F75Cd7f1',
		bech32Address: 'zil1ztvns7hgjs4fqzr8stkc7feddrm4e4l300u32l'
	}
};

const contractAddresses = require('./contract_addrs.json');

const config = {
	accounts,
	deployer: accounts.owner,
	apiUrl: 'https://dev-api.zilliqa.com/',
	chainId: 333,
	dbondStates: [
		'not issued',
		'frozen till verification',
		'issued',
		'expired, paid off',
		'expired, tech. defaulted',
		'expired, liquidated',
		'expired, defaulted'
	],
	transferCodes: [
		'simple transfer',
		'pay off',
		'liquidation',
		'dbond deposit',
		'dbond exchange'
	],
	balances: [
		{
			name: 'buyer',
			address: accounts.buyer.address,
			value: null
		},
		{
			name: 'fundrContract',
			address: contractAddresses.fundrContract,
			value: null
		},
		{
			name: 'devAcc',
			address: accounts.signer2.address,
			value: null
		},
		{
			name: 'final',
			address: accounts.signer1.address,
			value: null
		}
	],
	contracts: {
		dpsContract: {
			fileName: '../DPS_token/DPS_token.scilla',
			address: contractAddresses.dpsContract,
			init: [
				{
					vname : "_scilla_version",
					type : "Uint32",
					value : "0"
				},
				{
					vname : "name",
					type : "String",
					value : "Utility token"
				},
				{
					vname : "symbol",
					type : "String",
					value : "DPS"
				},
				{
					vname : "decimals",
					type : "Uint32",
					value : "6"
				},
				{
					vname : "init_owner",
					type : "ByStr20", 
					value : accounts.owner.address
				}
			],
			transitions: {
				transferOwnership: {
					newOwner: 'ByStr20'
				},
				updatePauser: {
					newPauser: 'ByStr20'
				},
				updateFundraisingManager: {
					newFundraisingManager: 'ByStr20'
				},
				updateDevAccChanger: {
					newDevAccChanger: 'ByStr20'
				},
				updateContractApprover: {
					newContractApprover: 'ByStr20'
				},
				approveContract: {
					address: 'ByStr20'
				},
				revokeContract: {
					address: 'ByStr20'
				},
				transferToDev: {},
				connectFundraisingContract: {
					address: 'ByStr20'
				},
				changeDevAcc: {
					newDevAcc: 'ByStr20'
				},
				pause: {},
				unpause: {},
				Approve: {
					spender: 'ByStr20',
					value: 'Uint128'
				},
				Transfer: {
					to: 'ByStr20',
					value: 'Uint128',
					code: 'Uint32'
				},
				TransferFrom: {
					from: 'ByStr20',
					to: 'ByStr20',
					value: 'Uint128',
					code: 'Uint32'
				},
				burn: {
					value: 'Uint128'
				}
			},
			state: {}
		},
		fundrContract: {
			fileName: '../FundrContract/FundrContract.scilla',
			address: contractAddresses.fundrContract,
			init:
			[
				{ 
					vname : "_scilla_version",
					type : "Uint32",
					value : "0"
				},
				{
					vname : "init_owner",
					type : "ByStr20", 
					value : accounts.owner.address
				},
				{
					vname : "init_withdrawer",
					type : "ByStr20" ,
					value : contractAddresses.wdrContract
				},
				{
					vname : "dps_contract",
					type : "ByStr20",
					value : contractAddresses.dpsContract
				},
				{
					vname: "start_block",
					type: "BNum",
					value: "1080000"
				},
				{
					vname: "end_block",
					type: "BNum",
					value: "1100000"
				},
				{
					vname: "dps_amount",
					type: "Uint128",
					value: "50000000"      // 50 DPS
				},
				{
					vname: "dps_price",
					type: "Uint128",
					value: "1000000"       // 1 ZIL
				},
				{
					vname: "price_decimals",
					type: "Uint32",
					value: "6"
				},
				{
					vname: "public",
					type: "Bool",
					value: { constructor: "False", argtypes: [], arguments: [] }
				}
			],
			transitions: {
				buyDPS: {},
				withdraw: { to: 'ByStr20' },
				endFundraising: {},
				whitelist: { address: 'ByStr20' },
				unWhitelist: { address: 'ByStr20' },
				transferOwnership: { newOwner: 'ByStr20' },
				updateWithdrawer: { to: 'ByStr20' }
			},
			state: {}
		},
		wdrContract: {
			fileName: '../Multisig_withdrawer/Multisig_withdrawer.scilla',
			address: contractAddresses.wdrContract,
			init:
			[
				{
					vname : "_scilla_version",
					type : "Uint32",
					value : "0"
				},
				{
					vname : "owners_list",
					type : "List ByStr20",
					value : {
						constructor : "Cons",
						argtypes    : [ "ByStr20" ],
						arguments   : [
							accounts.signer1.address,
							{
								constructor : "Cons",
								argtypes    : [ "ByStr20" ],
								arguments   : [
									accounts.signer2.address,
									{
										constructor : "Cons",
										argtypes    : [ "ByStr20" ],
										arguments   : [
											accounts.signer3.address,
											{
												constructor : "Nil",
												argtypes    : [ "ByStr20" ],
												arguments   : []
											}
										]
									}
								]
							}
						]
					}
				},
				{
					vname : "required_signatures",
					type : "Uint32",
					value : "2"
				}
			],
			transitions: {
				SubmitTransaction: {
					wallet_contract: 'ByStr20',
					recipient: 'ByStr20',
					amount: 'Uint128',
					tag: 'String'
				},
				SignTransaction:    { transactionId: 'Uint32' },
				ExecuteTransaction: { transactionId: 'Uint32' },
				RevokeSignature:    { transactionId: 'Uint32' }
			},
			state: {}
		}
	}
};

module.exports = config;
