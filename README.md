# AlphaBravo Engineering Blog

This is the Alphabravo Engineering Blog found at https://blog.alphabravo.io

It is currently (Nov 2021) hosted on Github Sites.

## Requirements
- Github keys added for AlphaBravoCompany on Github. https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account
- An appropriate config in `~/.ssh/config` for the Github account

## First time editing the blog

1. Clone this repo locally using SSH
2. Create a new post (see below)
3. To preview, run the Hugo container and open https://localhost:1313 to see the rendered site (see below)
4. When edits are complete, run the Publish step (see below)
5. Push changes to master on Github. Site will update automatically.
6. Verify that https://blog.alphabravo.io shows the content as expected

## Editing when already cloned

1. `cd` into the `blog.alphabravo.io` directory
2. Run `git pull`
3. Make edits and push changes

## To create a new post

1. Under `content/posts/YEAR/` copy an existing post and give it a new name for your post
2. Update the top post information in your document to include the new name, slug, date, etc
3. When adding pictures the the post, copy them into `content/asstes` and then reference them in the post at `/assets/my-picture-name.png`
4. Reference existing posts for how to include links, etc.
5. Preview changes locally using the Docker container
6. Push changes to master on Github. Site will update automatically.
7. Verify that https://blog.alphabravo.io shows the content as expected

## Publish to the real blog

1. Once you have made your changes and everything looks good in the local docker container, run `docker run --rm -v ${PWD}:/site alphabravocompany/hugo-docker:latest -D`. This outputs your content into the `docs` directory as static content.
2. Run `git add -A` to add all changes
3. Run `git commit -m "some meaningful message"`
4. Run `git push`
5. Wait 1-2 minutes and verify the content shows on https://blog.alphabravo.io

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

git remote add origin git@abgithub.com:AlphaBravoCompany/blog.alphabravo.io.git