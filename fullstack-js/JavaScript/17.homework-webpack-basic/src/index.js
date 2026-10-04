import Post from "./post.js";

const post = new Post("Webpack Post Title");

console.log("Post to string:", post.toString());

document.addEventListener("click", () => {
    console.log(`You clicked ${statistics.getClicks()} times`);
});
