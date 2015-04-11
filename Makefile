BIN = ./node_modules/.bin
SRC = $(shell find src -name '*.js')
LIB = $(SRC:src/%=lib/%)
TESTS = $(wildcard ./src/__tests__/*.js)

BABEL_OPTS = \
	--stage 0

build: $(LIB)

test::
	@$(BIN)/mochify \
		--transform [ babelify $(BABEL_OPTS) ] \
		$(TESTS)

ci::
	@$(BIN)/mochify \
		--watch \
		--transform [ babelify $(BABEL_OPTS) ] \
		$(TESTS)

lint::

release-patch: build test lint
	@$(call release,patch)

release-minor: build test lint
	@$(call release,minor)

release-major: build test lint
	@$(call release,major)

publish:
	git push --tags origin HEAD:master
	npm publish

lib/%.js: src/%.js
	@echo "building $@"
	@mkdir -p $(@D)
	@$(BIN)/babel $(BABEL_OPTS) --source-maps-inline -o $@ $<

clean:
	@rm -rf lib/

define release
	npm version $(1)
endef
