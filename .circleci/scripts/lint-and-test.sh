#!/bin/bash

set -e

LATEST_COMMIT_MESSAGE=$(git log -n 1 --format=%s | tr -d "\n")

if [[ "$LATEST_COMMIT_MESSAGE" == "Bumping version to"* ]]; then
    echo "Linting and testing have already occurred, exiting."
    exit 0
fi

npx prettier --check lib/src/{*.ts,**/*.ts}
cd lib
npm run lint
npm run test