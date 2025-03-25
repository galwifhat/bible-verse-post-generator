//fetch()is asynchronous → It runs in the background while the rest
//  of your code continues.
//from public API
fetch("https://bible-api.com/john+3", {
  method: "GET",
  "Content-Type": "application/json",
})
  .then((response) => response.json())
  //now we get access to the retrieved data
  .then((fetchBibleData) => {
    fetchBibleData.verses.forEach((verse) => {
      fetch("http://localhost:3001/bibleData", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(verse),
      })
        .then((response) => response.json())
        .then((response) => console.log(response));
    });
  })
  .catch((err) => console.error(err));

function fetchBibleData() {
  return;
}
