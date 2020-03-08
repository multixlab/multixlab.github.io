default:
	bundle exec jekyll serve --livereload

rebase:
	@{ \
	set -e; \
	git fetch; \
	if [ -n "$$(git status --porcelain)" ]; then echo "there are changes to commit";  \
	elif [ -n "$$(git log --oneline origin/dev..HEAD)" ]; then echo "some changes are not pushed to remote"; else \
	git checkout master; \
	git rebase dev; \
	git push; \
	git checkout -; fi \
	}
