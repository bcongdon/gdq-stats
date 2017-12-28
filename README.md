# gdq-stats
> :space_invader: Stats webpage for [GamesDoneQuick](gamesdonequick.com). Hosted at [gdqstat.us](http://gdqstat.us)

## Frontend
The actual visualization is done by Recharts. Other tools used include: 
* `React` + `Redux` for rendering and application dataflow
* `Jekyll` + `Reduce` to generate / minify the site's assets
* `odometer` for cool JS animated odometers
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
2. Run `bundle install` to pull down the Ruby dependencies.
3. Run `npm install` to pull down the NPM dependencies.
4. Run `npm start` to build the static bundles.
5. In a seperate terminal window, run `rake serve` to build the HTML templates.
6. Visit `http://localhost:4000` in your browser.

## Previous Events

* [SGDQ 2017](http://gdqstat.us/previous-events/sgdq-2017)
* [AGDQ 2017](http://gdqstat.us/previous-events/agdq-2017)
* [SGDQ 2016](http://gdqstat.us/previous-events/sgdq-2016)

### Attribution
* [alligatr](http://alligatr.co.uk/) - for his previous years of doing SGDQ/AGDQ stats. The initial design of this site was heavily inspired by alligatr's past work.
* [David Ensinger](http://davidensinger.com/2013/08/how-i-use-reduce-to-minify-and-optimize-assets-for-production/) - for his great minifier Rakefile blog post
