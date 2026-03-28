#!/bin/bash
# Update products with release dates and creator info via Supabase REST API

URL="https://smfrysqapzwdjfscltmq.supabase.co/rest/v1/products"
KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtZnJ5c3FhcHp3ZGpmc2NsdG1xIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDU1MzU1MiwiZXhwIjoyMDkwMTI5NTUyfQ.6OIb0Currb1nADd3riwFYGp-muQcpsCeH1qycy8P1Tg"

update() {
  local slug="$1"
  shift
  local code
  code=$(curl -s -o /dev/null -w "%{http_code}" -X PATCH "$URL?slug=eq.$slug" \
    -H "apikey: $KEY" \
    -H "Authorization: Bearer $KEY" \
    -H "Content-Type: application/json" \
    -H "Prefer: return=minimal" \
    -d "$1")
  echo "  $slug: $code"
}

echo "=== Neal Fun products (Neal Agarwal @nealagarwal) ==="
update "absurd-trolley-problems" '{"released_at":"2022-07-07","maker_name":"Neal Agarwal","maker_twitter":"@nealagarwal"}'
update "design-the-next-iphone" '{"released_at":"2022-08-24","maker_name":"Neal Agarwal","maker_twitter":"@nealagarwal"}'
update "password-game" '{"released_at":"2023-06-27","maker_name":"Neal Agarwal","maker_twitter":"@nealagarwal"}'
update "infinite-craft" '{"released_at":"2024-01-31","maker_name":"Neal Agarwal","maker_twitter":"@nealagarwal"}'
update "perfect-circle" '{"released_at":"2023-01-06","maker_name":"Neal Agarwal","maker_twitter":"@nealagarwal"}'
update "asteroid-launcher" '{"released_at":"2023-01-09","maker_name":"Neal Agarwal","maker_twitter":"@nealagarwal"}'
update "internet-artifacts" '{"released_at":"2023-10-25","maker_name":"Neal Agarwal","maker_twitter":"@nealagarwal"}'
update "sandboxels" '{"released_at":"2026-02-09","maker_name":"R74n","maker_twitter":"@R74nCom"}'
update "life-stats" '{"released_at":"2020-01-22","maker_name":"Neal Agarwal","maker_twitter":"@nealagarwal"}'
update "deep-sea" '{"released_at":"2019-12-02","maker_name":"Neal Agarwal","maker_twitter":"@nealagarwal"}'
update "progress" '{"released_at":"2017-11-23","maker_name":"Neal Agarwal","maker_twitter":"@nealagarwal"}'
update "guess-the-year" '{"released_at":"2024-01-01","maker_name":"Neal Agarwal","maker_twitter":"@nealagarwal"}'
update "paper-dolls" '{"released_at":"2023-01-01","maker_name":"Neal Agarwal","maker_twitter":"@nealagarwal"}'

echo ""
echo "=== Vibe-coded / newer products ==="
update "slapmac" '{"released_at":"2026-03-19","maker_name":"Josh Lofi","maker_twitter":"@joshlofi"}'
update "pong-wars" '{"released_at":"2024-01-28","maker_name":"Koen van Gilst","maker_twitter":"@vnglst"}'
update "doom-captcha" '{"released_at":"2021-05-01","maker_name":"Miquel Camps Orteza","maker_twitter":"@miquel_camps"}'
update "fly" '{"released_at":"2025-02-23","maker_name":"Pieter Levels","maker_twitter":"@levelsio"}'
update "puter" '{"released_at":"2024-03-01","maker_name":"Nariman Jelveh","maker_twitter":"@KernelKetchup"}'
update "doomscroll" '{"released_at":"2025-08-01","maker_name":"David Friedman","maker_twitter":"@ironicsans"}'
update "menugen" '{"released_at":"2025-04-27","maker_name":"Andrej Karpathy","maker_twitter":"@karpathy"}'
update "vibechess" '{"released_at":"2025-03-01","maker_twitter":"@floomby"}'
update "tetdle" '{"released_at":"2025-03-01","maker_twitter":"@galenrobins"}'
update "storypot" '{"maker_name":"Akshan Ish","maker_twitter":"@akshanish"}'
update "dog-e-dex" '{"released_at":"2025-05-01","maker_name":"Cynthia Chen","maker_twitter":"@yescynfria"}'
update "vibesail" '{"released_at":"2025-03-01","maker_name":"Nicola Manzini","maker_twitter":"@NicolaManzini"}'
update "crash-out-diary" '{"released_at":"2025-05-01","maker_name":"Karima Williams","maker_twitter":"@KarimaDigital"}'
update "vibeware" '{"maker_name":"Alex Reibman","maker_twitter":"@AlexReibman"}'
update "tower-of-time" '{"released_at":"2025-07-01","maker_name":"Maciej Trebacz","maker_twitter":"@maciekdmd90"}'
update "bitchat" '{"maker_name":"Nick Nish","maker_twitter":"@nickjnish"}'
update "the-great-taxi-assignment" '{"released_at":"2025-04-01","maker_name":"Tomas Bencko","maker_twitter":"@TomasBencko"}'
update "how-many-layers" '{"released_at":"2024-09-04","maker_name":"Vijith Quadros","maker_twitter":"@vijithq"}'
update "cowboy-shooter" '{"maker_twitter":"@raymelon_"}'
update "vector-tango" '{"maker_name":"Peter Scobel","maker_twitter":"@PeterScobel"}'

