#!/bin/sh
#
# Setup script for wordpress
#
composer install

ln -s $(pwd)/wp-config.php $(pwd)/wp/wp-config.php

rm -r $(pwd)/wp/wp-content
ln -s $(pwd)/wp-content $(pwd)/wp/wp-content
