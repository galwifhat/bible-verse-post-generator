//get a random image of size 250 * 280
function fetchImages() {
  fetch("https://picsum.photos/250/280", {
    method: "GET",
    headers: {
      Accept: "*/*",
    },
  })
    .then((response) => response.url)
    .then((imagesurl) => console.log("Check the image:", imagesurl))
    .catch((err) => console.error(err));
}

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
            return fetch("https://picsum.photos/250/280", {
              method: "GET",
              headers: {
                Accept: "*/*",
              },
            })
              .then((response) => response.url)
              .then((imagesurl) => {
                console.log("Check the image:", imagesurl);
                //if created
                //I need to patch/put
                return (
                  fetch(`http://localhost:3002/bibleData/${savedData.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      currentLikes: 0,
                      currentBookMarks: 0,
                      imageurl: imagesurl,
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
              .catch((err) => console.error(err));
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
  //remove previous verse
  //mainContainer.innerHTML = "";
  //create the div tag
  const verseCard = document.createElement("div");
  verseCard.classList.add("verse-card");
  console.log("Displaying:", updatedData);
  /*  if (updatedData.imageurl) {
    verseCard.style.backgroundImage = `url('${updatedData.imageurl}')`;
    verseCard.style.backgroundSize = "cover"; // Ensure the image covers the div
    verseCard.style.backgroundPosition = "center"; // Center the image
    verseCard.style.backgroundRepeat = "no-repeat"; // Prevent tiling
  } */
  //create the img tag
  const img = document.createElement("img");
  img.src = updatedData.imageurl; //find out where to get images
  img.alt = updatedData.id;
  //create a h2 tag
  const verseNumber = document.createElement("h2");
  verseNumber.textContent = `${updatedData.book_name} ${updatedData.chapter}:${updatedData.verse}`;
  //create a p tag
  const verseText = document.createElement("p");
  verseText.textContent = updatedData.text;

  //create like button
  const likeBtn = document.createElement("button");
  likeBtn.classList.add("like-btn");
  likeBtn.textContent = `❤️ ${updatedData.currentLikes || 0}`;
  likeBtn.addEventListener("click", function () {
    let newLikes = (updatedData.currentLikes || 0) + 1;
    likeBtn.textContent = `❤️ ${newLikes}`;

    // Send PATCH request to update likes in JSON server
    fetch(`http://localhost:3002/bibleData/${updatedData.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentLikes: newLikes }),
    })
      .then((response) => response.json())
      .then((updatedLikes) => {
        console.log("Updated Likes:", updatedVerse);
        updatedData.currentLikes = updatedLikes.currentLikes; // Update local variable
      })
      .catch((err) => console.error("Like update error:", err));
  });

  //create bookmark button
  const bookmarkBtn = document.createElement("button");
  bookmarkBtn.classList.add("bookmark-btn");
  bookmarkBtn.textContent = `⭐`;

  // create a div for below buttons append to the verse card//changed my mind on this
  const buttonDiv = document.createElement("div");
  buttonDiv.classList.add("button-div");

  //create delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("delete-btn");
  deleteBtn.textContent = `Delete`;

  //share button
  const shareBtn = document.createElement("button");
  shareBtn.classList.add("share-btn");
  shareBtn.textContent = `Share`;

  //Add an event listener to my delete button
  deleteBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to delete this verse?")) {
      fetch(`http://localhost:3002/bibleData/${updatedData.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to delete");
          }
          console.log("Deleted successfully:", updatedData.id);

          // Remove the verse from the DOM
          verseCard.remove();
        })
        .catch((err) => console.error("Delete error:", err));
    }
  });

  // append
  // verseCard.appendChild(img);

  verseCard.appendChild(img);
  verseCard.appendChild(verseNumber);
  verseCard.appendChild(verseText);
  verseCard.appendChild(bookmarkBtn);
  verseCard.appendChild(likeBtn);
  buttonDiv.appendChild(deleteBtn);
  buttonDiv.appendChild(shareBtn);
  verseCard.appendChild(buttonDiv);
  divForCards.appendChild(verseCard);
}
