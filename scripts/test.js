// First fetch from Bible API and save to your server
fetch("https://bible-api.com/john+3")
  .then((response) => response.json())
  .then((fetchBibleData) => {
    // Create array of POST promises
    const postPromises = fetchBibleData.verses.map((verse) => {
      return fetch("http://localhost:3002/bibleData", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(verse),
      });
    });

    // Wait for all POSTs to complete
    return Promise.all(postPromises);
  })
  .then(() => {
    // Now fetch from YOUR server
    return fetch("http://localhost:3002/bibleData");
  })
  .then((response) => response.json())
  .then((bibleVerses) => {
    // Display data from your server
    displayBibleVerses(bibleVerses);
  })
  .catch((err) => console.error(err));

const mainContainer = document.getElementById("main-container");

function displayBibleVerses(bibleVerses) {
  mainContainer.innerHTML = ""; // Clear container

  bibleVerses.forEach((verse) => {
    const verseCard = document.createElement("div");
    verseCard.classList.add("verse-card");

    const verseNumber = document.createElement("h2");
    verseNumber.textContent = `${verse.book_name} ${verse.chapter}:${verse.verse}`;

    const verseText = document.createElement("p");
    verseText.textContent = verse.text;

    verseCard.appendChild(verseNumber);
    verseCard.appendChild(verseText);
    mainContainer.appendChild(verseCard);
  });
}
