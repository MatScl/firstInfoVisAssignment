#!/bin/bash

# avvio server locale per testare
echo "Avvio server sulla porta 8080..."
echo "Apri http://localhost:8080 nel browser"
echo ""
echo "Premi Ctrl+C per fermare"
echo ""

python3 -m http.server 8080
