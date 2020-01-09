all: check test

test:
	./scripts/easyrun.sh DPS_Token all

check:
	./scripts/check.sh
