(function($) {
  "use strict"; // Start of use strict

  // No JS

})(jQuery); // End of use strict

let returnButton = document.getElementById("return-button");
returnButton.addEventListener("click", returnHome);
function returnHome() {
  window.location.href = "../index.html";
}