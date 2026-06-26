#!/bin/bash
echo "==================================================="
echo "            SkillMatch Recruitment Platform"
echo "==================================================="
echo
echo "Starting Python static file server on port 8000..."
echo "Opening http://127.0.0.1:8000 in your browser..."
echo
echo "Press Ctrl+C in this terminal to stop the server."
echo

# Detect OS and open the browser automatically
if command -v xdg-open >/dev/null 2>&1; then
  # Linux
  xdg-open "http://127.0.0.1:8000"
elif command -v open >/dev/null 2>&1; then
  # macOS
  open "http://127.0.0.1:8000"
elif command -v cmd.exe >/dev/null 2>&1; then
  # Git Bash / WSL on Windows
  cmd.exe /c start "http://127.0.0.1:8000"
else
  echo "Please open http://127.0.0.1:8000 in your browser."
fi

# Run the python server with unbuffered output
python -u server.py
