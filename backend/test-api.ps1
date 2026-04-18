# API Testing Script for CampsHub Backend
# This script tests all endpoints using PowerShell's Invoke-WebRequest (Windows curl equivalent)

$BaseURL = "http://localhost:8081/api"
$SuccessCount = 0
$FailCount = 0

function Test-Endpoint {
    param(
        [string]$Method,
        [string]$Endpoint,
        [string]$Description,
        [hashtable]$Body,
        [hashtable]$Headers = @{}
    )
    
    $URL = "$BaseURL$Endpoint"
    Write-Host "`n========================================" -ForegroundColor Cyan
    Write-Host "Test: $Description" -ForegroundColor Yellow
    Write-Host "Method: $Method | URL: $URL" -ForegroundColor Gray
    
    try {
        if ($Body) {
            $JsonBody = $Body | ConvertTo-Json
            Write-Host "Body: $JsonBody" -ForegroundColor Gray
            $response = Invoke-WebRequest -Uri $URL -Method $Method -Body $JsonBody -ContentType "application/json" -Headers $Headers -ErrorAction Stop
        } else {
            $response = Invoke-WebRequest -Uri $URL -Method $Method -ContentType "application/json" -Headers $Headers -ErrorAction Stop
        }
        
        Write-Host "Status: $($response.StatusCode) - $($response.StatusDescription)" -ForegroundColor Green
        Write-Host "Response:" -ForegroundColor Green
        $response.Content | ConvertFrom-Json | ConvertTo-Json | Write-Host -ForegroundColor Green
        $SuccessCount++
    } catch {
        Write-Host "Status: $($_.Exception.Response.StatusCode) - $($_.Exception.Response.StatusDescription)" -ForegroundColor Red
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        $FailCount++
    }
}

Write-Host "===== CampsHub API Endpoint Tests =====" -ForegroundColor Magenta
Write-Host "Base URL: $BaseURL" -ForegroundColor Cyan
Write-Host "Starting tests at $(Get-Date)" -ForegroundColor Cyan

# Wait for server to be ready
Write-Host "`nWaiting for server to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# ==================== FACILITIES ENDPOINTS ====================
Write-Host "`n`n#### FACILITIES ENDPOINTS ####" -ForegroundColor Magenta

# 1. Get All Facilities
Test-Endpoint -Method "GET" -Endpoint "/facilities" -Description "Get all facilities"

# 2. Create a Facility
$facilityBody = @{
    name = "Computer Lab A"
    type = "LAB"
    capacity = 30
    location = "Building 1"
    description = "Advanced programming lab"
    status = "ACTIVE"
}
Test-Endpoint -Method "POST" -Endpoint "/facilities" -Description "Create facility" -Body $facilityBody

# 3. Search Facilities by type
Test-Endpoint -Method "GET" -Endpoint "/facilities?type=ROOM" -Description "Search facilities by type"

# 4. Search Facilities by capacity
Test-Endpoint -Method "GET" -Endpoint "/facilities?minCapacity=20" -Description "Search facilities by capacity"

# ==================== AUTH ENDPOINTS ====================
Write-Host "`n`n#### AUTH ENDPOINTS ####" -ForegroundColor Magenta

# Test unauthenticated access to protected endpoint
Test-Endpoint -Method "GET" -Endpoint "/auth/me" -Description "Get current user (should fail without auth)"

# ==================== BOOKINGS ENDPOINTS ====================
Write-Host "`n`n#### BOOKINGS ENDPOINTS ####" -ForegroundColor Magenta

# Get all bookings
Test-Endpoint -Method "GET" -Endpoint "/bookings" -Description "Get all bookings"

# ==================== NOTIFICATIONS ENDPOINTS ====================
Write-Host "`n`n#### NOTIFICATIONS ENDPOINTS ####" -ForegroundColor Magenta

# Get notifications (should fail without auth)
Test-Endpoint -Method "GET" -Endpoint "/notifications" -Description "Get notifications (should fail without auth)"

# Get unread count (should fail without auth)
Test-Endpoint -Method "GET" -Endpoint "/notifications/unread/count" -Description "Get unread count (should fail without auth)"

# ==================== TICKETS ENDPOINTS ====================
Write-Host "`n`n#### TICKETS ENDPOINTS ####" -ForegroundColor Magenta

# Get all tickets
Test-Endpoint -Method "GET" -Endpoint "/tickets" -Description "Get all tickets"

# Get tickets by status
Test-Endpoint -Method "GET" -Endpoint "/tickets?status=OPEN" -Description "Get tickets by status (OPEN)"

# ==================== TEST SUMMARY ====================
Write-Host "`n`n===== TEST SUMMARY =====" -ForegroundColor Magenta
Write-Host "Successful Tests: $SuccessCount" -ForegroundColor Green
Write-Host "Failed Tests: $FailCount" -ForegroundColor Red
Write-Host "Total Tests: $($SuccessCount + $FailCount)" -ForegroundColor Cyan
Write-Host "Completed at $(Get-Date)" -ForegroundColor Cyan
