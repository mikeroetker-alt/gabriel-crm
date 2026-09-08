param(
  [Parameter(Mandatory = $true)][string]$InputCsv,
  [string]$OutputDirectory = (Join-Path $PSScriptRoot '..\private-pilot')
)
$ErrorActionPreference = 'Stop'
$repositoryRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$resolvedOutput = [IO.Path]::GetFullPath($OutputDirectory)
if (-not $resolvedOutput.StartsWith($repositoryRoot + [IO.Path]::DirectorySeparatorChar,
  [StringComparison]::OrdinalIgnoreCase)) { throw 'OutputDirectory must stay inside this repository.' }
if (-not (Test-Path -LiteralPath $InputCsv -PathType Leaf)) { throw 'Input CSV was not found.' }
$rows = @(Import-Csv -LiteralPath $InputCsv | Where-Object { $_.Pipeline -eq 'HVAC' })
$seen = @{}
$candidates = foreach ($row in $rows) {
  $email = ([string]$row.Email).Trim()
  $normalizedEmail = $email.ToLowerInvariant()
  if (-not $normalizedEmail -or $normalizedEmail -notmatch '^[^\s@]+@[^\s@]+\.[^\s@]+$') { continue }
  if ($seen.ContainsKey($normalizedEmail)) { continue }
  $seen[$normalizedEmail] = $true
  $score = 0
  if ([string]$row.'Contact Name') { $score += 3 }
  if ([string]$row.Company) { $score += 2 }
  if ([string]$row.Website -match '^https?://') { $score += 2 }
  if ([string]$row.Phone) { $score += 1 }
  if ([string]$row.City -and [string]$row.State) { $score += 1 }
  $hash = [Security.Cryptography.SHA256]::HashData([Text.Encoding]::UTF8.GetBytes($normalizedEmail))
  [pscustomobject]@{
    candidateId = 'HVAC-' + [Convert]::ToHexString($hash).Substring(0, 10)
    contactName = $row.'Contact Name'; company = $row.Company; email = $email
    phone = $row.Phone; website = $row.Website; city = $row.City; state = $row.State
    completenessScore = $score; emailVerification = 'unverified'; suppressionStatus = 'unknown'
    decisionMakerConfirmed = 'no'; sourceEvidenceConfirmed = 'no'; mikeApprovalRef = ''
    pilotStatus = 'research_required'
  }
}
New-Item -ItemType Directory -Path $resolvedOutput -Force | Out-Null
$ordered = @($candidates | Sort-Object @{ Expression = 'completenessScore'; Descending = $true }, company, candidateId)
$ordered | Export-Csv -LiteralPath (Join-Path $resolvedOutput 'hvac-candidates-private.csv') -NoTypeInformation -Encoding utf8
$ordered | Select-Object -First 20 | Export-Csv -LiteralPath (Join-Path $resolvedOutput 'M1-B1-20-private.csv') -NoTypeInformation -Encoding utf8
[pscustomobject]@{ hvacRows = $rows.Count; uniqueEmailCandidates = $ordered.Count
  initialCohortRows = [Math]::Min(20, $ordered.Count); outreachReadyRows = 0
  outputDirectory = $resolvedOutput }

