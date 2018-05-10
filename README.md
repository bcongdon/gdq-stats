# gdq-stats
> :space_invader: Stats webpage for [GamesDoneQuick](gamesdonequick.com). Hosted at [gdqstat.us](http://gdqstat.us)

## Frontend
The actual visualization is done by Recharts. Other tools used include: 
* `React` + `Redux` for rendering and application dataflow
* `Webpack` + `Gulp` to generate / minify the site's assets
* `Hugo` for minor HTML templating
* `odometer` for animated odometers
* `C3js` for pie charts
* `moment.js`

Tools used in previous versions of the site:
* `jQuery`
* `D3.js` - (This is still used, under the hood)

## Backend
This page uses [gdq-collector](https://github.com/bcongdon/gdq-collector) to parse the GDQ donation tracker and to collect Twitch viewership information. This data is updated every minute.

Please visit that repo for more detailed information about the gdq-stats backend.

## Run it yourself

1. Clone the repo.
1. Run `npm install` to pull down the NPM dependencies.
1. Run `npm start` to build the site and start a local server.
1. Visit `http://localhost:3000` in your browser.

## Previous Events

* [AGDQ 2018](http://gdqstat.us/previous-events/agdq-2018)
* [SGDQ 2017](http://gdqstat.us/previous-events/sgdq-2017)
* [AGDQ 2017](http://gdqstat.us/previous-events/agdq-2017)
* [SGDQ 2016](http://gdqstat.us/previous-events/sgdq-2016)

### Attribution
* [alligatr](http://alligatr.co.uk/) - for his previous years of doing SGDQ/AGDQ stats. The initial design of this site was heavily inspired by alligatr's past work.
* [David Ensinger](http://davidensinger.com/2013/08/how-i-use-reduce-to-minify-and-optimize-assets-for-production/) - for his great minifier Rakefile blog post
