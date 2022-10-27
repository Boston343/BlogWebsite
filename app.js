// npm and express includes
import express from "express"; // npm install express
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import _ from "lodash";
// import https from "https"; // for forming external get requests

// local includes
// import * as date from "./src/date.js";

dotenv.config(); // gets the .env data for use with process.env.
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
    "<strong>Welcome to my homepage!</strong> This is a basic blog website used for an EJS and MongoDB challenge. The homepage is at `localhost:3000`, or wherever you already are. You can create posts at `localhost:3000/compose`  which then populate on the homepage. You can also type in `localhost:/3000/posts/postTitle` where 'postTitle' is the title of a post seen on the homepage (created on the compose page), and that post will be rendered alone in the window." +
    "<br><br>" +
    "This uses the Node.js, with modules express, ejs, mongoose, lodash, and dotenv. I also use eslint for linting. Mongoose connects to MongoDB Atlas for permanently storing blog posts in the database.";
const aboutContent =
    "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
    "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

// global variables
const posts = [];

// -----------------------------------------------------------------------------------
// ------------------------------- Mongoose Setup ------------------------------------
// -----------------------------------------------------------------------------------
// connect to MongoDB - local connection
mongoose.connect("mongodb://localhost:27017/blogWebsiteDB", {
    useNewUrlParser: true,
});
// connect to MongoDB Atlas (the cloud)
// mongoose.connect(
//     "mongodb+srv://" +
//         process.env.MONGODB_USER +
//         ":" +
//         process.env.MONGODB_PASS +
//         "@cluster0.ovomich.mongodb.net/blogWebsiteDB?retryWrites=true&w=majority",
//     {
//         useNewUrlParser: true,
//     }
// );

// schema
const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "ERROR: Your blog post needs a title."],
    },
    content: {
        type: String,
        required: [true, "ERROR: Your blog post needs some content."],
    },
});

// model: mongoose will auto make it plural "posts"
const Post = mongoose.model("Post", postSchema);

// -----------------------------------------------------------------------------------
// testing

// remove all items
// synchronous version
const deleted = await Post.deleteMany({});
if (deleted.deletedCount >= 1) {
    console.log("Deleted " + deleted.deletedCount + " items.");
} else {
    console.log("ERROR in deleting items. No items deleted.");
}

// async version
// Post.deleteMany({}, (err, ret) => {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log("Deleted " + ret.deletedCount + " items.");
//     }
// });

const post1 = new Post({
    title: "Test Database Post",
    content:
        "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.",
});

// insert test post into db
post1.save();

// synchronous version
// const inserted = await Post.insertMany(post1);
// console.log(inserted);

// async version
// Item.One(post1, (err, posts) => {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log("Inserted: " + posts);
//     }
// });

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

    Post.find((err, posts) => {
        if (err) {
            console.log(err);
        } else {
            // posts found
            res.render("home", {
                homeStartingContent: homeStartingContent,
                posts: posts,
            });
        }
    });

    // res.render("home", {
    //     homeStartingContent: homeStartingContent,
    //     posts: posts,
    // });
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
// Individual post page, using express routing
app.get("/posts/:postTitle", (req, res) => {
    const reqTitle = _.lowerCase(req.params.postTitle);

    posts.forEach((post) => {
        if (_.lowerCase(post.title) === reqTitle) {
            res.render("post", { post: post });
        }
    });
});

// -----------------------------------------------------------------------------------
// -------------------------------- Post Requests ------------------------------------
// -----------------------------------------------------------------------------------
//  add new item to Blog Website
app.post("/newBlogPost", (req, res) => {
    // create object to hold post details
    const newPost = new Post({
        title: req.body.postTitle,
        content: req.body.postBody,
    });

    // add new post to collection
    newPost.save();

    // reload
    res.redirect("/");
});
