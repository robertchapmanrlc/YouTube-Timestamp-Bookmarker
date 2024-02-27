// Wait for the DOM content to be loaded before executing the script
document.addEventListener("DOMContentLoaded", () => {
  // Get the references to the HTML elements
  let timeStampInput = document.getElementById("timestampInput");
  let bookmarkButton = document.getElementById("bookmarkBtn");
  let bookmarkList = document.getElementById("bookmarkList");
  let messageContainer = document.getElementById("messageContainer");

  // Event listener for clicking the bookmark button
  bookmarkButton.addEventListener("click", () => {
    // Query the active tab in the current window
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      let activeTab = tabs[0];
      // Send a messageto the active tab with the action 'bookmark'
      chrome.tabs.sendMessage(
        activeTab.id,
        { action: "bookmark" },
        (response) => {
          // If the response contains the bookmarks, load them; otherwise show the message
          if (response && response.bookmarks) {
            loadBookmarks(response.bookmarks);
          } else {
            messageContainer.textContent = "This is not a YouTube video page.";
          }
        }
      );
    });
  });

  // Function to load bookmarks into the bookmark list
  function loadBookmarks(bookmarks) {
    bookmarkList.innerHTML = "";

    // Iterate through each timestamp and create a list item for it
    bookmarks.forEach((timestamp) => {
      let listItem = document.createElement("li");
      let timestampText = document.createElement("p");
      let deleteBookmarkBtn = document.createElement("button");
      let hours = Math.floor(timestamp / 3600);
      let minutes = Math.floor((timestamp % 3600) / 60);
      let seconds = Math.floor(timestamp % 60);

      // Format the timestamp as HH:MM:SS
      let formattedTimestamp = "";
      if (hours > 0) {
        formattedTimestamp += hours + ":";
      }

      formattedTimestamp +=
        (minutes < 10 ? "0" : "") +
        minutes +
        ":" +
        (seconds < 10 ? "0" : "") +
        seconds;

      // Set the text content of the timestamp element
      timestampText.textContent = formattedTimestamp;

      // Add event listener to timestamp to navigate to that point in the video
      timestampText.addEventListener("click", () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          let activeTab = tabs[0];
          chrome.tabs.sendMessage(activeTab.id, {
            action: "goToTimestamp",
            timestamp: timestamp,
          });
        });
      });

      // Create trash can icon for deleting the bookmark
      let trashCanIcon = createTrashCanIcon();
      deleteBookmarkBtn.appendChild(trashCanIcon);

      // Add event listener to delete bookmark button
      deleteBookmarkBtn.addEventListener("click", () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          let activeTab = tabs[0];
          chrome.tabs.sendMessage(
            activeTab.id,
            { action: "deleteBookmark", timestamp: timestamp },
            (response) => {
              if (response && response.bookmarks) {
                loadBookmarks(response.bookmarks);
              }
            }
          );
        });
      });

      // Append elements to the list item
      listItem.appendChild(timestampText);
      listItem.appendChild(deleteBookmarkBtn);
      bookmarkList.appendChild(listItem);
    });
  }

  // Function to check if a given URL is a YouTube video page
  function isYouTubeVideoPage(url) {
    return (
      url.includes("youtube.com") &&
      url.startsWith("https://www.youtube.com/watch")
    );
  }

  // Function to create trash can icon
  function createTrashCanIcon() {
    let svgImage = new Image();
    svgImage.src = "./Trash Icon.svg";

    let div = document.createElement("div");
    div.appendChild(svgImage);
    div.classList.add("trash-can-icon");

    return div;
  }

  // Query the active tab and check if it's a YouTube video page
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    let activeTab = tabs[0];
    if (!isYouTubeVideoPage(activeTab.url)) {
      // If it's not a YouTube video page, show a message
      messageContainer.textContent = "This is not a YouTube video page.";
    } else {
      // If it's a YouTube video page, get the bookmarks and load them
      chrome.tabs.sendMessage(
        activeTab.id,
        { action: "getBookmarks" },
        (response) => {
          if (response && response.bookmarks) {
            loadBookmarks(response.bookmarks);
          }
          // Clear the message container
          messageContainer.textContent = "";
        }
      );
    }
  });
});
