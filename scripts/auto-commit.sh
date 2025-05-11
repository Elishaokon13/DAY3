#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to commit changes
commit_changes() {
    local timestamp=$(date "+%Y-%m-%d %H:%M:%S")
    local changed_files=$(git status --porcelain)
    
    if [ -n "$changed_files" ]; then
        echo -e "${YELLOW}Changes detected at $timestamp${NC}"
        
        # Create a simple commit message with just the file paths
        local commit_msg="$timestamp\n\nModified:"
        
        # Process each changed file
        while IFS= read -r line; do
            if [ -n "$line" ]; then
                file=${line:3}  # Remove the status prefix (e.g., "M ")
                commit_msg+="\n$file"
            fi
        done <<< "$changed_files"
        
        # Add all changes
        git add .
        
        # Commit with simple message
        echo -e "$commit_msg" | git commit -F -
        
        echo -e "${GREEN}Changes committed successfully!${NC}"
    else
        echo -e "${YELLOW}No changes detected at $timestamp${NC}"
    fi
}

# Function to handle script termination
cleanup() {
    echo -e "\n${YELLOW}Auto-commit script stopped.${NC}"
    exit 0
}

# Set up trap for cleanup
trap cleanup SIGINT SIGTERM

echo -e "${GREEN}Starting auto-commit script...${NC}"
echo "Press Ctrl+C to stop the script"

# Main loop
while true; do
    commit_changes
    sleep 60  # Check every minute
done 