#!/usr/bin/env sh
set -eu

# Substitute $PORT into nginx conf template
envsubst '\$PORT' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

# Start nginx
exec nginx -g 'daemon off;'
