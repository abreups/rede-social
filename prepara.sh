#!/bin/bash
echo "------------------------"
echo "Iniciando o processo."
echo "-> sudo apt-get update"
echo "Dando uma atualizada geral... (s/n)"
echo "------------------------"
read RESPOSTA
test "$RESPOSTA" != "s" && exit
sudo apt-get update
echo "------------------------"
echo "-> sudo apt-get install -y g++ curl libssl-dev apache2-utils make"
echo "Instala algumas bibliotecas básicas de ferramentas (s/n)"
echo "------------------------"
read RESPOSTA
test "$RESPOSTA" != "s" && exit
sudo apt-get install -y g++ curl libssl-dev apache2-utils make
echo "------------------------"
echo "-> wget http://nodejs.org/dist/v0.10.24/node-v0.10.24.tar.gz"
echo "Baixa o tar ball do node.js (s/n)"
echo "------------------------"
read RESPOSTA
test "$RESPOSTA" != "s" && exit
wget http://nodejs.org/dist/v0.10.24/node-v0.10.24.tar.gz
echo "------------------------"
echo "-> tar -xf node-v0.10.24.tar.gz"
echo "Descompacta o tar ball do node.js (s/n)"
echo "------------------------"
read RESPOSTA
test "$RESPOSTA" != "s" && exit
tar -xf node-v0.10.24.tar.gz
echo "------------------------"
echo "-> cd node-v0.10.24"
echo "-> pwd"
echo "Muda para o diretório descompactado do node.js (s/n)"
echo "------------------------"
read RESPOSTA
test "$RESPOSTA" != "s" && exit
cd node-v0.10.24
pwd
echo "------------------------"
echo "-> ./configure"
echo "Roda ./configure antes de fazer make (s/n)"
echo "------------------------"
read RESPOSTA
test "$RESPOSTA" != "s" && exit
./configure
echo "------------------------"
echo "-> make"
echo "Roda make para compilar o node.js (s/n)"
echo "------------------------"
read RESPOSTA
test "$RESPOSTA" != "s" && exit
make
echo "------------------------"
echo "-> sudo make install"
echo "Roda make install como root para instalar o node.js (s/n)"
echo "------------------------"
read RESPOSTA
test "$RESPOSTA" != "s" && exit
sudo make install
echo "------------------------"
echo "->which node"
echo "->node -v"
echo "Teste básico pra ver se o node.js instalou  (s/n)"
echo "------------------------"
read RESPOSTA
test "$RESPOSTA" != "s" && exit
which node
node -v
echo "------------------------"
echo "-> sudo curl http://npmjs.org/install.sh | sh"
echo "Baixa e roda o script para instalar o npm (s/n)"
echo "------------------------"
read RESPOSTA
test "$RESPOSTA" != "s" && exit
sudo curl http://npmjs.org/install.sh | sh
echo "------------------------"
echo "-> which npm"
echo "-> npm -v"
echo "Teste básico pra ver se o npm instalou  (s/n)"
echo "------------------------"
read RESPOSTA
test "$RESPOSTA" != "s" && exit
which npm
npm -v

