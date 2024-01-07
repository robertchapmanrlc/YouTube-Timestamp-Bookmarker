chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action == "bookmark") {
    let videoId = getVideoIdFromUrl(window.location.href);
    let timestamp = request.timestamp;

    if (videoId && timestamp) {
      let bookmarks = JSON.parse(localStorage.getItem(videoId)) || [];
      bookmarks.push(timestamp);
      localStorage.setItem(videoId, JSON.stringify(bookmarks));
      sendResponse({ bookmarks: bookmarks });
      alert("Timestamp bookmarked successfully!");
    }
  } else if (request.action == 'getBookmarks') {
    let videoId = getVideoIdFromUrl(window.location.href);
    let bookmarks = JSON.parse(localStorage.getItem(videoId));
    console.log(bookmarks);
    sendResponse({ bookmarks: bookmarks });
  }
});

function getVideoIdFromUrl(url) {
  let urlParts = url.split('&');

  for (let i = 0; i < urlParts.length; i += 1) {
    if (urlParts[i].startsWith('v=')) {
      return urlParts[i].substring(2);
    }
  }

  let videoIdMatches = url.match(/[?&]v=([^&#]+)/);
  return videoIdMatches ? videoIdMatches[1] : null;
}
