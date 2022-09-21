#!/bin/bash

set -e

LATEST_COMMIT_MESSAGE=$(git log -n 1 --format=%s | tr -d "\n")

if [[ "$LATEST_COMMIT_MESSAGE" == "Bumping version to"* ]]; then
    npm set //registry.npmjs.org/:_authToken=$NPM_TOKEN
    npm run publish
else
    echo "Versioning has not occured yet, exiting."
fi