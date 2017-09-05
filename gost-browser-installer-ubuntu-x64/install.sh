#!/bin/bash

cd dist

tar -xf linux-amd64_deb.tgz
cd linux-amd64_deb
./install.sh
dpkg -i cprocsp-rdr-gui-gtk-64_4.0.0-4_amd64.deb
cd ..

mkdir cades_linux_amd64
tar -xf cades_linux_amd64.tar.gz -C cades_linux_amd64
cd cades_linux_amd64
sudo alien -kci cprocsp-pki-2.0.0-amd64-cades.rpm
sudo alien -kci cprocsp-pki-2.0.0-amd64-plugin.rpm
sudo alien -kci cprocsp-pki-2.0.0-amd64-plugin.rpm
cd ..

rm -rf linux-amd64_deb
rm -rf cades_linux_amd64

cd ..

if [ -d /usr/lib/firefox-addons/plugins ]; then
  cp -f /opt/cprocsp/lib/amd64/libnpcades.so /usr/lib/firefox-addons/plugins/libnpcades.so
fi