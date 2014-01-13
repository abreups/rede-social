#!/bin/bash
echo "------------------------"
echo "Deseja executar passo-a-passo (s/n)?"
echo "------------------------"
read PASSOAPASSO
if [ "$PASSOAPASSO" = "s" ]; then
	echo "------------------------"
	echo "Iniciando o processo."
	echo "-> sudo apt-get update"
	echo "Dando uma atualizada geral... (s/n)"
	echo "------------------------"
	read RESPOSTA
	test "$RESPOSTA" != "s" && exit
fi
sudo apt-get update
if [ "$PASSOAPASSO" = "s" ]; then
	echo "------------------------"
	echo "-> sudo apt-get install -y g++ curl libssl-dev apache2-utils make"
	echo "Instala algumas bibliotecas básicas de ferramentas (s/n)"
	echo "------------------------"
	read RESPOSTA
	test "$RESPOSTA" != "s" && exit
fi
sudo apt-get install -y g++ curl libssl-dev apache2-utils make
if [ "$PASSOAPASSO" = "s" ]; then
	echo "------------------------"
	echo "-> wget http://nodejs.org/dist/v0.10.24/node-v0.10.24.tar.gz"
	echo "Baixa o tar ball do node.js (s/n)"
	echo "------------------------"
	read RESPOSTA
	test "$RESPOSTA" != "s" && exit
fi
wget http://nodejs.org/dist/v0.10.24/node-v0.10.24.tar.gz
if [ "$PASSOAPASSO" = "s" ]; then
	echo "------------------------"
	echo "-> tar -xf node-v0.10.24.tar.gz"
	echo "Descompacta o tar ball do node.js (s/n)"
	echo "------------------------"
	read RESPOSTA
	test "$RESPOSTA" != "s" && exit
fi
tar -xf node-v0.10.24.tar.gz
if [ "$PASSOAPASSO" = "s" ]; then
	echo "------------------------"
	echo "-> cd node-v0.10.24"
	echo "-> pwd"
	echo "Muda para o diretório descompactado do node.js (s/n)"
	echo "------------------------"
	read RESPOSTA
	test "$RESPOSTA" != "s" && exit
fi
cd node-v0.10.24
pwd
if [ "$PASSOAPASSO" = "s" ]; then
	echo "------------------------"
	echo "-> ./configure"
	echo "Roda ./configure antes de fazer make (s/n)"
	echo "------------------------"
	read RESPOSTA
	test "$RESPOSTA" != "s" && exit
fi
./configure
if [ "$PASSOAPASSO" = "s" ]; then
	echo "------------------------"
	echo "-> make"
	echo "Roda make para compilar o node.js (s/n)"
	echo "------------------------"
	read RESPOSTA
	test "$RESPOSTA" != "s" && exit
fi
make
if [ "$PASSOAPASSO" = "s" ]; then
	echo "------------------------"
	echo "-> sudo make install"
	echo "Roda make install como root para instalar o node.js (s/n)"
	echo "------------------------"
	read RESPOSTA
	test "$RESPOSTA" != "s" && exit
fi
sudo make install
if [ "$PASSOAPASSO" = "s" ]; then
	echo "------------------------"
	echo "->which node"
	echo "->node -v"
	echo "Teste básico pra ver se o node.js instalou  (s/n)"
	echo "------------------------"
	read RESPOSTA
	test "$RESPOSTA" != "s" && exit
fi
which node
node -v
if [ "$PASSOAPASSO" = "s" ]; then
	echo "------------------------"
	echo "-> sudo curl http://npmjs.org/install.sh | sh"
	echo "Baixa e roda o script para instalar o npm (s/n)"
	echo "------------------------"
	read RESPOSTA
	test "$RESPOSTA" != "s" && exit
fi
sudo curl http://npmjs.org/install.sh | sh
if [ "$PASSOAPASSO" = "s" ]; then
	echo "------------------------"
	echo "-> which npm"
	echo "-> npm -v"
	echo "Teste básico pra ver se o npm instalou  (s/n)"
	echo "------------------------"
	read RESPOSTA
	test "$RESPOSTA" != "s" && exit
fi
which npm
npm -v
pwd
cd
pwd
cd rede-social
npm install
#node app

