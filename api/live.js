const channelLive = 'https://www.youtube.com/channel/UCgstM8XDMcfls60K7oP8wkw/live';

module.exports = async function live(req, res) {
  try {
    const page = await fetch(channelLive, { signal: AbortSignal.timeout(6500) });
    if (!page.ok) throw new Error('Channel unavailable');
    const html = await page.text();
    const canonical = html.match(/<link\b[^>]*\brel="canonical"[^>]*\bhref="([^"]+)"/i);
    const url = new URL(canonical?.[1] || page.url);
    const videoId = url.searchParams.get('v');
    if (url.hostname === 'www.youtube.com' && url.pathname === '/watch' && /^[\w-]{11}$/.test(videoId || '')) {
      res.setHeader('Cache-Control', 'public, s-maxage=120, stale-while-revalidate=300');
      return res.status(200).json({ videoId });
    }
  } catch {
    // YouTube may have no current broadcast or may be temporarily unavailable.
  }
  res.setHeader('Cache-Control', 'public, s-maxage=30');
  return res.status(200).json({ videoId: null });
};
