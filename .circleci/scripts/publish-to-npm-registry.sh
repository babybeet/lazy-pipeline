#!/bin/bash

set -e

COMMIT_MESSAGE=$(git log -n 1 --format=%s | tr -d "\n")

function matchCommitMessagePattern {
    KEYWORD_PATTERN="$1"

    echo $COMMIT_MESSAGE | sed -E "s/^-[[:space:]]*//" | grep -iE "^($KEYWORD_PATTERN)(\(.+\))?\s*:" | wc -l | awk "{print \$1}"
}

if [ $(matchCommitMessagePattern "fix|refactor|feat|breaking(\s*change)?") != "0" ] && [[ "$COMMIT_MESSAGE" == "Bumping version to"* ]]; then
    npm set //registry.npmjs.org/:_authToken=$NPM_TOKEN
    npm run publish
fi