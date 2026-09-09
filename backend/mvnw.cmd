@echo off
set "SCRIPT_DIR=%~dp0"
set "MAVEN_CMD=%SCRIPT_DIR%.tools\apache-maven-3.9.8\bin\mvn.cmd"
if exist "%MAVEN_CMD%" (
    "%MAVEN_CMD%" %*
) else (
    mvn %*
)
