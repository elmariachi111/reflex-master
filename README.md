# reflex-master

is just a plain demo to demonstrate how users can safely store data in a shared health profile without compromising their privacy.

## Note on Vite / Vercel

Vercel has some 💩 issue with running serverless functions by vite correctly. My solution here is:

- `_api` contains the serverless function code. That's picked up by vercel without any problems. `_api` routes are available under `/api`, without any restriction
- Locally this doesnt work. I've created a `vdev` script that launches the local page using vercel cli. This does **not** pick up `_api`
- Solution is: before running `vercel dev` we're symlinking `api` -> `_api`. Works without further configuration.

If you're on Windows, install a different os. For real, it's 2025.