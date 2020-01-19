all: check test

test:
	./scripts/easyrun.sh DPS_token all
	./scripts/easyrun.sh FundrContract all

check:
	./scripts/check.sh
