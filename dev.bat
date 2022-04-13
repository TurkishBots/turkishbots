@echo off
title Starting..
cls
echo Starting Bot...
:loop
nodemon -w ./src/ -i ./commands/ -e js ts
goto loop
pause