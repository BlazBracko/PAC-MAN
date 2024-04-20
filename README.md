# PAC-MAN

## Preveri status (mora bit up to date)
git status
### Output: On branch main. Your branch is up to date with 'origin/main'.

# Create a new branch for JIRA issue PM-1
git checkout -b PM-1
# Output: Switched to a new branch 'PM-1'

# Check which branch you are on
git branch
# Output: * PM-1
#         main

# Make changes and stage them
git add --all

# Commit your changes
git commit -m "PM-1 Initial commit for feature"

# Push your branch to the remote repository
git push -u origin PM-1
# Output: [new branch] PM-1 -> PM-1
#         Branch 'PM-1' set up to track remote branch 'PM-1' from 'origin'.
