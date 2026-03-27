const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read .env.local manually
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) env[match[1]] = match[2];
});

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
);

// IDs to delete (non-memeable, boring SaaS/tools)
const boringIds = [
  'ea8b290d-69c9-4e97-abf9-9806ef48bbff', // Cal.com
  '9f265e93-28f1-4366-a3c3-c7618e15aa56', // Tally
  '1c9d1a36-aba6-47a0-b436-801a2776e348', // Splitbee
  'be688a3a-9c2f-4423-bdd7-f20161a9df94', // Pico CSS
  '45689852-511b-4c84-b6d1-ae06b09cc0e5', // Typefully
  '9bfca511-6769-4791-b128-5c270cec14be', // Chatbase
  '22038d3a-2c35-427a-8927-3b935d6c9750', // Tweetlio
  '3b481637-b1dd-4dfc-b8c6-feb1645bfc44', // Osum
  '91cb7e84-12e1-40b8-98aa-513734c53e94', // ScreenshotOne
  'bca25365-beda-4db4-b1e1-7de74c57fd79', // Pricetag
  '6468b8e8-efaf-433e-a8ea-3ccd2e24cf32', // Scira
  'abda9f66-7a0d-4889-b8f6-7780ac229412', // Textbee
  'f08934ec-c86f-404f-91b7-cc4ce30bcd9a', // PromptBase
  '42901b02-af76-4bbb-8c83-346e0feec82a', // BrowserUse
  '99e4dc32-a415-4938-af2f-e8da597d6564', // Pika
  'c9e4afac-7849-4e96-84b3-9bcd23746f8b', // RapidPages
  '6208f8dd-76e8-4e20-a6f9-1308f8191b55', // Diagram
  '136fab98-14cc-42d8-9782-a0a8ae87dd91', // QuickMVP
  '06871b23-d06f-4e1a-8727-9440ca871de2', // ShipFast
  '7a33c052-e5e7-4204-bbd2-9b61442c27fb', // IndiePage
  '810c31ec-fc50-47ac-b995-8131eb86337b', // Recraft
  'df5299b4-36d1-4590-ac31-b299d314fcfb', // VoiceDrop
  'bf3b01a7-2296-40fc-af94-1bbfe9b4daac', // InteriorAI
  '3328936e-09f2-46e8-90c0-cf8b4a02ea2f', // PhotoAI
  '728fb9ce-7a93-4fa8-94a9-057bcefebef3', // AvatarAI
  '0ccd94c3-f9ff-48c9-962a-7011204daaa8', // Ponder
  '9cd5d9fb-0b2b-4ad8-821d-de66b89df57d', // PixelMe
  'f04a84f7-5bdc-4634-89f2-ae506be4bf42', // Receipt Bot
  '7d7e3801-e63f-445e-969f-93c779bb6295', // SpeakAI
  'dbb75280-c98e-4618-a93c-8d5003f10b6a', // Plock
  '650c412e-c4e1-4707-a25a-4c508f1f0ab2', // Pika Video
  '00e18b8c-4bbf-41c6-89cd-74d49d86260e', // SVGVibes
  '0336e2b2-1100-4921-be88-cb07eca44710', // Wanna
  '9a35f28a-f4ee-4312-94c4-337085d1a30d', // Mixcard
];

async function deleteProducts() {
  console.log(`Deleting ${boringIds.length} boring products...`);
  
  for (const id of boringIds) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting ${id}:`, error);
    } else {
      console.log(`✓ Deleted ${id}`);
    }
  }
  
  console.log('\nDone!');
}

deleteProducts();
