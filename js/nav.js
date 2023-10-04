"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories");
  hidePageComponents();
  putStoriesOnPage();
  if(currentUser){
    updateStoryListWithFaves();
  }
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick");
  promptLogin();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}


/*************** new code below here ***************/


/* when user cliks on submit, which begins the process of adding a story */

function navSubmitClick(evt) {
  console.debug("navSubmitClick");
    $addStoryForm.show();
}

$navSubmit.on("click", navSubmitClick);


/* when user cliks on Favorites, to view their list of favorites */

function navFavoritesClick(evt) {
  console.debug("navFavoritesClick");
    showFavorites();
}

$navFavorites.on("click", navFavoritesClick);


/* when user cliks on my stories, to view their list of stories */

function navMyStoriesClick(evt) {
  console.debug("navMyStoriesClick");
    showMyStories();
}

$navMyStories.on("click", navMyStoriesClick);



/* helper function to prep for login/ signup */

function promptLogin(){
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}
