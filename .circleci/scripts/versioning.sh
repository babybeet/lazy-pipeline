#!/bin/bash

set -e

COMMIT_MESSAGE=$(git log -n 1 --format=%s | tr -d "\n")

if [[ "$COMMIT_MESSAGE" == "Bumping version to"* ]]; then
    echo "Versioning has already occurred, exiting."
    exit 0
fi

function matchCommitMessagePattern {
    KEYWORD_PATTERN="$1"

    echo $COMMIT_MESSAGE | sed -E "s/^-[[:space:]]*//" | grep -iE "^($KEYWORD_PATTERN)(\(.+\))?\s*:" | wc -l | awk "{print \$1}"
}

function extractVersionFromPackageJsonFile {
    cat package.json | grep version | cut -d'"' -f 4 | head -n 1
}

function bumpPackageVersion {
    if [ $(matchCommitMessagePattern "build|chore|ci|docs|fix|perf|refactor|style|test") != "0" ]; then
        npm version patch --no-git-tag-version
    elif [ $(matchCommitMessagePattern "feat") != "0" ]; then
        npm version minor --no-git-tag-version
    elif [ $(matchCommitMessagePattern "breaking(\s*change)?") != "0" ]; then
        npm version major --no-git-tag-version
    else
        echo "Commit message should start with a valid type, please see https://github.com/nhuyvan/lazy-pipeline/CONTRIBUTING.md to learn more"
        npm version minor --no-git-tag-version
    fi

    extractVersionFromPackageJsonFile
}

bumpPackageVersion
NEW_VERSION=$(extractVersionFromPackageJsonFile)
cd lib
npm version "$NEW_VERSION" --no-git-tag-version
cd ..

git config --global user.email "circleci@email.com"
git config --global user.name "CircleCI"

if [ $(matchCommitMessagePattern "fix|refactor|feat|breaking(\s*change)?") != "0" ]; then
    NEW_TAG="v$NEW_VERSION"
    git tag "$NEW_TAG"
    git push origin "$NEW_TAG"
    echo "Created Git tag $NEW_TAG."
fi

git add {.,lib}/{package,package-lock}.json
git commit -m "Bumping version to $NEW_VERSION for release build."
git push origin main
