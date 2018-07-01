#!/bin/bash
truffle migrate --network knode --reset > /dev/null &
sleep 1
set -x
truffle migrate --network knode --reset