# RDA Self 2.0

Source code for RDA Self 2.0

SQL database schema:  
![schema](readme/schema.png "Database Schema")

## Prerequisite

This app is served on Node.js + Express platform.  
The app is hosted on Openshift Platform.  
Recommended to edit this code on VS Code.  
Please follow this [Development Setup](https://confluence.micron.com/confluence/display/OMELEK/Development+Setup) to install the necessary development tools.  

The following tools are needed to develop this code:  
* GIT
* Node.js and NPM (Node Package Manager)
* Visual Studio Code
* OpenShift CLI (Command Line Input), get it [here](https://www.okd.io/download.html)
* Docker

## Initial Setup

After you have installed the necessary development tools, open this code in its root folder using VS Code and launch terminal there.  
Copy the `template.env` file to create a new file named `.env` and fill the necessary info in the new file.  
Then run `npm install` in the terminal to install all node modules required by this code.  
Then run `nodemon` to start the server. Nodemon will auto restart the server when there's any changes to your `.js` code 