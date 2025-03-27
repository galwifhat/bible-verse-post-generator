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
      li.classList.add("list", "clickable");
      li.textContent = `${verse.book_name} ${verse.chapter}:${verse.verse}`;

      // Store the full verse data on the list item
      li.dataset.verse = JSON.stringify(verse);
      //i am adding an event handler for saving the verse
      //get the list and save it to json-server
      li.addEventListener("click", (event) => {
        event.preventDefault();
        // Get the verse data from the clicked list item
        // let parsedData = JSON.parse(data);
        const verseData = JSON.parse(event.currentTarget.dataset.verse);

        fetch("http://localhost:3002/bibleData", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(verseData),
        })
          .then((response) => response.json())
          .then((savedData) => {
            console.log("Saved:", savedData);
            console.log("Attempting to update:", savedData.id);
            //if created
            //I need to patch/put
            return (
              fetch(`http://localhost:3002/bibleData/${savedData.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  currentLikes: 0,
                  currentBookMarks: 0,
                }),
              })
                .then((response) => response.json())
                //.then((updatedData) => console.log("updated:", updatedData))
                .then((updatedData) => {
                  console.log("Updated:", updatedData);

                  if (!updatedData) {
                    console.error("updatedData is undefined or null");
                    return;
                  }
                  console.log("DisplayBibleVerses with:", updatedData);
                  displayBibleVerses(updatedData); // this will be okay if inside the function, all works
                })
                .catch((err) => console.error("Update error:", err))
            );
          })
          .catch((err) => console.error("Save error:", err));

        // Get the verse data from the clicked list item
        // Display the verse content
      });
      //render the list items to our html immediately inside the loop

      verseList.appendChild(li);
    });
  })
  .catch((error) => console.error("Fetch error:", error));

const divForCards = document.getElementById("div-for-cards");

//create the display function
function displayBibleVerses(updatedData) {
  console.log("Displaying:", updatedData);
  //remove previous verse
  //mainContainer.innerHTML = "";
  //create the div tag
  const verseCard = document.createElement("div");
  verseCard.classList.add("verse-card");
  //create the img tag
  /*  const img = document.createElement("img");
  img.src = verse.urlimage; //find where to get images
  img.alt = verse.id; */
  //create a h2 tag
  const verseNumber = document.createElement("h2");
  verseNumber.textContent = `${updatedData.book_name} ${updatedData.chapter}:${updatedData.verse}`;
  //create a p tag
  const verseText = document.createElement("p");
  verseText.textContent = updatedData.text;

  // create a div for buttons append to the verse card//changed my mind on this
  const buttonDiv = document.createElement("div");
  buttonDiv.classList.add("button-div");
  //create like button
  const likeBtn = document.createElement("button");
  likeBtn.classList.add("like-btn");
  likeBtn.textContent = `❤️`;

  //create bookmark button
  const bookmarkBtn = document.createElement("button");
  bookmarkBtn.classList.add("bookmark-btn");
  bookmarkBtn.textContent = `⭐`;

  //create delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("delete-btn");
  deleteBtn.textContent = `Delete`;

  //share button
  const shareBtn = document.createElement("button");
  shareBtn.classList.add("share-btn");
  shareBtn.textContent = `Share`;

  // append
  // verseCard.appendChild(img);

  verseCard.appendChild(verseNumber);
  verseCard.appendChild(verseText);
  verseCard.appendChild(bookmarkBtn);
  verseCard.appendChild(likeBtn);
  verseCard.appendChild(deleteBtn);
  verseCard.appendChild(shareBtn);
  divForCards.appendChild(verseCard);
}
