
JSON= $(wildcard lib/*/*.json)
SRC= $(wildcard lib/*/*.js)
STYL= $(wildcard lib/*/*.styl)
CSS= $(STYL:.styl=.css)

build: node_modules components $(SRC) $(CSS)
	@component build

components: $(JSON)
	@component install

%.css: %.styl
	@styl -w < $< > $@

clean:
	rm -rf build components $(CSS)

node_modules: package.json
	@npm i

.PHONY: clean
