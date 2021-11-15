# AlphaBravo Engineering Blog

This is the Alphabravo Engineering Blog found at https://blog.alphabravo.io

It is currently (Nov 2021) hosted on Github Sites.


## To begin editing the blog

1. Clone this repo locally
2. Create a new post (see below)
3. To preview, run the Hugo container and open https://localhost:1313 to see the rendered site (see below)
4. When edits are complete, run the Publish step (see below)
5. Push changes to master on Github. Site will update automatically.
6. Verify that https://blog.alphabravo.io shows the content as expected

## To create a new post

1. Under `content/posts/YEAR/` copy an existing post and give it a new name for your post
2. Update the top post information in your document to include the new name, slug, date, etc
3. When adding pictures the the post, copy them into `content/asstes` and then reference them in the post at `/assets/my-picture-name.png`
4. Reference existing posts for how to include links, etc.
5. Preview changes locally using the Docker container
6. Push changes to master on Github. Site will update automatically.
7. Verify that https://blog.alphabravo.io shows the content as expected

## Image Size

*featureImage*: 1600x840
*featuredImagePreview*: 800x240

## Run the site locally

`docker run -it -p 1313:1313 -v ${PWD}:/site alphabravocompany/hugo-docker:latest server -D --bind=0.0.0.0`

## Publish changes into static files

`docker run --rm -v ${PWD}:/site alphabravocompany/hugo-docker:latest -D`

## To generate a new site 
**REFERENCE ONLY. Not usually needed.**

`docker run -it --rm -v ${PWD}:/site alphabravocompany/hugo-docker:latest new site quickstart <SITENAME>`