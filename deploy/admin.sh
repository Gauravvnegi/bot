#!/bin/bash
rm -rf dist
#rm -rf node_modules
npm i --legacy-peer-deps
ng run admin:build --configuration=development
