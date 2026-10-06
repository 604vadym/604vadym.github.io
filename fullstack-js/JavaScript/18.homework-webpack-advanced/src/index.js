import $ from "jquery";
import Post from "@/post.js";
import logo from "@assets/icon-square-big.png";
import data from "@assets/data.json" with { type: "json" };
import "@css/style.css";
import "@scss/style.scss";

document.addEventListener("click", () => {
    console.log(`You clicked ${window.statistics.getClicks()} times`);
});

const post = new Post("Webpack Post Title", logo);

console.log("Post to string:", post.toString());

console.log("Hello");

console.log("Imported image path:", logo);

const img = document.createElement("img");
img.src = logo;
img.width = 150;
document.body.append(img);

console.log("Imported JSON:", data);

$("pre").html(post.toString());

const getResource = () => ({
    [Symbol.dispose]() {
        console.log("Resource automatically cleared");
    },
});

function testBabel8() {
    using resource = getResource();
    console.log("Using resource...", resource);
}
testBabel8();
