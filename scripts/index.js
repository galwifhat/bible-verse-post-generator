fetch("https://bible-api.com/john+3", {
  method: "GET",
  headers: { "Content-Type": "application/json" },
})
  .then((response) => response.json())

  //now we get access to the retrieved data
  .then((fetchBibleData) => {
    // console.log(fetchBibleData);
    // console.log(fetchBibleData.verses);
    //automate the process of saving data to our jason-serve
    const verseList = document.getElementById("verse-list");

    fetchBibleData.verses.forEach((verse) => {
      const li = document.createElement("li");
      li.textContent = `${verse.book_name} ${verse.chapter}:${verse.verse}`;
      //i am adding an event handler for saving the verse
      //get the list and save it to json-server

      li.addEventListener("click", () => {
        fetch("http://localhost:3002/bibleData", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(verse),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("saved:", data);
            displayBibleVerses([data]);
          })
          .catch((err) => console.error("Save error:", err));
      });
      //render the list items to our html immediately inside the loop
      verseList.appendChild(li);
    });
  })
  .catch((error) => console.error("Fetch error:", error));

const mainContainer = document.getElementById("main-container");

//create the display function
function displayBibleVerses(bibleDat) {
  //remove previous verse
  mainContainer.innerHTML = "";
  //create the div tag
  const verseCard = document.createElement("div");
  verseCard.classList.add("verse-card");
  //create the img tag
  const img = document.createElement("img");
  img.src = verse.urlimage; //find where to get images
  img.alt = verse.id;
  //create a h2 tag
  const verseNumber = document.createElement("h2");
  verseNumber.textContent = `${verse.book_name} ${verse.chapter}:${verse.verse}`;
  //create a p tag
  const verseText = document.createElement("p");
  verseText.textContent = verse.text;
  // append
  verseCard.appendChild(img);
  verseCard.appendChild(verseNumber);
  verseCard.appendChild(verseText);
  mainContainer.appendChild(verseCard);
}
