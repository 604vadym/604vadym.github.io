import "./css/style.css";
import Post from "./post.js";

document.addEventListener("click", () => {
    console.log(`You clicked ${statistics.getClicks()} times`);
});

const post = new Post("Webpack Post Title");

console.log("Post to string:", post.toString());

console.log("Hello");
