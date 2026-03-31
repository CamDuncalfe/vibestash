#!/bin/bash
# Fetch video from an X/Twitter post and upload to Supabase for a VibeStash product
# Usage: ./fetch-x-videos.sh <slug> <tweet_url>
#
# Example: ./fetch-x-videos.sh asteroid-launcher https://x.com/nealagarwal/status/2020890953184145635

set -e

SLUG="$1"
TWEET_URL="$2"
SUPABASE_URL="https://smfrysqapzwdjfscltmq.supabase.co"
SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtZnJ5c3FhcHp3ZGpmc2NsdG1xIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDU1MzU1MiwiZXhwIjoyMDkwMTI5NTUyfQ.6OIb0Currb1nADd3riwFYGp-muQcpsCeH1qycy8P1Tg"
BUCKET="product-videos"
PREFIX="recordings"

if [ -z "$SLUG" ] || [ -z "$TWEET_URL" ]; then
  echo "Usage: $0 <slug> <tweet_url>"
  exit 1
fi

TMPFILE="/tmp/x-video-${SLUG}.mp4"

echo "[$SLUG] Downloading from $TWEET_URL..."
yt-dlp --no-check-certificates -f "best[ext=mp4]" -o "$TMPFILE" "$TWEET_URL" 2>&1 | tail -3

if [ ! -f "$TMPFILE" ]; then
  echo "[$SLUG] ❌ Download failed"
  exit 1
fi

FILESIZE=$(stat -f%z "$TMPFILE")
echo "[$SLUG] Downloaded: $(( FILESIZE / 1024 ))KB"

# Trim to max 15 seconds if longer
DURATION=$(ffprobe -v quiet -show_entries format=duration -of csv=p=0 "$TMPFILE" | cut -d. -f1)
if [ "$DURATION" -gt 15 ]; then
  echo "[$SLUG] Trimming from ${DURATION}s to 15s..."
  TRIMMED="/tmp/x-video-${SLUG}-trimmed.mp4"
  ffmpeg -y -i "$TMPFILE" -t 15 -c copy "$TRIMMED" 2>/dev/null
  mv "$TRIMMED" "$TMPFILE"
fi

# Upload to Supabase storage (overwrite existing)
STORAGE_PATH="${PREFIX}/${SLUG}.mp4"
echo "[$SLUG] Uploading to Supabase..."

# Try upsert first
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
  -X PUT \
  "${SUPABASE_URL}/storage/v1/object/${BUCKET}/${STORAGE_PATH}" \
  -H "apikey: ${SUPABASE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_KEY}" \
  -H "Content-Type: video/mp4" \
  -H "x-upsert: true" \
  --data-binary "@${TMPFILE}")

if [ "$HTTP_CODE" != "200" ]; then
  # Try POST (new file)
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
    -X POST \
    "${SUPABASE_URL}/storage/v1/object/${BUCKET}/${STORAGE_PATH}" \
    -H "apikey: ${SUPABASE_KEY}" \
    -H "Authorization: Bearer ${SUPABASE_KEY}" \
    -H "Content-Type: video/mp4" \
    --data-binary "@${TMPFILE}")
fi

VIDEO_URL="${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${STORAGE_PATH}"

if [ "$HTTP_CODE" = "200" ]; then
  echo "[$SLUG] Uploaded: $VIDEO_URL"
  
  # Update DB
  curl -s -o /dev/null -w "" \
    -X PATCH \
    "${SUPABASE_URL}/rest/v1/products?slug=eq.${SLUG}" \
    -H "apikey: ${SUPABASE_KEY}" \
    -H "Authorization: Bearer ${SUPABASE_KEY}" \
    -H "Content-Type: application/json" \
    -H "Prefer: return=minimal" \
    -d "{\"video_url\": \"${VIDEO_URL}\"}"
  
  echo "[$SLUG] ✅ Done"
else
  echo "[$SLUG] ❌ Upload failed (HTTP $HTTP_CODE)"
fi

# Cleanup
rm -f "$TMPFILE"
