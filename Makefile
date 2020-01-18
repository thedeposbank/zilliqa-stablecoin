all: check test

test:
	./scripts/easyrun.sh DPS_token all

check:
	./scripts/check.sh
