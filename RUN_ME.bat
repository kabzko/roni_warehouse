set mypath=%cd%
@echo %mypath%
%mypath%/env/script/activate.bat && python manage.py runserver
Pause