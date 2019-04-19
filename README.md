### Installation instructions

First, clone the repo: `git clone {repo}` and  `cd dsnap-registration`

Then, run: `nvm install` and  `nvm use`

This app requires `node-sass` to run as well, so install that using `npm install -g node-sass`.

Finally, run `yarn install` to install all the dependencies.

Once everything is set up, you can run the development server by running `yarn start` and navigating to `localhost:3000`
in the browser of your choice


### Environments

### Deployment

The project has been set up for continuous integration and deployment through CirclCI and cloud.gov. The cloud.gov spaces, URLs and deployment triggers are:

| Space | URL | Deployment trigger |
|-------|-----|--------------------|
| dev   | https://dsnap-registration-dev.app.cloud.gov | Any push to a branch other than `master` or `develop`|
| staging   | https://dsnap-registration-staging.app.cloud.gov | Any push to `develop`|
| prod   | https://dsnap-registration.app.cloud.gov | Any push to `master` |

### Tests

To run the specs, simply run `yarn test` from the command line
