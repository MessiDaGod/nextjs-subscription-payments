#!/bin/bash

# Generate types with supabase
npx supabase gen types typescript --project-id "rhsukgckhrdjzbribahe" --schema public > components/types/supabase.d.ts

# Check if the destination file exists, if not, create it
[ ! -f components/types/supabase.d.ts ] && touch components/types/supabase.d.ts

# Copy the .d.ts file to public directory
cp components/types/supabase.d.ts public/supabase.d.ts

# Check if the copied file exists, if not, create it
[ ! -f public/supabase.d.ts ] && touch public/supabase.d.ts

# Generate JSON schema
npx ts-json-schema-generator --path '/Users/joeshakely/Projects/nextjs-subscription-payments/public/supabase.d.ts' --type 'Database' > /Users/joeshakely/Projects/nextjs-subscription-payments/public/supabase.json

# Check if the JSON schema file exists, if not, create it
[ ! -f /Users/joeshakely/Projects/nextjs-subscription-payments/public/supabase.json ] && touch /Users/joeshakely/Projects/nextjs-subscription-payments/public/supabase.json