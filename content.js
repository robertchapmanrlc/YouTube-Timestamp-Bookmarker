chrome.runtime.onMessag.addListener((request, sender, sendResponse) => {
  if (request.action == "bookmark") {
    let videoId = window.location.search.split("v=")[1];
    let timestamp = request.timestamp;

    if (videoId && timestamp) {
      let bookmarks = JSON.parse(localStorage.getItem(videoId)) || [];
      bookmarks.push(timestamp);
      localStorage.setItem(videoId, JSON.stringify(bookmarks));
      alert("Timestamp bookmarked successfully!");
    }
  }
});
