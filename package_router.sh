#!/bin/bash
echo "Packaging router..."
cp -r core auth data config logs *.js *.json dist/
echo "Done. Files in ./dist"
