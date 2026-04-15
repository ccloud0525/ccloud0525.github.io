(function() {
  function parseTags(rawTags) {
    return (rawTags || "")
      .split("|")
      .map(function(tag) {
        return tag.trim();
      })
      .filter(Boolean);
  }

  function sortTags(tagCounts) {
    return Object.keys(tagCounts).sort(function(left, right) {
      if (tagCounts[right] !== tagCounts[left]) {
        return tagCounts[right] - tagCounts[left];
      }
      return left.localeCompare(right);
    });
  }

  function initPublicationFilters() {
    var browser = document.querySelector("[data-publication-browser]");
    var filterContainer = document.querySelector("[data-publication-filters]");
    var statusNode = document.querySelector("[data-publication-filter-status]");
    var sections = Array.prototype.slice.call(document.querySelectorAll("[data-publication-section]"));
    var cards = Array.prototype.slice.call(document.querySelectorAll(".paper-box[data-tags]"));

    if (!browser || !filterContainer || !statusNode || !cards.length) {
      return;
    }

    var tagCounts = {};
    var topLevelButtons = [];
    var cardTagButtons = [];
    var selectedTags = [];

    cards.forEach(function(card) {
      var tags = parseTags(card.getAttribute("data-tags"));
      var textNode = card.querySelector(".paper-box-text");

      card.publicationTags = tags;

      tags.forEach(function(tag) {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });

      if (!textNode || !tags.length || textNode.querySelector(".publication-tags")) {
        return;
      }

      var tagRow = document.createElement("div");
      tagRow.className = "publication-tags";

      tags.forEach(function(tag) {
        var button = document.createElement("button");
        button.type = "button";
        button.className = "publication-tag";
        button.textContent = tag;
        button.setAttribute("data-publication-tag", tag);
        button.addEventListener("click", function() {
          toggleTag(tag);
        });
        tagRow.appendChild(button);
        cardTagButtons.push(button);
      });

      textNode.appendChild(tagRow);
    });

    function buildFilterChip(label, count, tag) {
      var button = document.createElement("button");
      var labelNode = document.createElement("span");
      var countNode = document.createElement("span");

      button.type = "button";
      button.className = "publication-filter-chip";
      button.setAttribute("data-filter-tag", tag || "");
      button.addEventListener("click", function() {
        if (!tag) {
          applyFilter([]);
          return;
        }
        toggleTag(tag);
      });

      labelNode.className = "publication-filter-chip__label";
      labelNode.textContent = label;

      countNode.className = "publication-filter-chip__count";
      countNode.textContent = count;

      button.appendChild(labelNode);
      button.appendChild(countNode);
      topLevelButtons.push(button);
      return button;
    }

    function updateButtons() {
      topLevelButtons.forEach(function(button) {
        var tag = button.getAttribute("data-filter-tag");
        var isActive = tag ? selectedTags.indexOf(tag) !== -1 : selectedTags.length === 0;
        button.classList.toggle("is-active", isActive);
      });

      cardTagButtons.forEach(function(button) {
        button.classList.toggle("is-active", selectedTags.indexOf(button.getAttribute("data-publication-tag")) !== -1);
      });
    }

    function updateSections() {
      sections.forEach(function(section) {
        var visibleCards = section.querySelectorAll(".paper-box[data-tags]:not([hidden])").length;
        section.hidden = visibleCards === 0;
      });
    }

    function updateStatus(visibleCount) {
      if (!selectedTags.length) {
        statusNode.textContent = "Showing all " + cards.length + " papers.";
        return;
      }

      var noun = visibleCount === 1 ? "paper" : "papers";
      statusNode.textContent = "Showing " + visibleCount + " " + noun + " matching " + selectedTags.join(" + ") + ".";
    }

    function toggleTag(tag) {
      var nextTags = selectedTags.slice();
      var tagIndex = nextTags.indexOf(tag);

      if (tagIndex === -1) {
        nextTags.push(tag);
      } else {
        nextTags.splice(tagIndex, 1);
      }

      applyFilter(nextTags);
    }

    function applyFilter(nextTags) {
      var visibleCount = 0;

      selectedTags = nextTags.slice();

      cards.forEach(function(card) {
        var matches = !selectedTags.length || selectedTags.every(function(tag) {
          return card.publicationTags.indexOf(tag) !== -1;
        });
        card.hidden = !matches;
        if (matches) {
          visibleCount += 1;
        }
      });

      updateButtons();
      updateSections();
      updateStatus(visibleCount);
    }

    filterContainer.appendChild(buildFilterChip("All Papers", cards.length, ""));

    sortTags(tagCounts).forEach(function(tag) {
      filterContainer.appendChild(buildFilterChip(tag, tagCounts[tag], tag));
    });

    browser.hidden = false;
    applyFilter([]);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPublicationFilters);
  } else {
    initPublicationFilters();
  }
})();
