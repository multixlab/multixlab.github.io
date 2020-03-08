default:
	bundle exec jekyll serve --livereload

rebase:
	@{ \
	set -e; \
	if [ -n "$$(git status --porcelain)" ]; then echo "there are changes to commit"; else \
	git checkout master; \
	git rebase dev; \
	git push; \
	git checkout -; fi \
	}
