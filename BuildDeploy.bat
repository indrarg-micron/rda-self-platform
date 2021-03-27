@echo off

SET targetUrlPortion=bo-ose-test
SET openShift=https://%targetUrlPortion%.micron.com:8443
SET registry=docker-registry-default.%targetUrlPortion%.micron.com

REM TODO: CHANGE MAYBE UI images do not have to be deployed to this OpenShift workspace.
SET OS_WORKSPACE=f10-rda
SET namespace=docker-registry-default.%targetUrlPortion%.micron.com/%OS_WORKSPACE%

REM TODO: CHANGE 'quickstart' to your app. NOTE: this needs to be lower case and no spaces. You can use dashes.
SET fullname=docker-registry-default.bo-ose-test.micron.com/%OS_WORKSPACE%/rda-self-platform:latest
REM SET fullname=docker-registry-default.bo-ose-test.micron.com/%OS_WORKSPACE%/rda-self-platform:latest
REM SET fullname=docker-registry-default.bo-ose-test.micron.com/%OS_WORKSPACE%/rda-self-platform:latest

ECHO -------------------- OC LOGIN %openShift%
call oc login %openShift%  && (
  ECHO oc login successful
) || (
  ECHO oc login failed
    Exit /B
)
for /f %%i in ('oc whoami -t') do set OC_TOKEN=%%i

ECHO -------------------- DOCKER LOGIN %registry%
call docker login -u unused -p %OC_TOKEN% %registry% && (
  ECHO docker login successful
) || (
  ECHO docker login failed
    Exit /B
)

ECHO -------------------- DOCKER BUILD %fullname%
docker build --tag %fullname% . && (
  ECHO BUILD %fullname% successful
) || (
  ECHO BUILD %fullname% failed
    Exit /B
)

ECHO -------------------- DOCKER PUSH %fullname% to REGISTRY %registry%
docker push %fullname% && (
  ECHO PUSH %fullname% successful
) || (
  ECHO PUSH %fullname% failed
    Exit /B
)
