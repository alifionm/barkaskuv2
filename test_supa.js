const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: { autoRefreshToken: false, persistSession: false }
  }
);

async function checkAds() {
  const { data, error } = await supabase.from('ads').select('*');
  console.log('Ads:', JSON.stringify(data, null, 2));
  console.log('Error:', error);
}

checkAds();
