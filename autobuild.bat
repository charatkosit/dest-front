@echo off
setlocal enabledelayedexpansion

:: Set the path to your package.json
set PACKAGE_JSON=package.json

:: Extract "name" and "version" from package.json
for /f "usebackq tokens=2 delims=:," %%i in (`findstr /r /c:"\"name\"" %PACKAGE_JSON%`) do set name=%%i
for /f "usebackq tokens=2 delims=:," %%i in (`findstr /r /c:"\"version\"" %PACKAGE_JSON%`) do set version=%%i

:: Remove quotes and extra spaces
set name=!name:~2,-1!
set version=!version:~2,-1!

:: Build Docker commands
docker build -t charat/!name!:!version! .
docker tag charat/!name!:!version! charat/!name!:latest
docker push charat/!name!:!version!
docker push charat/!name!:latest

endlocal
