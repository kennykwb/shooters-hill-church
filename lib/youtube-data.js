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
module.exports = readPlayer;
