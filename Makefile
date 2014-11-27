# The site has a lot of dependenices, so just let jekyll decide when to rebuild
.PHONY: _site

_site: vendor/bundle stylesheets/screen.css
	bin/jekyll build

stylesheets/screen.css: vendor/bundle $(shell find _sass -type f -name "*.scss")
	bin/compass compile -s compressed --sass-dir _sass

vendor/bundle: Gemfile.lock .bundle/config
	bundle install
	touch $@
