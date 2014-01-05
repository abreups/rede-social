#!/bin/bash
sudo apt-get update
sudo apt-get install -y g++ curl libssl-dev apache2-utils make
wget http://nodejs.org/dist/v0.10.24/node-v0.10.24.tar.gz
tar -xf node-v0.10.24.tar.gz
cd node-v0.10.24
./configure
make
make install
which node
node -v
curl http://npmjs.org/install.sh | sh
which npm
npm -v

