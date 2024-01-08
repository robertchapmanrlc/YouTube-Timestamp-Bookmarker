chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action == "bookmark") {
    let timestamp = getCurrentTimestampFromPlayer();
    
    if (timestamp) {
      let videoId = getVideoIdFromUrl(window.location.href);
      let bookmarks = JSON.parse(localStorage.getItem(videoId)) || [];
      bookmarks.push(timestamp);
      localStorage.setItem(videoId, JSON.stringify(bookmarks));
      sendResponse({ bookmarks: bookmarks });
      alert("Timestamp bookmarked successfully!");
    } else {
      alert('Failed to get timestamp from the video player');
    }
  } else if (request.action == "getBookmarks") {
    let videoId = getVideoIdFromUrl(window.location.href);
    let bookmarks = JSON.parse(localStorage.getItem(videoId));
    sendResponse({ bookmarks: bookmarks });
  }
});

function getVideoIdFromUrl(url) {
  let urlParts = url.split("&");

  for (let i = 0; i < urlParts.length; i += 1) {
    if (urlParts[i].startsWith("v=")) {
      return urlParts[i].substring(2);
    }
  }

  let videoIdMatches = url.match(/[?&]v=([^&#]+)/);
  return videoIdMatches ? videoIdMatches[1] : null;
}

function getCurrentTimestampFromPlayer() {
  let player = document.getElementsByClassName('video-stream')[0];

  if (player) {
    return player.currentTime;
  } else {
    return null;
  }
}