echo ""
echo "=== Classic web products ==="
update "hacker-typer" '{"released_at":"2011-06-01","maker_name":"Simone Masiero","maker_twitter":"@duiker101"}'
update "thispersondoesnotexist" '{"released_at":"2019-02-01","maker_name":"Phillip Wang","maker_twitter":"@philip_wang"}'
update "pointer-pointer" '{"released_at":"2012-06-01","maker_name":"Studio Moniker","maker_twitter":"@StudioMoniker"}'
update "inspirobot" '{"released_at":"2015-07-01","maker_name":"Peder Jorgensen"}'
update "weavesilk" '{"released_at":"2011-01-01","maker_name":"Yuri Vishnevsky","maker_twitter":"@yurivish"}'
update "akinator" '{"released_at":"2007-08-01","maker_name":"Arnaud Megret"}'
update "thiscatdoesnotexist" '{"released_at":"2019-02-01","maker_name":"Phillip Wang","maker_twitter":"@philip_wang"}'
update "ai-dungeon" '{"released_at":"2019-05-01","maker_name":"Nick Walton","maker_twitter":"@nickwalton00"}'
update "robohash" '{"released_at":"2011-01-01","maker_name":"Colin Davis"}'
update "is-it-christmas" '{"released_at":"2007-10-12","maker_name":"Eric Mill","maker_twitter":"@konklone"}'
update "little-alchemy" '{"released_at":"2010-12-08","maker_name":"Jakub Koziol","maker_twitter":"@JakubKoziol"}'
update "the-wiki-game" '{"released_at":"2011-11-21","maker_name":"Alex Clemesha","maker_twitter":"@clemesha"}'
update "radio-garden" '{"released_at":"2016-12-13","maker_name":"Jonathan Puckey","maker_twitter":"@jonathanpuckey"}'
update "type-racer" '{"released_at":"2008-03-01","maker_name":"Alex Epshteyn","maker_twitter":"@typeracerAlex"}'
update "typatone" '{"released_at":"2015-01-01","maker_name":"Jono Brandel","maker_twitter":"@jonobr1"}'
update "windows93" '{"released_at":"2014-10-01","maker_name":"jankenpopp & Zombectro","maker_twitter":"@windows93net"}'
update "the-useless-web" '{"released_at":"2012-11-05","maker_name":"Tim Holman","maker_twitter":"@twholman"}'
update "blob-opera" '{"released_at":"2020-12-15","maker_name":"David Li","maker_twitter":"@daviddotli"}'
update "quick-draw" '{"released_at":"2016-11-15","maker_name":"Google Creative Lab","maker_twitter":"@googlecreativelab"}'
update "patatap" '{"released_at":"2014-03-25","maker_name":"Jono Brandel","maker_twitter":"@jonobr1"}'
update "codepen" '{"released_at":"2012-06-18","maker_name":"Chris Coyier"}'
update "bruno-simon" '{"released_at":"2019-10-24","maker_name":"Bruno Simon","maker_twitter":"@bruno_simon"}'
update "is-it-big" '{"maker_name":"Yoann Moinet","maker_twitter":"@yoannm"}'
update "scribble-diffusion" '{"released_at":"2023-02-16","maker_name":"Zeke Sikelianos","maker_twitter":"@zeke"}'
update "monkeytype" '{"released_at":"2020-05-15","maker_name":"Miodec","maker_twitter":"@monkeytype"}'
update "geoguessr" '{"released_at":"2013-05-10","maker_name":"Anton Wallen","maker_twitter":"@antonwallen"}'
update "bongo-cat" '{"released_at":"2018-09-01","maker_name":"Eric Huber"}'
update "gameboy-live" '{"released_at":"2019-05-01","maker_name":"Aaron Liu"}'
update "pixel-thoughts" '{"released_at":"2015-05-01","maker_name":"Marc Balaban","maker_twitter":"@MarcBalaban"}'
update "the-infinite-jukebox" '{"released_at":"2012-11-11","maker_name":"Paul Lamere","maker_twitter":"@plamere"}'

