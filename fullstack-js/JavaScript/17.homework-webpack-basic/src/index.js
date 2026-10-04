import "./css/style.css";
import Post from "./post.js";
import logo from "./assets/icon-square-big.png";

document.addEventListener("click", () => {
    console.log(`You clicked ${statistics.getClicks()} times`);
});

const post = new Post("Webpack Post Title");

console.log("Post to string:", post.toString());

console.log("Hello");

console.log(logo);

const img = document.createElement("img");
img.src = logo;
img.width = 150;
document.body.append(img);
