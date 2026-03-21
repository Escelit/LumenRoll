default: build

build:
	stellar contract build

test:
	cargo test

optimize:
	stellar contract optimize --wasm target/wasm32-unknown-unknown/release/lumen_roll_contract.wasm

deploy-testnet: build optimize
	stellar contract deploy \
		--wasm target/wasm32-unknown-unknown/release/lumen_roll_contract.optimized.wasm \
		--source-account default \
		--network testnet
default: build

build:
	stellar contract build

test:
	cargo test

optimize:
	stellar contract optimize --wasm target/wasm32-unknown-unknown/release/lumen_roll_contract.wasm

deploy-testnet: build optimize
	stellar contract deploy \
		--wasm target/wasm32-unknown-unknown/release/lumen_roll_contract.optimized.wasm \
		--source-account default \
		--network testnet
