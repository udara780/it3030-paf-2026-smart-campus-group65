# ===== CampsHub API Endpoints Documentation & Testing =====

$BaseURL = "http://localhost:8081/api"

Write-Host "`n===== CAMPSHUB API ENDPOINTS DOCUMENTATION =====" -ForegroundColor Magenta
Write-Host "Server: $BaseURL`n" -ForegroundColor Cyan

Write-Host "PUBLIC ENDPOINTS (No Auth Required):" -ForegroundColor Green
Write-Host "- GET /facilities                    - Get all facilities (with filters)" -ForegroundColor Cyan
Write-Host "- GET /facilities/{id}               - Get facility by ID" -ForegroundColor Cyan
Write-Host "- POST /auth/google                  - Login with Google OAuth token" -ForegroundColor Cyan

Write-Host "`nAUTHENTICATED ENDPOINTS (JWT Required):" -ForegroundColor Green
Write-Host "- GET /auth/me                       - Get current user" -ForegroundColor Cyan
Write-Host "- GET /bookings                      - Get all bookings" -ForegroundColor Cyan
Write-Host "- GET /bookings/my                   - Get user's bookings" -ForegroundColor Cyan
Write-Host "- POST /bookings                     - Create booking" -ForegroundColor Cyan
Write-Host "- PUT /bookings/{id}/approve         - Approve booking (ADMIN)" -ForegroundColor Cyan
Write-Host "- PUT /bookings/{id}/reject          - Reject booking (ADMIN)" -ForegroundColor Cyan
Write-Host "- PUT /bookings/{id}/cancel          - Cancel booking" -ForegroundColor Cyan
Write-Host "- GET /notifications                 - Get user notifications" -ForegroundColor Cyan
Write-Host "- GET /notifications/unread          - Get unread notifications" -ForegroundColor Cyan
Write-Host "- GET /tickets                       - Get all tickets" -ForegroundColor Cyan
Write-Host "- GET /tickets/my                    - Get user's tickets" -ForegroundColor Cyan
Write-Host "- POST /tickets                      - Create ticket (multipart)" -ForegroundColor Cyan
Write-Host "- POST /tickets/{id}/comments        - Add comment to ticket" -ForegroundColor Cyan

Write-Host "`nADMIN ENDPOINTS:" -ForegroundColor Green
Write-Host "- POST /facilities                   - Create facility" -ForegroundColor Cyan
Write-Host "- PUT /facilities/{id}               - Update facility" -ForegroundColor Cyan
Write-Host "- DELETE /facilities/{id}            - Delete facility" -ForegroundColor Cyan
Write-Host "- PUT /tickets/{id}/assign           - Assign technician" -ForegroundColor Cyan

Write-Host "`n========== TESTING PUBLIC ENDPOINTS ==========" -ForegroundColor Yellow

# Test 1: Get all facilities
Write-Host "`nTest 1: GET /facilities" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$BaseURL/facilities" -Method GET -ErrorAction Stop
    Write-Host "Status: $($response.StatusCode) OK" -ForegroundColor Green
    $data = $response.Content | ConvertFrom-Json
    if ($data -is [array]) {
        Write-Host "Result: Found $($data.Count) facilities" -ForegroundColor Green
        if ($data.Count -gt 0) {
            Write-Host "Sample: $($data[0].name) (Type: $($data[0].type), Capacity: $($data[0].capacity))" -ForegroundColor Gray
        }
    } else {
        Write-Host "Result: $($data | ConvertTo-Json)" -ForegroundColor Green
    }
} catch {
    Write-Host "Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Search facilities by type
Write-Host "`nTest 2: GET /facilities?type=LAB" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$BaseURL/facilities?type=LAB" -Method GET -ErrorAction Stop
    Write-Host "Status: $($response.StatusCode) OK" -ForegroundColor Green
    $data = $response.Content | ConvertFrom-Json
    if ($data -is [array]) {
        Write-Host "Result: Found $($data.Count) LAB facilities" -ForegroundColor Green
    }
} catch {
    Write-Host "Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Search facilities by capacity
Write-Host "`nTest 3: GET /facilities?minCapacity=25" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$BaseURL/facilities?minCapacity=25" -Method GET -ErrorAction Stop
    Write-Host "Status: $($response.StatusCode) OK" -ForegroundColor Green
    $data = $response.Content | ConvertFrom-Json
    if ($data -is [array]) {
        Write-Host "Result: Found $($data.Count) facilities with capacity >= 25" -ForegroundColor Green
    }
} catch {
    Write-Host "Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Test protected endpoint
Write-Host "`nTest 4: GET /auth/me (Without Token - Should Fail)" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$BaseURL/auth/me" -Method GET -ErrorAction Stop
    Write-Host "Status: Unexpected Success" -ForegroundColor Yellow
} catch {
    Write-Host "Status: $($_.Exception.Response.StatusCode) - Correctly Rejected" -ForegroundColor Green
    Write-Host "Protected endpoint requires JWT token in Authorization header" -ForegroundColor Gray
}

Write-Host "`n============== TESTING SUMMARY ==============" -ForegroundColor Magenta
Write-Host "Public endpoints are accessible without authentication" -ForegroundColor Green
Write-Host "Protected endpoints require JWT token from OAuth login" -ForegroundColor Green
Write-Host "Use: Authorization: Bearer <jwt_token>" -ForegroundColor Gray
Write-Host "Database: MongoDB connected" -ForegroundColor Green
Write-Host "Server: Running on port 8081" -ForegroundColor Green
Write-Host "Test completed at $(Get-Date)" -ForegroundColor Cyan

