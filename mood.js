const bing_api_endpoint = "https://api.bing.microsoft.com/v7.0/images/search";
const bing_api_key = BING_API_KEY

function runSearch() {
  clearResultsPane();

  const query = document.getElementById("search-input").value.trim();
  const queryString = `q=${encodeURIComponent(query)}`;
  const fullQuery = `${bing_api_endpoint}?${queryString}`;

  let request = new XMLHttpRequest();
  request.open("GET", fullQuery, true);
  request.responseType = "json";
  request.setRequestHeader("Ocp-Apim-Subscription-Key", bing_api_key);
  request.addEventListener("load", handleSearchResponse);
  request.send();
  openResultsPane();
  return false;  

}

function clearResultsPane() {
  const resultsContainer = document.querySelector("#resultsImageContainer");
  resultsContainer.innerHTML = "";
}

function openResultsPane() {
  document.querySelector("#resultsExpander").classList.add("open");
}

function handleSearchResponse(event) {
  const response = event.target.response;

  const resultsContainer = document.querySelector("#resultsImageContainer");
  response.value.forEach((result) => {
    // print(result)
    const imageElement = document.createElement("img");
    imageElement.src = result.contentUrl;
    imageElement.alt = result.name;
    imageElement.classList.add("resultImage");

    // Add a click event listener to handle adding images to the mood board
    imageElement.addEventListener("click", () => addToMoodBoard(result.contentUrl));

    resultsContainer.appendChild(imageElement);

    
  });

  const relatedConceptsContainer = document.querySelector(".related-concept");
  relatedConceptsContainer.innerHTML = "";
  response.relatedSearches.forEach((result) => {
    const conceptElement = document.createElement("li");
    conceptElement.innerText = result.text;
    conceptElement.classList.add("related-concept");

    conceptElement.addEventListener("click", () => runSearch2(conceptElement.innerText));

    relatedConceptsContainer.appendChild(conceptElement);
  });

  // Optionally, you can display related concepts as well.
  // Call a function to display related concepts from the response.
  // displayRelatedConcepts(response.relatedSearches);
}


function closeResultsPane() {
  // This will make the results pane hidden again.
  document.querySelector("#resultsExpander").classList.remove("open");
}

// This will 
document.querySelector("#runSearchButton").addEventListener("click", runSearch);
document.querySelector(".search input").addEventListener("keypress", (e) => {
  if (e.key == "Enter") {runSearch()}
});

document.querySelector("#closeResultsButton").addEventListener("click", closeResultsPane);
document.querySelector("body").addEventListener("keydown", (e) => {
  if(e.key == "Escape") {closeResultsPane()}
});

function addToMoodBoard(imageUrl) {
  // Create an image element for the mood board
  const moodBoardImage = document.createElement("img");
  moodBoardImage.src = imageUrl;
  moodBoardImage.alt = "Mood Board Image";
  moodBoardImage.classList.add("selected-image");

  // Append the image to the mood board container
  const moodBoardContainer = document.querySelector("#board");
  moodBoardContainer.appendChild(moodBoardImage);
}


document.querySelector(".related-concept").addEventListener("click", (e) => {
  if (e.target.tagName === "LI") {
      const relatedConcept = e.target.innerText;
      runSearch2(relatedConcept);
  }
});



function runSearch2(subject) {
  clearResultsPane();

  const query = subject;
  const queryString = `q=${encodeURIComponent(query)}`;
  const fullQuery = `${bing_api_endpoint}?${queryString}`;

  let request = new XMLHttpRequest();
  request.open("GET", fullQuery, true);
  request.responseType = "json";
  request.setRequestHeader("Ocp-Apim-Subscription-Key", bing_api_key);
  request.addEventListener("load", handleSearchResponse);
  request.send();
  openResultsPane();
  return false;  

}