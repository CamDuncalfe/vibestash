#!/bin/bash
# Batch interactive video recorder with per-product timeout
# Usage: bash batch-interactive-record.sh
# Reads product list from stdin or a file

cd /Users/jerry/workspace/projects/vibestash
SCRIPT="node scripts/interactive-record.js"
TIMEOUT=45  # seconds per product

record() {
  local slug="$1"
  local url="$2"
  local duration="$3"
  local plan="$4"
  
  echo "[$((++COUNT))/$TOTAL] Recording $slug..."
  
  $SCRIPT "$slug" "$url" --duration "$duration" --plan-inline "$plan" &
  local pid=$!
  
  local waited=0
  while kill -0 $pid 2>/dev/null && [ $waited -lt $TIMEOUT ]; do
    sleep 1
    waited=$((waited + 1))
  done
  
  if kill -0 $pid 2>/dev/null; then
    echo "  ⏱️ TIMEOUT after ${TIMEOUT}s - killing"
    kill $pid 2>/dev/null
    sleep 2
    kill -9 $pid 2>/dev/null
    return 1
  fi
  
  wait $pid
  return $?
}

COUNT=0
TOTAL=0
SUCCESS=0
FAIL=0

# Count total
while IFS='|' read -r slug url duration plan; do
  TOTAL=$((TOTAL + 1))
done < "$1"

COUNT=0

# Process
while IFS='|' read -r slug url duration plan; do
  if record "$slug" "$url" "$duration" "$plan"; then
    SUCCESS=$((SUCCESS + 1))
  else
    FAIL=$((FAIL + 1))
  fi
  
  # Small pause between products to let tabs close
  sleep 1
done < "$1"

echo ""
echo "=== BATCH COMPLETE ==="
echo "Success: $SUCCESS / $TOTAL"
echo "Failed: $FAIL"
