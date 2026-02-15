# Root folder of your backend project
$root = "."  # current folder

# File extensions to include
$extensions = "*.js", "*.ts", "*.json", "*.env"

Write-Output "BACKEND FOLDER STRUCTURE (excluding node_modules)"
Write-Output "==============================================="

# Display folder tree excluding node_modules
tree $root /F | Where-Object { $_ -notmatch "node_modules" }

Write-Output ""
Write-Output "BACKEND FILE CONTENTS (excluding node_modules)"
Write-Output "=============================================="
Write-Output ""

# Recursively get files but exclude node_modules
Get-ChildItem -Path $root -Recurse -Include $extensions |
Where-Object { $_.FullName -notmatch "node_modules" } |
ForEach-Object {

    # Relative path from current location
    $relativePath = $_.FullName.Replace((Get-Location).Path + "\", "")

    Write-Output "FILE: $relativePath"
    Write-Output "----------------------------"

    # Display file content
    Get-Content $_.FullName

    Write-Output ""
    Write-Output ""
}
