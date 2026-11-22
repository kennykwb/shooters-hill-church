const readPlayer = require('../lib/youtube-data');
const channelId = 'UCgstM8XDMcfls60K7oP8wkw';

function completedStreams(data) {
  const tabs = data?.contents?.twoColumnBrowseResultsRenderer?.tabs || data?.contents?.singleColumnBrowseResultsRenderer?.tabs || [];
  const selected = tabs.find(tab => tab.tabRenderer?.selected)?.tabRenderer;
  if (!selected?.content) throw new Error('Stream listing unavailable');
  const streams = [];
  const seen = new Set();
  function visit(value) {
    if (!value || typeof value !== 'object' || streams.length === 6) return;
    const card = value.videoRenderer || value.lockupViewModel;
    if (card) {
      const id = card.videoId || card.contentId;
      const meta = card.metadata?.lockupMetadataViewModel;
      const title = meta?.title?.content || card.title?.runs?.map(run => run.text).join('') || card.title?.simpleText;
      const status = JSON.stringify([card.badges, card.thumbnailOverlays, card.upcomingEventData, card.contentImage?.thumbnailViewModel?.overlays, meta?.metadata, card.publishedTimeText]);
      const pending = card.upcomingEventData || /BADGE_STYLE_TYPE_LIVE_NOW|THUMBNAIL_OVERLAY_BADGE_STYLE_LIVE|"style":"LIVE"|"style":"UPCOMING"|"text":"Upcoming"|Scheduled for|Premieres /i.test(status);
      const completed = /Streamed /i.test(status);
      if (!pending && completed && /^[\w-]{11}$/.test(id || '') && title && !seen.has(id)) {
        seen.add(id);
        streams.push({ videoId: id, title });
      }
      return;
    }
    for (const child of Object.values(value)) visit(child);
  }
  visit(selected.content);
  if (!streams.length) throw new Error('No completed broadcasts found');
  return streams;
}

module.exports = async function pastStreams(req, res) {
  try {
    const response = await fetch('https://www.youtube.com/channel/' + channelId + '/streams?hl=en&sort=dd&check=' + Math.floor(Date.now() / 60000), {
      headers: { 'User-Agent': 'Mozilla/5.0', 'Accept-Language': 'en-US,en;q=0.9' },
      cache: 'no-store',
      signal: AbortSignal.timeout(12000)
    });
    if (!response.ok) throw new Error('YouTube unavailable');
    const streams = completedStreams(readPlayer(await response.text(), 'ytInitialData'));
    res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=60');
    return res.status(200).json({ streams });
  } catch {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(503).json({ streams: [], retryAfter: 60 });
  }
};
