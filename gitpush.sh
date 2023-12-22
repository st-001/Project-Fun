#!/bin/bash

# Adding all changes to git
git add .

# Committing changes
read -p "Enter commit message: " commit_message
git commit -m "$commit_message"

# Pushing to the remote repository
git push
