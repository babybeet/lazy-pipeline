#!/bin/bash

set -e

LATEST_COMMIT_MESSAGE=$(git log -n 1 --format=%s | tr -d "\n")

if [[ "$LATEST_COMMIT_MESSAGE" == "Bumping version to"* ]]; then
    echo "Linting and testing have already occurred, exiting."
    exit 0
fi

function matchCommitMessagePattern {
    KEYWORD_PATTERN="$1"

    echo $LATEST_COMMIT_MESSAGE | sed -E "s/^-[[:space:]]*//" | grep -iE "^($KEYWORD_PATTERN)(\(.+\))?\s*:" | wc -l | awk "{print \$1}"
}

if [ $(matchCommitMessagePattern "fix|refactor|test|perf|style|feat|breaking(\s*change)?") != "0" ]; then
    npx prettier --check lib/src/{*.ts,**/*.ts}
    cd lib
    npm run lint
    npm run test
else
    echo "Commit message does not start with /fix|refactor|test|perf|style|feat|breaking(\s*change)?/, exiting."
fi