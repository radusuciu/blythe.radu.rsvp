# Blythe and Radu's RSVP project

So I wasn't fully happy with most of the online RSVP solutions out there and I also wanted a small project to test out a few new (for me) technologies. I wanted to expiriment with the Vue 3 composition API, Pinia, and Netlify's serverless functions. As a result, this is probably a bit over-engineered for the functionality that it achieves, and also at some points rushed since we do need to get these invites out lol.

## API Secrets

API secrets can be modified on the Netlify website or using the CLI. To import from an .env file (which should not be checked in to version control!):

```bash
netlify env:import .env
```
