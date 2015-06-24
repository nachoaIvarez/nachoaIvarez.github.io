> Starterkit of a front-end web app using [gulp](http://gulpjs.com/) for the build process and [jspm](http://jspm.io/) to manage dependencies add ES6 support.


## Features

Please see our [gulpfile.js](app/templates/gulpfile.js) for up to date information on what we support.

* Automagic ES6 support
* Automagically wire-up dependencies installed with [jspm](http://jspm.io/)
* CSS Autoprefixing
* Built-in preview server with BrowserSync
* Automagically compile Sass with [libsass](http://libsass.org)
* Automagically lint your scripts
* Map compiled CSS to source stylesheets with source maps
* Awesome image optimization
*

*For more information on what this starterkit can do for you, take a look at the [gulp plugins](app/templates/_package.json) used in our `package.json`.*


## libsass

Keep in mind that libsass is feature-wise not fully compatible with Ruby Sass. Check out [this](http://sass-compatibility.github.io) curated list of incompatibilities to find out which features are missing.

If your favorite feature is missing and you really need Ruby Sass, you can always switch to [gulp-ruby-sass](https://github.com/sindresorhus/gulp-ruby-sass) and update the `sass` task in `gulpfile.js` accordingly.


## Getting Started

- Install dependencies: `npm install --global gulp jspm`
- Run `gulp serve` to preview and watch for changes
