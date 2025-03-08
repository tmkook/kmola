#!/bin/bash

mkdir $1

cd $1

npm install kmola sutando sqlite3 -d

cp -rf node_modules/kmola/framework/* ./

echo "installation is complete. please run 'cd $1' and 'node artisan serve'"