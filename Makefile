all: check test

test:
	./scripts/easyrun.sh DPS_token all
	./scripts/easyrun.sh FundrContract all
	./scripts/easyrun.sh Multisig_withdrawer all

check:
	./scripts/check.sh
