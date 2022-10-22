# BlogWebsite

Blog Website - used as an EJS challenge project. This uses express.js and EJS.

Homepage is at `localhost:3000`. You can create posts at `localhost:3000/compose`  which then populate on the homepage. You can also type in `localhost:/3000/posts/postTitle` where "postTitle" is the title of a post seen on the homepage (created on the compose page), and that post will be rendered alone in the window.

Website can be viewed at https://blogwebsite-reap3r.glitch.me/

## Dependencies

-   Node modules - inside project run `npm install`
    -   express
    -   ejs
    -   lodash
    -   eslint - if desired for linting
        -   [ESLint Getting Started Guide](https://eslint.org/docs/latest/user-guide/getting-started)

## Includes

-   JS includes
    -   express
    -   path
    -   url
    -   lodash
-   Express
    -   Using Express routing to dynamically render pages
-   EJS - Data retreival and manipulation
    -   Serving up HTML files with input from server
    -   Retreive data from form, manipulate, and respond to user with updated html file
    -   EJS layouts and running code inside `.ejs` files so we don't have to have a ton of html files
