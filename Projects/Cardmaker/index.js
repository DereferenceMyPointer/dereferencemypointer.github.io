"use strict";
(function() {

  // URL of the imgflip database API
  const BASE_URL = "https://api.imgflip.com/";

  // fields used by the card generator
  const fields = ["name", "cost", "type", "text-box", "attack", "health"];

  window.addEventListener("load", init);

  /**
   * Initializes the webpage and adds all static eventlisteners
   */
  function init() {
    for (let i = 0; i < fields.length; i++) {
      id(fields[i]).addEventListener("change", fieldUpdate);
    }
    id("refresh-imgs").addEventListener("click", searchRefresh);
    id("type").addEventListener("change", typeChange);
  }

  /**
   * Hides attack and health stats if a type without
   * them is selected (onchange for the type selector)
   */
  function typeChange() {
    if (this.value === "Monster" || this.value === "Avatar") {
      id("stats").classList.remove("hidden");
      id("card-stats").classList.remove("hidden");
    } else {
      id("stats").classList.add("hidden");
      id("card-stats").classList.add("hidden");
    }
  }

  /**
   * Onchange functionality for card fields
   * Updates the card with the appropriate values
   */
  function fieldUpdate() {
    id(this.name).textContent = this.value;
  }

  /**
   * Onclick functionality for the generate button
   * Refreshes the images displayed from imgflip
   */
  function searchRefresh() {
    let command = "get_memes";
    fetch(BASE_URL + command)
      .then(statusCheck)
      .then(resp => resp.json())
      .then(displayImages);
  }

  /**
   * Displays the results of a get_meme request from imgflip onto
   * the webpage
   * @param {Object} response JSON from a succesful imgflip fetch
   * formatted according to the API
   */
  function displayImages(response) {
    id("search-results").innerHTML = "";
    let memes = response.data.memes;
    for (let i = 0; i < memes.length; i++) {
      generateSearchComponent(memes[i]);
    }
  }

  /**
   * Adds an image to the results box via imgflip meme object
   * @param {Object} source the object to generate from
   */
  function generateSearchComponent(source) {
    let output = gen("img");
    output.src = source.url;
    output.alt = source.name;
    output.addEventListener("click", imgClickEvent);
    id("search-results").appendChild(output);
  }

  /**
   * Onclick functionality for generated images
   * Changes the card image to the selected image
   */
  function imgClickEvent() {
    id("card-img").src = this.src;
  }

  /* ---------------------- Helper Functions ---------------------- */
  /**
   * id helper function
   * @param {String} name of the id
   * @returns {Object} element with id name
   */
  function id(name) {
    return document.getElementById(name);
  }

  /**
   * gen helper function
   * @param {String} name of html element to create
   * @returns {Object} the created element
   */
  function gen(name) {
    return document.createElement(name);
  }

  /**
   * statusCheck helper function to check fetch requests
   * @param {Object} response from a fetch request
   * @returns {Object} response if no error; throws error otherwise
   */
  function statusCheck(response) {
    if (response.ok) {
      return response;
    }
    throw Error("Error in request: " + response.statusText);
  }

})();