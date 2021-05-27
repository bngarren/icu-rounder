#! /bin/sh

echo "Will search for currently running node process listening on port... or associated with react-scripts"
echo "PORT="
read port
netstat -nlp | grep :$port
ps aux | grep "react-scripts/scripts.start.js run"