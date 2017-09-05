#!/bin/bash

cd dist

tar -xf linux-amd64_deb.tgz
cd linux-amd64_deb
./uninstall.sh
cd ..

rm -rf linux-amd64_deb
rm -rf gost_capi_20161020
rm -rf pcre-8.39
rm -rf zlib-1.2.8
rm -rf nginx-nginx-1.10-gost

rm -rf /opt/cprocsp
rm -rf /etc/opt/cprocsp
rm -rf /var/opt/cprocsp