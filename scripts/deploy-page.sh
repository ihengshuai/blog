#!/usr/bin/env sh

set -e

mkdir gh-pages-branch
cd gh-pages-branch

git init
githubUrl="https://${OWNER}:${ACCESS_TOKEN}@github.com/${REPOSITORY}"
git checkout -b gh-pages

BUNDLE_DIST=dist

cp -a ../$BUNDLE_DIST/* .
# 删除本地使用的图片
rm -rf ./local-images
echo ${DOMAIN} > CNAME
git config --global user.email $EMAIL
git config --global user.name $OWNER
git add . -A
git commit -m 'update page'
# git push -f origin -q gh-pages
git push -f $githubUrl -q gh-pages
cd ..
rm -rf gh-pages-branch
echo deploy successfully
