$envContent = @"
NEXT_PUBLIC_SUPABASE_URL=https://phbfwaxtmeavqmaiiaghj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBoYmZ3YXh0bWVhdnFtaWFpZ2hqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3Njg1NjIsImV4cCI6MjA2NTM0NDU2Mn0.frjBPH7uZmEAH9NaO2LHoniym41voYlkA-nAWabO_Ck
"@

$envContent | Out-File -FilePath ".env.local" -Encoding UTF8
Write-Host "Environment file created successfully!" 