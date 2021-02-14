#!/usr/bin/env sh

echo 'Deploy started'

yarn build
git add dist --force
git commit -m 'deploy'
git push origin `git subtree split --prefix dist master`:gh-pages --force

echo 'Deployed: \033[1;32;4mhttps://nextgtrgod.github.io/webaudio-synth/\033[0m'
echo ''