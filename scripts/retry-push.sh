#!/bin/bash
# Retry git push every 5 minutes until success
cd /f/projects/Rust/typort-lsp || exit 1
output=$(git push 2>&1)
exit_code=$?
if [ $exit_code -eq 0 ]; then
  # Success — stay silent, cron won't notify
  exit 0
else
  # Failure — output error so it gets delivered as notification
  echo "[retry push] $(date '+%Y-%m-%d %H:%M:%S')"
  echo "$output"
  exit 1
fi
