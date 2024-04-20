# PAC-MAN

## Preveri status (mora bit up to date)
- git status<br />
[Output: On branch main. Your branch is up to date with 'origin/main'.]


## Ustvari nov branch (ime je tvoj task na JIRA)
- git checkout -b PM-1<br />
<img width="307" alt="image" src="https://github.com/BlazBracko/PAC-MAN/assets/134056113/8fdd8c2b-6993-4fab-925c-08b56553a846"> <br />
[Output: Switched to a new branch 'PM-1']

# Redno preverjaj na katerem branchu si
- git branch<br />
[Output: * PM-1 <br />
          main ]

# Stage vse spremembe
- git add --all

# Commitaj spremembe (obvezno Jira issue key)
- git commit -m "PM-1 Initial commit for feature"

# Pushaj spremembe
- git push -u origin PM-1
# Output: [new branch] PM-1 -> PM-1
#         Branch 'PM-1' set up to track remote branch 'PM-1' from 'origin'.
