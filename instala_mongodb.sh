#!/bin/bash
# Instruções para instalar MongoDB numa instância EC2 da AWS
# Instruções retiradas de:
# http://docs.mongodb.org/manual/tutorial/install-mongodb-on-ubuntu/
#

echo "------------------------"
echo "Deseja executar passo-a-passo (s/n)?"
echo "------------------------"
read PASSOAPASSO

if [ "$PASSOAPASSO" = "s" ]; then
	echo "------------------------"
	echo "Importa a chave GPG do MongoDB (s/n)"
	echo "$ sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10"
	echo "------------------------"
	read RESPOSTA
	test "$RESPOSTA" != "s" && exit
fi
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10

if [ "$PASSOAPASSO" = "s" ]; then
	echo "------------------------"
	echo "Adiciona repositório de onde baixar o MongoDB (s/n)"
	echo "$ echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | sudo tee /etc/apt/sources.list.d/mongodb.list"
	echo "------------------------"
	read RESPOSTA
	test "$RESPOSTA" != "s" && exit
fi
echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | sudo tee /etc/apt/sources.list.d/mongodb.list

if [ "$PASSOAPASSO" = "s" ]; then
	echo "------------------------"
	echo "Update para recarregar repositórios (s/n)"
	echo "$ sudo apt-get update"
	echo "------------------------"
	read RESPOSTA
	test "$RESPOSTA" != "s" && exit
fi
sudo apt-get update

if [ "$PASSOAPASSO" = "s" ]; then
	echo "------------------------"
	echo "Instala o pacote do MongoDB (s/n)"
	echo "$ sudo apt-get install mongodb-10gen"
	echo "------------------------"
	read RESPOSTA
	test "$RESPOSTA" != "s" && exit
fi
sudo apt-get install mongodb-10gen

echo "FIM"

