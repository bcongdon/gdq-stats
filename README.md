# sgdq-stats
> :space_invader: Stats webpage for [GamesDoneQuick](gamesdonequick.com)

## Frontend
The actual visualization is done by D3.js. Other tools used include: 

* `odometer` - Cool JS animated odometers
* `jQuery`
* `moment.js`
* `Jekyll` + `Reduce` to generate / minify the site's assets

## Backend
This page uses [GDQ-Collector](https://github.com/bcongdon/gdq-collector) to parse the SGDQ donation tracker and to collect Twitch viewership information. This data is updated every minute.

An AWS RDS PostgreSQL instance is used as the backend data repository.

### Attribution
* [alligatr](http://alligatr.co.uk/) - for his previous years of doing SGDQ/AGDQ stats. The initial design of this site was heavily inspired by alligatr's past work.
* [David Ensinger](http://davidensinger.com/2013/08/how-i-use-reduce-to-minify-and-optimize-assets-for-production/) - for his great minifier Rakefile blog post