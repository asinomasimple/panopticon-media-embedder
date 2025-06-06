// Add embedder style
const style = document.createElement('style');
style.textContent = `
  .panopticon-embedder-frame {
    border: 2px solid #E685D5 !important;
  }
`;
document.head.appendChild(style);

// Initial run in case some content is already loaded
processLinks(document);

// Setup MutationObserver for dynamically added content
const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      if (!(node instanceof HTMLElement)) continue;
      processLinks(node);
    }
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

/**
 * Process all anchor links in a given root element
 * @param {HTMLElement|Document} root
 */
function processLinks(root) {
  const links = [...root.querySelectorAll('a[href]')];
  console.log(`[Panopticon Embedder] Found ${links.length} links`);

  for (const link of links) {
    console.log('[Panopticon Embedder] Checking link:', link.href);
    if (handleInstagramLinks(link)) continue;
    if (handleWebpLinks(link)) continue;
    if (handleMp4Links(link)) continue;
    if (handleYoutubeShorts(link)) continue;
  }
}

function handleInstagramLinks(link) {
  const url = link.href;
  if (!url.includes('instagram.com/p/')) return false;

  const embed = document.createElement('iframe');
  embed.src = `https://www.instagram.com/p/${url.split('/p/')[1].split('/')[0]}/embed`;
  embed.width = "400";
  embed.height = "480";
  embed.style.border = "none";
  embed.loading = "lazy";
  embed.className = 'panopticon-embedder-frame';

  console.log('[Panopticon Embedder] Embedding Instagram:', url);
  link.replaceWith(embed);
  return true;
}

function handleWebpLinks(link) {
  const url = link.href;
  if (!url.endsWith('.webp')) return false;

  const img = document.createElement('img');
  img.src = url;
  img.style.maxWidth = '100%';
  img.style.display = 'block';
  img.style.margin = '1em 0';
  img.className = 'panopticon-embedder-frame';

  console.log('[Panopticon Embedder] Embedding WebP:', url);
  link.replaceWith(img);
  return true;
}

function handleMp4Links(link) {
  const url = link.href;
  if (!url.endsWith('.mp4')) return false;

  const video = document.createElement('video');
  video.src = url;
  video.controls = true;
  video.style.maxWidth = '100%';
  video.style.display = 'block';
  video.style.margin = '1em 0';
  video.className = 'panopticon-embedder-frame';

  console.log('[Panopticon Embedder] Embedding MP4:', url);
  link.replaceWith(video);
  return true;
}

function handleYoutubeShorts(link) {
  const url = link.href;
  const match = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
  if (!match) return false;

  const videoId = match[1];
  const embed = document.createElement('iframe');
  embed.src = `https://www.youtube.com/embed/${videoId}`;
  embed.width = "560";
  embed.height = "315";
  embed.frameBorder = "0";
  embed.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
  embed.allowFullscreen = true;
  embed.style.display = 'block';
  embed.style.margin = '1em 0';
  embed.className = 'panopticon-embedder-frame';

  console.log('[Panopticon Embedder] Embedding YouTube Shorts:', url);
  link.replaceWith(embed);
  return true;
}
