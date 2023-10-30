@echo off

rem Defina o caminho da pasta da virtual environment
set venv_path=E:\Ambiente de Desenvolvimento\Python\TCC\venv

rem Defina o caminho do arquivo main.py
set main_script=E:\Ambiente de Desenvolvimento\Python\TCC\main.py

rem Defina o caminho para o arquivo de log
set log_file=E:\Ambiente de Desenvolvimento\Python\TCC\execution_log.txt

rem Obtenha a data atual
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set "current_datetime=%%I"
set "current_date=%current_datetime:~0,4%-%current_datetime:~4,2%-%current_datetime:~6,2%"

rem Verifique se o script já foi executado hoje
findstr /c:"%current_date%" "%log_file%" >nul
if %errorlevel%==0 (
    echo O script já foi executado hoje.
    exit /b 1
)

rem Change directory to the desired folder
cd /d "E:\Ambiente de Desenvolvimento\Python\TCC"

rem Activate virtual environment
call Scripts\activate

rem Run Main.py
python Main.py

rem Deactivate virtual environment
call Scripts\deactivate

rem Registre a execução no arquivo de log
echo %current_date% >> "%log_file%"

rem Pause to keep the terminal window open
pause
