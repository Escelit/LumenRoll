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
// touch 106
// touch 112
// touch 124
// touch 134
// touch 147
// touch 163
// touch 164
// touch 174
// touch 178
// touch 185
// touch 209
