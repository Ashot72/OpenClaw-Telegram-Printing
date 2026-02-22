---
name: telegram-hp-print
version: 1.0.0
description: Print text to default printer via Telegram
runtime: node.js
entry: run-cli.js
triggers:
  - "print"
  - "Print"
permissions:
  - "shell.exec"
  - "telegram.sendMessage"
---

# HP Telegram Printer
This skill automatically prints text sent via Telegram to the default printer.

## Usage
The user simply types "print <text>" in Telegram. The skill's internal logic handles authorization and PowerShell execution.