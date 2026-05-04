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
// touch 231
// touch 232
// touch 265
// touch 267
// touch 270
// touch 281
// touch 284
// touch 288
// touch 295
// touch 308
// touch 315
// touch 317
// touch 336
// touch 341
// touch 361
// touch 378
// touch 392
// touch 393
