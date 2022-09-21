#!/bin/bash

set -e

COMMIT_MESSAGE=$(git log -n 1 --format=%s | tr -d "\n")

if [[ "$COMMIT_MESSAGE" == "Bumping version to"* ]]; then
    npm set //registry.npmjs.org/:_authToken=$NPM_TOKEN
    npm run publish
fi