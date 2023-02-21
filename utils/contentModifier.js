//WE HANDLE EVERY TEXT CONTENT SUCH HAS HANDLING POST TOPICS, LISTS, FILTER BAD WORDS ETC
const Filter = require("bad-words");

//1. HANDLE POST TOPIC
let appTopics = new Map();

//SET MAP VALUES
appTopics.set("frontend", "frontend");
appTopics.set("backend", "backend");
appTopics.set("devops", "devops");
appTopics.set("cloud", "cloud");
appTopics.set("tech", "tech");
appTopics.set("data", "data");
appTopics.set("hiring", "hiring");
appTopics.set("collaboration", "collaboration");
appTopics.set("100days", "100days");

//GET CONTENT CONTEXT/TOPIC
// @param content string,
// @param arr array
const dectectTopic = (content, arr) => {
  //1. Split the content
  let splitContent = content.trim().split(/\s|\b/);
  //2. Run the new array with the appTopic
  for (let i = 0; i < splitContent.length; i++) {
    if (appTopics.has(splitContent[i])) {
      arr.push(splitContent[i]);
    }
  }
};

//FILTER CONTENT

const filterContent = (content) => {
  //1. Create a new instance of the filter object
  let filter = new Filter();
  let newContent = filter.clean(content);
  return newContent;
};

module.exports = { dectectTopic, filterContent };
