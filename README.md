# Notepad--
Notepad-- is a local browser editor with various features.

## Setup
First off, ensure that the project is on your local PC.

### Python
Secondly, Python (3) is a preqequisite, along with pip [(get it here)](https://www.python.org/downloads/). 
Ensure that the python scripts folder is added to your users PATH [(tutorial here)](https://stackoverflow.com/questions/44272416/how-to-add-a-folder-to-path-environment-variable-in-windows-10-with-screensho/44272417#44272417).

Once python and pip are installed, you can install the required packages for Notepad-- through 
the requirements.txt in the project:

```$ pip install -r [Path to requirements.txt]```

Assuming everything went correctly, you should now have all the prerequisites to use Notepad--.

## Enabling Features
To select features, simply go to the .env file in the aop folder of the project and for
each feature that should be activated, set the variable to True. Set the variables of the
features that should be deactivated to False.

## Running
Running Notepad-- is now as easy as 1-2-3. First, start the local flask server through either 
the bash or powershell script with

```$ [Path to run.ps1]```
```$ [Path to run.sh]```

Then, in one of the supported browsers (Chrome, Edge and Firefox), type localhost:5000 to 
go to the editor. The editor should run with the selected features!  

Lastly, if you change the features in the `.env` file, make sure you press `ctrl` + `F5` 
in the browser to refresh the cache: this is to make the browser load the correct files.

## Testing 
Testing is done in the branch selenium-testing. Selenium and the correct webdriver for Chrome and Firefox should be installed. Specifying the webdrivers, download and file paths can be done in the `.env` file. After that you can run the test files. 
