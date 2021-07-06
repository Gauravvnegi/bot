#!/bin/bash
rm -rf dist
#rm -rf node_modules
npm i
ng run admin:build --configuration=production
