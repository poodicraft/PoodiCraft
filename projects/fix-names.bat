@echo off
chcp 65001 >nul
rem מסיר תווים בלתי-נראים (סימני כיוון עברית) משמות הקבצים בתיקייה הזו.
rem אם שמתם תמונה עם השם הנכון והיא לא מופיעה באתר - הפעילו את הקובץ הזה (לחיצה כפולה).
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$fixed = 0; Get-ChildItem -LiteralPath '%~dp0' -File | ForEach-Object { $n = $_.Name -replace '[\u200e\u200f\u202a-\u202e\u2066-\u2069]', ''; if ($n -ne $_.Name) { Rename-Item -LiteralPath $_.FullName -NewName $n; Write-Host ('fixed: ' + $n); $fixed++ } }; if ($fixed -eq 0) { Write-Host 'all file names are OK' }"
pause
