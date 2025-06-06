console.log('[QBN Embedder] Content script loaded.');

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
  console.log(`[QBN Embedder] Found ${links.length} links`);

  for (const link of links) {
    console.log('[QBN Embedder] Checking link:', link.href);
    if (handleInstagramLinks(link)) continue;
    if (handleWebpLinks(link)) continue;
    if (handleMp4Links(link)) continue;
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

  console.log('[QBN Embedder] Embedding Instagram:', url);
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

  console.log('[QBN Embedder] Embedding WebP:', url);
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

  console.log('[QBN Embedder] Embedding MP4:', url);
  link.replaceWith(video);
  return true;
}