echo ""
echo "=== Misc products ==="
update "donger-list" '{"released_at":"2014-10-01","maker_name":"Frank Neulichedl","maker_twitter":"@dongerlist"}'
update "generative-fm" '{"released_at":"2018-01-01","maker_name":"Alex Bainter","maker_twitter":"@alex_bainter"}'
update "every-noise-at-once" '{"released_at":"2013-04-01","maker_name":"Glenn McDonald","maker_twitter":"@glenn_mcdonald"}'
update "radiooooo" '{"released_at":"2013-01-01","maker_name":"Benjamin Moreau","maker_twitter":"@monsieurmoru"}'
update "incredibox" '{"released_at":"2009-08-16","maker_name":"So Far So Good","maker_twitter":"@incredibox_"}'
update "eel-slap" '{"released_at":"2011-03-01","maker_name":"Per Stenius"}'
update "koalas-to-the-max" '{"released_at":"2011-02-20","maker_name":"Vadim Ogievetsky","maker_twitter":"@vogievetsky"}'
update "the-scale-of-the-universe" '{"released_at":"2012-04-01","maker_name":"Cary Huang & Michael Huang"}'
update "window-swap" '{"released_at":"2020-06-05","maker_name":"Sonali Ranjit","maker_twitter":"@thecoookielady"}'
update "let-me-google-that-for-you" '{"released_at":"2008-11-18","maker_name":"Jim Garvin"}'
update "ai-weirdness" '{"released_at":"2016-01-01","maker_name":"Janelle Shane","maker_twitter":"@JanelleCShane"}'
update "staggering-beauty" '{"released_at":"2012-08-17","maker_name":"George Michael Brower","maker_twitter":"@georgealways"}'
update "zoom-earth" '{"released_at":"2005-08-01","maker_name":"Paul Neave","maker_twitter":"@neave"}'
update "earth-fm" '{"released_at":"2022-01-01","maker_name":"Catalin Zorzini","maker_twitter":"@zorzini"}'
update "space-engine" '{"released_at":"2010-06-19","maker_name":"Vladimir Romanyuk","maker_twitter":"@SpaceEngineSim"}'
update "universe-sandbox" '{"released_at":"2008-05-01","maker_name":"Dan Dixon","maker_twitter":"@DanDixon"}'
update "cat-bounce" '{"released_at":"2012-01-01","maker_name":"Tara Sinn"}'
update "a-soft-murmur" '{"released_at":"2014-03-21","maker_name":"Gabriel Brady","maker_twitter":"@asoftmurmur"}'
update "font-in-use" '{"released_at":"2010-12-21","maker_name":"Stephen Coles","maker_twitter":"@FontsInUse"}'
update "sweaterify" '{"released_at":"2015-12-15","maker_name":"Mariko Kosaka","maker_twitter":"@kosamari"}'
update "semantris" '{"released_at":"2018-04-13","maker_name":"Google"}'
update "the-restart-page" '{"released_at":"2011-06-06","maker_name":"Soon in Tokyo","maker_twitter":"@soonintokyo"}'
update "null-island" '{"released_at":"2008-01-01","maker_name":"Steve Pellegrin"}'

echo ""
echo "Done! Updated $(grep -c 'update ' "$0") products."
