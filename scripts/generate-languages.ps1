# PowerShell script to generate language statistics from GitHub repositories
param(
    [string]$Token = $env:GITHUB_TOKEN,
    [string]$Repository = $env:GITHUB_REPOSITORY
)

# Set console output encoding to UTF-8
$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "Generating language statistics..."

if (-not $Token) {
    Write-Error "GITHUB_TOKEN environment variable is required"
    exit 1
}

if (-not $Repository) {
    Write-Error "GITHUB_REPOSITORY environment variable is required"
    exit 1
}

try {
    # Extract owner from repository (format: owner/repo)
    $owner = $Repository.Split('/')[0]
    
    # Set up headers for GitHub API
    $headers = @{
        'Authorization' = "token $Token"
        'User-Agent' = 'GitHub-Actions-Language-Generator'
        'Accept' = 'application/vnd.github.v3+json'
    }
    
    # Get list of repositories for the owner
    $reposUrl = "https://api.github.com/users/$owner/repos?type=all&per_page=100"
    Write-Host "Fetching repositories from: $reposUrl"
    
    $repos = Invoke-RestMethod -Uri $reposUrl -Headers $headers -Method Get
    
    # Initialize totals
    $totals = @{}
    $repoCount = 0
    
    foreach ($repo in $repos) {
        # Skip forks unless they have original content
        if ($repo.fork -and $repo.size -eq $repo.parent.size) {
            continue
        }
        
        # Get languages for this repository
        $languagesUrl = $repo.languages_url
        Write-Host "Fetching languages for: $($repo.name)"
        
        try {
            $languages = Invoke-RestMethod -Uri $languagesUrl -Headers $headers -Method Get
            
            if ($languages -and ($languages | Get-Member -MemberType Properties).Count -gt 0) {
                $repoCount++
                
                # Add languages to totals
                foreach ($property in ($languages | Get-Member -MemberType Properties)) {
                    $language = $property.Name
                    $bytes = $languages.$language
                    
                    if ($totals.ContainsKey($language)) {
                        $totals[$language] += $bytes
                    } else {
                        $totals[$language] = $bytes
                    }
                }
            }
        } catch {
            Write-Warning "Failed to fetch languages for $($repo.name): $($_.Exception.Message)"
        }
        
        # Add a small delay to respect rate limits
        Start-Sleep -Milliseconds 100
    }
    
    # Sort languages by byte count (descending)
    $sortedTotals = [ordered]@{}
    $totals.GetEnumerator() | Sort-Object Value -Descending | ForEach-Object {
        $sortedTotals[$_.Key] = $_.Value
    }
    
    # Create output data
    $outputData = @{
        generated_at = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
        totals = $sortedTotals
        repo_count = $repoCount
    }
    
    # Convert to JSON
    $jsonOutput = $outputData | ConvertTo-Json -Depth 10
    
    # Ensure output directory exists
    $outputPath = ".\assets\js\languages.json"
    $outputDir = ".\assets\js"
    
    if (-not (Test-Path $outputDir)) {
        New-Item -ItemType Directory -Path $outputDir -Force | Out-Null
    }
    
    # Write to file with UTF-8 encoding (no BOM)
    [System.IO.File]::WriteAllText((Resolve-Path $outputPath), $jsonOutput, [System.Text.UTF8Encoding]::new($false))
    
    Write-Host "Successfully generated language statistics:" -ForegroundColor Green
    Write-Host "  Total repositories: $repoCount" -ForegroundColor Green
    Write-Host "  Total languages: $($sortedTotals.Count)" -ForegroundColor Green
    Write-Host "  Output file: $outputPath" -ForegroundColor Green
    Write-Host "  Timestamp: $($outputData.generated_at)" -ForegroundColor Green

} catch {
    Write-Error "Error generating language statistics: $($_.Exception.Message)"
    Write-Error "Stack trace: $($_.ScriptStackTrace)"
    exit 1
}