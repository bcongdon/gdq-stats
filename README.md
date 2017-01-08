# gdq-stats
> :space_invader: Stats webpage for [GamesDoneQuick](gamesdonequick.com). Hosted at [gdqstat.us](http://gdqstat.us)

## Frontend
The actual visualization is done by D3.js. Other tools used include: 

* `odometer` - Cool JS animated odometers
* `jQuery`
* `moment.js`
* `Jekyll` + `Reduce` to generate / minify the site's assets

## Backend
This page uses [gdq-collector](https://github.com/bcongdon/gdq-collector) to parse the GDQ donation tracker and to collect Twitch viewership information. This data is updated every minute.

An AWS RDS PostgreSQL instance is used as the backend data repository.

## Run it yourself:

1. Clone the repo.
2. Run `bundle install` to pull down the dependencies.
3. Run `bundle exec jekyll serve` to build and serve the website to `localhost`.

### Attribution
* [alligatr](http://alligatr.co.uk/) - for his previous years of doing SGDQ/AGDQ stats. The initial design of this site was heavily inspired by alligatr's past work.
* [David Ensinger](http://davidensinger.com/2013/08/how-i-use-reduce-to-minify-and-optimize-assets-for-production/) - for his great minifier Rakefile blog post