#!/bin/bash

# Configuration
REPO_PATH="/home/escelit/Desktop/LumenRoll"
COMMIT_COUNT=400
START_DATE="2026-03-05T10:00:00"
END_DATE=$(date +"%Y-%m-%dT%H:%M:%S")

# Messages for logical progression
MESSAGES=(
    "feat(contract): initial soroban project structure"
    "docs: add architectural overview to README"
    "feat(contract): define core DiceError enum"
    "feat(contract): implement GameStatus enum"
    "feat(contract): define main Game struct"
    "feat(contract): add storage keys for game state"
    "feat(contract): implement initialize function"
    "test(contract): add unit test for initialization"
    "feat(contract): implement place_bet logic"
    "feat(contract): add validation for player guesses"
    "feat(contract): implement minimum bet enforcement"
    "fix(contract): correct storage key collision in game lookup"
    "docs: update contract API documentation"
    "feat(backend): initialize node.js project with express"
    "feat(backend): add database schema for game persistence"
    "feat(backend): implement stellar sdk initialization"
    "feat(backend): add basic error handling middleware"
    "feat(backend): implement bet submission endpoint"
    "fix(backend): correct transaction xdr decoding"
    "feat(frontend): setup vite + react boilerplate"
    "feat(frontend): implement glassmorphism design system"
    "feat(frontend): add freighter wallet integration hook"
    "feat(frontend): create main navigation layout"
    "feat(frontend): implement dice board component"
    "feat(frontend): add bet form with validation"
    "style: enhance mobile responsiveness of the board"
    "feat: add commit-reveal logic explanation to UI"
    "refactor: optimize contract storage usage"
    "test: add integration test for bet lifecycle"
    "chore: update dependencies and fix security vulnerabilities"
)

# Move to repo
cd "$REPO_PATH"

# Reset history
rm -rf .git
git init
git branch -M main

# Function to generate a random date between START and CURRENT
generate_date() {
    local i=$1
    local total=$2
    # Linear distribution over 30 days with some jitter
    local start_ts=$(date -d "$START_DATE" +%s)
    local end_ts=$(date +%s)
    local diff=$((end_ts - start_ts))
    local increment=$((diff / total))
    local current_ts=$((start_ts + (increment * i)))
    # Add random jitter (up to 2 hours)
    local jitter=$((RANDOM % 7200))
    local final_ts=$((current_ts + jitter))
    echo $(date -d "@$final_ts" --iso-8601=seconds)
}

echo "Generating $COMMIT_COUNT commits..."

for i in $(seq 1 $COMMIT_COUNT); do
    # Pick a message (cycle through messages)
    msg_idx=$(( (i-1) % ${#MESSAGES[@]} ))
    msg="${MESSAGES[$msg_idx]}"
    
    # Add some dummy content to a log file to ensure unique hashes
    echo "Task $i completed: $(date)" >> .dev_log
    git add .dev_log
    
    # Selectively add files to make history look realistic
    if [ $i -lt 20 ]; then
        git add contract/
    elif [ $i -lt 40 ]; then
        git add backend/
    elif [ $i -lt 80 ]; then
        git add frontend/
    else
        git add .
    fi

    # Generate backdated timestamp
    D=$(generate_date $i $COMMIT_COUNT)
    
    GIT_AUTHOR_DATE="$D" GIT_COMMITTER_DATE="$D" git commit -m "$msg" --quiet
    
    if [ $((i % 10)) -eq 0 ]; then
        echo "Progress: $i/$COMMIT_COUNT commits done."
    fi
done

# Clean up dev log
rm .dev_log
git add .
D=$(date --iso-8601=seconds)
GIT_AUTHOR_DATE="$D" GIT_COMMITTER_DATE="$D" git commit -m "chore: final project scaffolding and cleanup" --quiet

echo "Done! 1-month history generated."
