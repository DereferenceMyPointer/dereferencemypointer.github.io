/**
 * Milo Gerhard
 * 07/13/2021
 * Section AD
 */

 "use strict";
 (function() {
   // module pattern
   window.addEventListener("load", init);
 
   const CLICK_PENALTY = 3;
   const TOTAL_APPLES = 36;
   const COLUMN_LENGTH = 6;
   const COLORS = ["blue", "orange", "yellow", "black"];
 
   /**
    * initiate the page on load
    */
   function init() {
     addApples(TOTAL_APPLES);
     id("reset").addEventListener("click", reset);
   }
 
   /**
    * remove all of the existing apples from the grid
    * and refill it randomly; also reset the player's score
    */
   function reset() {
     let apples = qsa(".apple");
     for (let i = 0; i < apples.length; i++) {
       apples[i].remove();
     }
     addApples(TOTAL_APPLES);
     id("score").textContent = "0";
   }
 
   /**
    * adds apples to the game board and returns the number added
    * @param {Integer} amount of apples to add
    * @returns {Integer} number of apples successfully added
    */
   function addApples(amount) {
     let numAdded = 0;
     for (let i = 0; i < amount; i++) {
       let columnNum = getAvailableColumn();
 
       // add a new apple if there's a column with room available
       if (columnNum !== null) {
         let apple = gen("div");
         apple.classList.add("apple", randomColor());
 
         // give each apple added a listener that calls the dblclickRoutine with itself
         apple.addEventListener("dblclick", function() {
           dblclickRoutine(this);
         });
         qs("section").children[columnNum].appendChild(apple);
         numAdded++;
       }
     }
     return numAdded;
   }
 
   /**
    * initiates removing all neighbors of the clicked apple and adjusts the
    * player score according to the click penalty
    * @param {Object} element apple to remove along with its neighbors
    */
   function dblclickRoutine(element) {
     removeAlike(element, [element]);
     id("score").textContent =
       parseInt(id("score").textContent) + addApples(TOTAL_APPLES) - CLICK_PENALTY;
   }
 
   /**
    * removes an apple and every neighbor of the same color (including distant neighbors related
    * by several adjacent apples)
    * @param {Object} element the element to remove itself and its neighbors
    * @param {Array} prevElements elements that have already been traversed
    */
   function removeAlike(element, prevElements) {
     // add current element to list of traversed elements
     prevElements.push(element);
 
     // call on left and right neighbors
     let columnNeighbors = selectColumnNeighbors(element);
     for (let i = 0; i < columnNeighbors.length; i++) {
       if (columnNeighbors[i] !== null && !prevElements.includes(columnNeighbors[i]) &&
         columnNeighbors[i].classList.contains(element.classList.item(1))) {
         removeAlike(columnNeighbors[i], prevElements);
       }
     }
 
     // call on vertical neighbors
     let nextDown = element.nextSibling;
     if (nextDown !== null && !prevElements.includes(nextDown) &&
       nextDown.classList.contains(element.classList.item(1))) {
       removeAlike(nextDown, prevElements);
     }
     let nextUp = element.previousSibling;
     if (nextUp !== null && !prevElements.includes(nextUp) &&
       nextUp.classList.contains(element.classList.item(1))) {
       removeAlike(nextUp, prevElements);
     }
 
     // remove the element
     element.remove();
   }
 
   /**
    * finds the left and right neighbors of an apple
    * @param {Object} element to find horizontal neighbors of
    * @returns {Array} containing the two neighboring elements, null if no column to that side
    * element to the left is index 0, element to the right is index 1
    */
   function selectColumnNeighbors(element) {
     // get the indices of the element in the row and column
     let index = Array.from(element.parentElement.children).indexOf(element);
     let columnIndex =
       Array.from(element.parentElement.parentElement.children).indexOf(element.parentElement);
 
     // find columns to the left and right
     let left = element.parentElement.parentElement.children.item(columnIndex - 1);
     let right = element.parentElement.parentElement.children.item(columnIndex + 1);
 
     // find neighbors in the columns to the left and right
     if (left !== null) {
       left = left.children.item(index);
     }
     if (right !== null) {
       right = right.children.item(index);
     }
 
     return [left, right];
   }
 
   /**
    * returns a random color from the available color palette
    * @returns {String} color
    */
   function randomColor() {
     return COLORS[Math.floor(Math.random() * COLORS.length)];
   }
 
   /**
    * find the index of the next available column
    * @returns {Integer} index of the next available column (from the left)
    * null if no available column
    */
   function getAvailableColumn() {
     let columns = qsa(".column");
     for (let i = 0; i < columns.length; i++) {
       if (columns[i].childElementCount < COLUMN_LENGTH) {
         return i;
       }
     }
     return null;
   }
 
   /* ---------------------- Helper Function ---------------------- */
   /**
    * id helper function
    * @param {String} name of the id
    * @returns {Object} element with id name
    */
   function id(name) {
     return document.getElementById(name);
   }
 
   /**
    * qs helper function
    * @param {String} name of the css selector
    * @returns {Object} the first element that matches the selector
    */
   function qs(name) {
     return document.querySelector(name);
   }
 
   /**
    * qsa helper function
    * @param {String} name of the css selector
    * @returns {Object} a list of all elements matching the selector
    */
   function qsa(name) {
     return document.querySelectorAll(name);
   }
 
   /**
    * gen helper function
    * @param {String} name of html element to create
    * @returns {Object} the created element
    */
   function gen(name) {
     return document.createElement(name);
   }
 
 })();