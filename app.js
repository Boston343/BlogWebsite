// npm and express includes
import express from "express"; // npm install express
import path from "path";
import { fileURLToPath } from "url";
// import https from "https"; // for forming external get requests

// local includes
// import * as date from "./src/date.js";

const app = express();
app.set("view engine", "ejs"); // using EJS
const port = process.env.PORT || 3000;
app.use(express.urlencoded({ extended: true })); // this is for parsing data from html form

// __dirname is only available with CJS. Since I am using ESM I need to get it another way
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// static items like other js or css files will not load unless you define where the server should
//      start looking for those files.
app.use(express.static(path.join(__dirname, "/public")));

// text constants for webpages
const homeStartingContent =
    "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
    "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
    "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

// global variables
const posts = [];

// -----------------------------------------------------------------------------------
// ---------------------------------- Listening --------------------------------------
// -----------------------------------------------------------------------------------
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

// -----------------------------------------------------------------------------------
// --------------------------------- Get Requests ------------------------------------
// -----------------------------------------------------------------------------------
// Home page
app.get("/", (req, res) => {
    // console.log("Server is up and running.");
    res.render("home", {
        homeStartingContent: homeStartingContent,
        posts: posts,
    });
});

// -----------------------------------------------------------------------------------
// About Us page
app.get("/about", (req, res) => {
    res.render("about", { aboutContent: aboutContent });
});

// -----------------------------------------------------------------------------------
// Contact Us page
app.get("/contact", (req, res) => {
    res.render("contact", { contactContent: contactContent });
});

// -----------------------------------------------------------------------------------
// Compose page
app.get("/compose", (req, res) => {
    res.render("compose", {});
});

// -----------------------------------------------------------------------------------
// -------------------------------- Post Requests ------------------------------------
// -----------------------------------------------------------------------------------
//  add new item to Blog Website
app.post("/newBlogPost", (req, res) => {
    const post = {
        title: req.body.postTitle,
        content: req.body.postBody,
    };
    posts.push(post);
    res.redirect("/");
});
