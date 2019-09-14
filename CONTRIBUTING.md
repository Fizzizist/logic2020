# Contribution Guideline #
## Setting up your dev environment ##
The following tutorial assumes that you are running some kind of linux, and you already have Python3 and NodeJS installed.
1. Clone the repository and cd into it.
```
git clone https://github.com/Fizzizist/logic2020.git
cd logic2020
```
2. Set up python virtual environment and activate it
```
pip install virtualenv
virtualenv logix-venv
source logix-venv/bin/activate
```
3. Install dependencies
```
pip install pip-tools
pip-compile
pip-sync
npm install
```
Once that is all complete you should be able to run:
```
npm run build
./manage.py runserver
```
then point your browser to `localhost:8000` to make sure everything is working.
Be sure to create an issue in the repo if this process does not work so that I can fix this document.

## Contributing to the repository ##
I am happy for anyone interested in formal logic to contribute to this project!
To make the development process go much smoother, this project has some guidlines to follow if you would like to contribute:
This project uses Trunk-Based Development which means there is a specific and pretty easy way to make contributions:
1. Make or choose an issue that you would like to work on and assign yourself to it.
2. Move that issue to the `Doing` column in the Projects Kanban board.
3. Either fork the repo or make a branch with the title `[issue number]-[your initials]-[title of the issue]`
4. Submit a pull request with `closes [issue number]` in the description and assign someone else to review it.
5. Once it passes CI it can be merged into master.

* Make sure all code is readable: has proper docstring.
* Make sure code is tested. CI is set to fail is coverage falls below 70% for the files that are tracked.
* Master should always be a working, up to date build. 
* Edits should always take place on a side branch and then be merged into master. 
* Branches should not be open very long, and should consist of small, easy to manage changes.

This way we are not dealing with giagantic feature branches that are impossible to merge back into master.

Happy Contributing!
