"use strict";

// global to hold the User instance of the currently-logged-in user
let currentUser;

/******************************************************************************
 * User login/signup/login
 */

/** Handle login form submission. If login ok, sets up the user instance */

async function login(evt) {
  console.debug("login", evt);
  evt.preventDefault();

  // grab the username and password
  const username = $("#login-username").val();
  const password = $("#login-password").val();

  // User.login retrieves user info from API and returns User instance
  // which we'll make the globally-available, logged-in user.
  currentUser = await User.login(username, password);

  $loginForm.trigger("reset");

  saveUserCredentialsInLocalStorage();
  updateUIOnUserLogin();
}

$loginForm.on("submit", login);

/** Handle signup form submission. */

async function signup(evt) {
  console.debug("signup", evt);
  evt.preventDefault();

  const name = $("#signup-name").val();
  const username = $("#signup-username").val();
  const password = $("#signup-password").val();

  // User.signup retrieves user info from API and returns User instance
  // which we'll make the globally-available, logged-in user.
  currentUser = await User.signup(username, password, name);

  saveUserCredentialsInLocalStorage();
  updateUIOnUserLogin();

  $signupForm.trigger("reset");
}

$signupForm.on("submit", signup);

/** Handle click of logout button
 *
 * Remove their credentials from localStorage and refresh page
 */

function logout(evt) {
  console.debug("logout", evt);
  localStorage.clear();
  location.reload();
}

$navLogOut.on("click", logout);

/******************************************************************************
 * Storing/recalling previously-logged-in-user with localStorage
 */

/** If there are user credentials in local storage, use those to log in
 * that user. This is meant to be called on page load, just once.
 */

async function checkForRememberedUser() {
  console.debug("checkForRememberedUser");
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  if (!token || !username) return false;

  // try to log in with these credentials (will be null if login failed)
  currentUser = await User.loginViaStoredCredentials(token, username);
}

/** Sync current user information to localStorage.
 *
 * We store the username/token in localStorage so when the page is refreshed
 * (or the user revisits the site later), they will still be logged in.
 */

function saveUserCredentialsInLocalStorage() {
  console.debug("saveUserCredentialsInLocalStorage");
  if (currentUser) {
    localStorage.setItem("token", currentUser.loginToken);
    localStorage.setItem("username", currentUser.username);
    // localStorage.setItem("favorites", favoritesList);
  }
}

/******************************************************************************
 * General UI stuff about users
 */

/** When a user signs up or registers, we want to set up the UI for them:
 *
 * - show the stories list
 * - update nav bar options for logged-in user
 * - generate the user profile part of the page
 */

function updateUIOnUserLogin() {
  console.debug("updateUIOnUserLogin");

  $allStoriesList.show();
  updateNavOnLogin();
  updateStoryListWithFaves();
  $signupForm.hide();
  $loginForm.hide();
}



/******************* new code below here ********************/

//mark and unmark an existing story as a favorite

async function toggleFavoriteStory(evt){
  console.debug("toggleFavoriteStory");
  $(this).toggleClass(['far', 'fas']);

  // the storyId is how we'll add and remove
  const storyId = evt.target.parentElement.id;
  let newFaveList = JSON.parse(localStorage.getItem('favoritesList'));

  // not fave, so remove by id
  if ($(this).hasClass('far')){
    newFaveList = newFaveList.filter( (story) => {
      return (story.storyId !== storyId);
    })
   //fave, so add to list
  }else{
    let faveStory = await Story.getSingleStory(storyId);
    if (!newFaveList){
      newFaveList = [];
    }
    newFaveList.push(faveStory);
  }
  localStorage.setItem('favoritesList', JSON.stringify(newFaveList));
}

$allStoriesList.on("click", ".fa-star", toggleFavoriteStory);


//mark the favorites star when you show the list

function updateStoryListWithFaves() {
  let faveList = JSON.parse(localStorage.getItem('favoritesList'));
  if (faveList){
    for (const story of faveList){
      if($(`#${story.storyId}`).length !== 0){ // example of zero: fave stories that aren't your own on my stories
        $(`#${story.storyId}`)[0].childNodes[faveStarNode].setAttribute('class', 'fas fa-star');
      }
    }
  }
  showStars();
}


// when user clicked on "favorites" in nav bar to see their favorites
// this is called by event handler in nav.js

function showFavorites(){
  let faveList = JSON.parse(localStorage.getItem('favoritesList'));
  hidePageComponents();
  $allStoriesList.empty();

  if (faveList){
    for (let story of faveList) {
      const tempStory = new Story(story);
      const $story = generateStoryMarkup(tempStory);
      $allStoriesList.append($story);
    }
  }
  updateStoryListWithFaves();
  $allStoriesList.show();
}

// when user clicked on "favorites" in nav bar to see their favorites
// this is called by event handler in nav.js

function showMyStories(){

  let myStories = storyList.stories.filter((story) =>{
    return currentUser.username === story.username;
  });

  hidePageComponents();
  $allStoriesList.empty();

  if (myStories){
    for (let story of myStories) {
      const $story = generateStoryMarkup(story);
      $allStoriesList.append($story);
    }
  }
  updateStoryListWithFaves();
  showTrash();
  $allStoriesList.show();
}


async function trashCanClicked(evt){
  console.debug("trashCanClicked");
  const idToDelete = evt.target.parentElement.id;
  await StoryList.discardStory(currentUser, idToDelete);
  evt.target.parentElement.remove();
  storyList.stories = storyList.stories.filter(story => idToDelete !== story.storyId);
}

$allStoriesList.on("click", ".fa-trash-alt", trashCanClicked);