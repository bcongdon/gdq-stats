require 'reduce'

require 'rubygems'
require 'rake'
require 'rdoc'
require 'date'
require 'yaml'
require 'tmpdir'
require 'jekyll'
require 'html-proofer'

desc "Build _site"
task :build do
  puts "\n## Generating site files"
  Jekyll::Site.new(Jekyll.configuration({
    "source"      => ".",
    "destination" => "_site"
  })).process
end

desc "Bower install"
task :install do
  puts "##Installing..."
  system('bower install --force')
  puts "##Bower install complete"
end

desc "HTMLProofer Tests"
task :test do
  system('bundle exec jekyll build')
  HTMLProofer.check_directory("_site/", {
    :file_ignore => [/.+\/bower_components.+/]
  }).run()
end

desc "Minify _site/"
task :minify do
  puts "\n## Compressing static assets"
  original = 0.0
  compressed = 0
  Dir.glob("_site/**/*.*") do |file|
    case File.extname(file)
      when ".css", ".gif", ".html", ".jpg", ".jpeg", ".js", ".png", ".xml"
        next if file.split("/").include? "lib" # Don't minify libraries that have copyright notices
        next if file.split("/").include? 'bower_components'
        puts "Processing: #{file}"
        original += File.size(file).to_f
        min = Reduce.reduce(file)
        File.open(file, "w") do |f|
          f.write(min)
        end
        compressed += File.size(file)
      else
        puts "Skipping: #{file}"
      end
  end
  puts "Total compression %0.2f\%" % (((original-compressed)/original)*100)
end

desc "Build and then minify"
task :generate do 
  [ "install", "build", "minify" ].each do |t|
    Rake::Task[t].execute
  end
end

GITHUB_REPONAME = "bcongdon/gdq-stats"

desc "Publish site to gh-pages"
task :publish do
  Dir.mktmpdir do |tmp|
    pwd = Dir.pwd
    Dir.chdir tmp

    system "git init"
    system "git remote add origin git@github.com:#{GITHUB_REPONAME}.git"
    system "git pull origin gh-pages"

    cp_r "#{pwd}/_site/.", tmp

    system "git add ."
    message = "Site updated at #{Time.now.utc}"
    system "git commit -m #{message.inspect}"
    system "git push origin master:refs/heads/gh-pages"

    Dir.chdir pwd
  end
  system "git push origin :refs/tags/deployed"
  system "git tag -f deployed"
  system "git push origin master --tags"
end

desc "Deploy = Generate + Publish"
task :deploy do
  [ "generate", "publish" ].each do |t|
    Rake::Task[t].execute
  end
end
