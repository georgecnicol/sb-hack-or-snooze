"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  // fas fa-star  ... solid (fave)
  // far fa-star  ... hollow (not fave)

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}"><i class="fa-star far hidden"></i>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }
  if(currentUser) $(".fa-star").show();

  $allStoriesList.show();
}

/************** new code below here *****************/


//add a new story by clicking on submit after filling out the form
async function addStorySubmitButton(evt){
  console.debug("addStorySubmitButtong");
  evt.preventDefault();

  const storyToAdd = {
    'author': $("#story-author").val(),
    'title': $("#story-title").val(),
    'url': $("#story-url").val()
  }

  $addStoryForm.trigger("reset");
  await StoryList.addStory(currentUser, storyToAdd);
  $addStoryForm.hide("slow");
  await getAndShowStoriesOnStart(); // refresh list...

}

$addStoryForm.on("submit", addStorySubmitButton)

