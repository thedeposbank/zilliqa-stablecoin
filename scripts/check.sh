#!/bin/bash

. ./scripts/functions.sh

function check() {
	title "checking $1"
	scilla-checker -gaslimit 8000 $1 
}

if [ -n "$1" ] ; then
	check $1/*.scilla
else
	for i in DPS_token FundrContract Multisig_withdrawer
	do
		check $i/*.scilla
	done
fi
