#!/bin/bash
truffle migrate --network node --reset > /dev/null &
sleep 1
set -x
truffle migrate --network node --reset