.PHONY: lint
lint:
	deno lint

.PHONY: fmt
fmt:
	deno fmt

.PHONY: fmt-check
fmt-check:
	deno fmt --check

.PHONY: test
test: lint fmt
	deno test --allow-read --allow-net

