function displayHnTags(hnTags) {
  var hnContentDiv = document.getElementById("hnContent");
  hnContentDiv.innerHTML = hnTags;

  var hnTagElements = document.getElementsByClassName("hnTag");
  for (var i = 0; i < hnTagElements.length; i++) {
    hnTagElements[i].addEventListener("click", copyHnTag);
  }

  var copyAllButton = document.getElementById("copyAllButton");
  copyAllButton.addEventListener("click", copyAllTags);
}

function copyHnTag(event) {
  var hnTagText = event.target.innerText;
  navigator.clipboard.writeText(hnTagText).then(function() {
    console.log("Balise copiée : " + hnTagText);
  });
}

function copyAllTags() {
  var hnContentDiv = document.getElementById("hnContent");
  var hnTagElements = hnContentDiv.getElementsByClassName("hnTag");
  var hnTagsText = Array.from(hnTagElements).map(function(tagElement) {
    return tagElement.innerText.trim();
  }).join('\n'); // Join les balises avec des retours à la ligne
  navigator.clipboard.writeText(hnTagsText).then(function() {
    console.log("Contenu des balises copié : \n" + hnTagsText);
  });
}


function filterTags(selectedTag, hnTags) {
  if (selectedTag === "all") {
    return hnTags;
  } else {
    return hnTags.filter(tag => tag.includes(selectedTag));
  }
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.hnTags) {
    displayHnTags(request.hnTags);
  }
});

chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
  chrome.scripting.executeScript({
    target: { tabId: tabs[0].id },
    files: ['content.js'],
  });
});

document.addEventListener("DOMContentLoaded", function() {
  var tagFilter = document.getElementById("tagFilter");
  var originalHnTags = []; // Variable pour stocker les balises de base

  tagFilter.addEventListener("change", function() {
    var selectedTag = tagFilter.value;
    var hnContentDiv = document.getElementById("hnContent");
    
    // Sauvegarde des balises de base
    if (originalHnTags.length === 0) {
      var hnTagsText = hnContentDiv.innerHTML;
      originalHnTags = hnTagsText.split("<br>");
    }
    
    var filteredTags = [];
    if (selectedTag === "all") {
      filteredTags = originalHnTags;
    } else {
      filteredTags = originalHnTags.filter(tag => tag.includes(selectedTag));
    }
    
    displayHnTags(filteredTags.join("<br>"));
  });
});

