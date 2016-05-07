#!/bin/sh
#
# Setup script for wordpress
#
composer install
ln -s $(pwd)/wp-config.php $(pwd)/wp/wp-config.php
