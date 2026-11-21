const channelId = 'UCgstM8XDMcfls60K7oP8wkw';
const sources = [
  'https://www.youtube.com/channel/' + channelId + '/live',
  'https://www.youtube.com/@cog-shootershilljamaica9924/live',
  'https://www.youtube.com/channel/' + channelId + '/streams'
];

function readPlayer(html, name = 'ytInitialPlayerResponse') {
  const assignment = html.match(new RegExp(name + '\\s*=\\s*'));
  if (!assignment) return null;
  const marker = assignment[0];
  const start = assignment.index;
  // Parse the JSON object without depending on YouTube's script-tag formatting.
  const text = html.slice(start + marker.length);
  let depth = 0, quoted = false, escaped = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (quoted) {
      if (escaped) escaped = false;
      else if (char === '\\') escaped = true;
      else if (char === '"') quoted = false;
    } else if (char === '"') quoted = true;
    else if (char === '{') depth++;
    else if (char === '}' && --depth === 0) return JSON.parse(text.slice(0, i + 1));
  }
  return null;
}


function findLiveVideo(value) {
  if (!value || typeof value !== 'object') return null;
  const card = value.videoRenderer || value.lockupViewModel;
  if (card) {
    const text = JSON.stringify(card);
    const id = card.videoId || card.contentId;
    if (/^[\w-]{11}$/.test(id || '') && /BADGE_STYLE_TYPE_LIVE_NOW|THUMBNAIL_OVERLAY_BADGE_STYLE_LIVE|"style":"LIVE"/.test(text)) {
      return { videoId: id, isLive: true, title: card.title?.runs?.map(run => run.text).join('') || card.metadata?.lockupMetadataViewModel?.title?.content || '' };
    }
  }
  for (const child of Object.values(value)) {
    const live = findLiveVideo(child);
    if (live) return live;
  }
  return null;
}

async function resolveBroadcast(source) {
  const response = await fetch(source + '?hl=en&live_check=' + Math.floor(Date.now() / 30000), {
    headers: { 'User-Agent': 'Mozilla/5.0', 'Accept-Language': 'en-US,en;q=0.9' },
    cache: 'no-store',
    signal: AbortSignal.timeout(12000)
  });
  if (!response.ok) throw new Error('Channel lookup failed');
  const html = await response.text();
  const player = readPlayer(html);
  const details = player?.videoDetails;
  const data = readPlayer(html, 'ytInitialData');
  const live = findLiveVideo(data);
  if (live) return live;
  const canonical = html.match(/<link\b[^>]*\brel="canonical"[^>]*\bhref="([^"]+)"/i);
  const url = new URL(canonical?.[1] || response.url || source, source);
  const videoId = details?.videoId || url.searchParams.get('v');
  if (!/^[\w-]{11}$/.test(videoId || '') || (details?.channelId && details.channelId !== channelId)) {
    throw new Error('No broadcast found: ' + response.url + ' title=' + (html.match(/<title>(.*?)<\/title>/)?.[1] || '') + ' bytes=' + html.length + ' canonical=' + canonical?.[1] + ' ids=' + (html.match(/"videoId":"[^"]+"/g) || []).slice(0,3).join(','));
  }
  return { videoId, isLive: details?.isLive === true, title: details?.title || '' };
}

module.exports = async function live(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const results = await Promise.allSettled(sources.map(resolveBroadcast));
  const broadcasts = results.filter(result => result.status === 'fulfilled').map(result => result.value);
  console.log('Broadcast lookups', results.map(result => result.status === 'rejected' ? String(result.reason) : result.value));
  const current = broadcasts.find(video => video.isLive) || broadcasts[0];
  if (current) return res.status(200).json(current);
  return res.status(503).json({ videoId: null, retryAfter: 30 });
};
