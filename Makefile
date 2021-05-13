develop:
	npx webpack serve --open

install:
	npm ci

build:
	 npx webpack

test:
	npm test --experimental-vm-modules

lint:
	npx eslint .

tests:
	npm test -- --coverage --coverageProvider=v8	

.PHONY: test

