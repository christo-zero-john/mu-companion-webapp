@REM Check for modified files and commit them

@echo off

git ls-files -m
echo .
echo .
echo .
for /f "tokens=*" %%f in ('git ls-files -m') do (
    git add "%%f"
    git commit -m "Found modified or deleted file,  %%f. Committing Via Global Bash Script:git-status-automated.bat"
)

echo "Checking for new Changes"
echo .
echo .


@REM check for new files and commit them
echo .

git ls-files --others --exclude-standard
echo .
echo .
echo .

for /f "tokens=*" %%f in ('git ls-files --others --exclude-standard') do (
    git add "%%f"
    git commit -m "Found new file,  %%f. Committing Via Global Bash Script:git-status-automated.bat"
)

@REM After commiting dont push to origin
echo .
echo "Changes Won't be pushed to origin..."
echo "Operation Ended"
@REM echo .

@REM git push