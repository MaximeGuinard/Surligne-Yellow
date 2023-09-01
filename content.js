function getHnTags() {
  var hnTags = Array.from(document.querySelectorAll("h1, h2, h3, h4, h5, h6")).map(function(tag) {
    return `<div class="hnTag">${tag.tagName}: ${tag.innerHTML}</div>`;
  });

  chrome.runtime.sendMessage({ hnTags: hnTags.join("<br>") });
}

// Appel à la fonction pour obtenir les balises Hn
getHnTags();
