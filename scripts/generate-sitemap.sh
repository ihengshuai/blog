#!/usr/bin/env bash

# 生成sitemap

files=$(find ./docs -name '*.md')
filemap=$(echo $files | tr ',' ' ')
domain=https://${DOMAIN}
sitemapDir=./dist/sitemap.txt

echo $domain >>$sitemapDir

for filename in ${filemap[@]}; do
  filenameLen=${#filename}
  echo $domain${filename:6:$(expr $filenameLen - 9)}.html >>$sitemapDir
done
