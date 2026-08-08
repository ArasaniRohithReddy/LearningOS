#!/usr/bin/env pwsh
<#
.SYNOPSIS
  Wire LearningOS into the AI hosts installed on this machine (idempotent).
.DESCRIPTION
  Registers the bundled Flint-Chart MCP (for /progress-charts) into each detected host's MCP config,
  and reminds you how each host discovers the LearningOS agents/skills. Safe and idempotent: it backs up
  any file before changing it, only adds the 'flint-chart' server if missing, and never deletes data.
.PARAMETER Target
  all (default) | cli | vscode | vscode-insiders | claude | cursor | gemini
.PARAMETER WhatIf
  Preview changes without writing anything.
.EXAMPLE
  pwsh ./install.ps1
  pwsh ./install.ps1 -WhatIf
  pwsh ./install.ps1 -Target cli
#>
[CmdletBinding()]
param(
  [ValidateSet('all','cli','vscode','vscode-insiders','claude','cursor','gemini')]
  [string]$Target = 'all',
  [switch]$WhatIf
)

$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot

function Write-Step($m) { Write-Host "  $m" }
function Write-Head($m) { Write-Host "`n== $m ==" -ForegroundColor Cyan }

# Flint-Chart MCP definitions per config flavor.
$flintCli    = [ordered]@{ command = 'npx'; args = @('-y','flint-chart-mcp') }                       # ~/.copilot, gemini
$flintVscode = [ordered]@{ type = 'stdio'; command = 'npx'; args = @('-y','flint-chart-mcp') }       # .vscode/mcp.json

function Backup-File($path) {
  if (Test-Path $path) {
    $bak = "$path.bak-learningos-$(Get-Date -Format yyyyMMddHHmmss)"
    Copy-Item $path $bak -Force
    Write-Step "backed up -> $(Split-Path $bak -Leaf)"
  }
}

# Ensure a 'flint-chart' server exists under the given container key ('mcpServers' or 'servers').
function Ensure-Mcp {
  param([string]$Path, [string]$ContainerKey, [hashtable]$ServerDef)
  $dir = Split-Path $Path -Parent
  if ($dir -and -not (Test-Path $dir)) {
    if ($WhatIf) { Write-Step "would create dir $dir" } else { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
  }
  if (Test-Path $Path) {
    $raw = Get-Content $Path -Raw
    # JSONC comment detection — a JSON round-trip would silently strip // or /* */ comments,
    # so refuse to auto-edit and show the user the exact entry to add by hand.
    if ($raw -match '(?m)//' -or $raw -match '/\*') {
      Write-Step "! $Path contains comments — not editing it automatically (a rewrite would strip them)."
      Write-Step ("  Add this under its `"$ContainerKey`": " + ($ServerDef | ConvertTo-Json -Compress))
      return
    }
    try { $cfg = $raw | ConvertFrom-Json -ErrorAction Stop }
    catch { Write-Step "! $Path is not valid JSON — skipping (fix or delete it, then re-run)"; return }
  } else {
    $cfg = [pscustomobject]@{}
  }
  if (-not ($cfg.PSObject.Properties.Name -contains $ContainerKey)) {
    $cfg | Add-Member -NotePropertyName $ContainerKey -NotePropertyValue ([pscustomobject]@{})
  }
  if ($cfg.$ContainerKey.PSObject.Properties.Name -contains 'flint-chart') {
    Write-Step "already present -> $Path"
    return
  }
  $cfg.$ContainerKey | Add-Member -NotePropertyName 'flint-chart' -NotePropertyValue ([pscustomobject]$ServerDef)
  if ($WhatIf) {
    Write-Step "would add 'flint-chart' -> $Path"
  } else {
    Backup-File $Path
    # UTF-8 without BOM, across both Windows PowerShell 5.1 and pwsh 7.
    $json = ($cfg | ConvertTo-Json -Depth 20)
    [System.IO.File]::WriteAllText($Path, $json + [Environment]::NewLine, (New-Object System.Text.UTF8Encoding($false)))
    Write-Step "added 'flint-chart' -> $Path"
  }
}

$did = @()

# --- Copilot CLI (+ Copilot Desktop share ~/.copilot) --------------------------------
if ($Target -in 'all','cli') {
  Write-Head 'GitHub Copilot CLI'
  $p = Join-Path $HOME '.copilot/mcp-config.json'
  if (Test-Path (Join-Path $HOME '.copilot')) {
    Ensure-Mcp -Path $p -ContainerKey 'mcpServers' -ServerDef $flintCli
    Write-Step "agents/skills: install the plugin (`copilot plugin install <owner>/<repo>`) or open this repo."
    $did += 'cli'
  } else { Write-Step 'not detected (~/.copilot missing) — skipping' }
}

# --- VS Code / Insiders / Desktop (workspace file in this repo) -----------------------
if ($Target -in 'all','vscode','vscode-insiders') {
  Write-Head 'VS Code / Insiders / Copilot Desktop (workspace)'
  $p = Join-Path $root '.vscode/mcp.json'
  Ensure-Mcp -Path $p -ContainerKey 'servers' -ServerDef $flintVscode
  Write-Step 'agents/skills: open this folder as your workspace — Copilot reads .github/ automatically.'
  $did += 'vscode'
}

# --- Gemini CLI ----------------------------------------------------------------------
if ($Target -in 'all','gemini') {
  Write-Head 'Gemini CLI'
  if (Test-Path (Join-Path $HOME '.gemini')) {
    Ensure-Mcp -Path (Join-Path $HOME '.gemini/settings.json') -ContainerKey 'mcpServers' -ServerDef $flintCli
    Write-Step 'extension manifest: gemini-extension.json (already in this repo).'
    $did += 'gemini'
  } else { Write-Step 'not detected (~/.gemini missing) — install via gemini-extension.json' }
}

# --- Claude Code / Cursor (manifest-driven; do not touch their global config) ---------
if ($Target -in 'all','claude') {
  Write-Head 'Claude Code'
  Write-Step 'manifest ready: .claude-plugin/plugin.json (installs agents/skills + flint-chart MCP).'
  Write-Step 'install via your Claude plugin marketplace flow; see docs/Install.md.'
}
if ($Target -in 'all','cursor') {
  Write-Head 'Cursor'
  Write-Step 'manifest ready: .cursor-plugin/plugin.json (installs skills + flint-chart MCP).'
  Write-Step 'install via Cursor plugin flow; see docs/Install.md.'
}

Write-Head 'Done'
if ($WhatIf) { Write-Host 'Preview only — nothing was written. Re-run without -WhatIf to apply.' -ForegroundColor Yellow }
else { Write-Host "Wired: $([string]::Join(', ', ($did | Select-Object -Unique)))  ·  see docs/Install.md for the rest." -ForegroundColor Green }
Write-Host 'Charts render locally via flint-chart-mcp; your data never leaves the machine.'
