#![no_std]
use soroban_sdk::{contract, contracterror, contractimpl, contracttype, Address, BytesN, Env};

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum DiceError {
    AlreadyInitialized = 1,
    InvalidGuess = 2,
    GameNotFound = 3,
    NotHouse = 4,
    WrongPhase = 5,
    CommitMismatch = 6,
    GameExpired = 7,
    InsufficientBet = 8,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum GameStatus {
    WaitingForHouseCommit,
    WaitingForReveal,
    Resolved,
    Expired,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Game {
    pub player: Address,
    pub bet_amount: i128,
    pub player_guess: u32,
    pub player_commit: BytesN<32>,
    pub house_commit: BytesN<32>,
    pub status: GameStatus,
    pub ledger_committed: u32,
}

#[contracttype]
pub enum DataKey {
    House,
    Token,
    Game(u64),
    GameCount,
}

#[contract]
pub struct LumenRoll;

#[contractimpl]
impl LumenRoll {
    /// Initialize the contract with the house address and the token to be used for bets.
    pub fn initialize(env: Env, house: Address, token: Address) -> Result<(), DiceError> {
        if env.storage().instance().has(&DataKey::House) {
            return Err(DiceError::AlreadyInitialized);
        }
        env.storage().instance().set(&DataKey::House, &house);
        env.storage().instance().set(&DataKey::Token, &token);
        env.storage().instance().set(&DataKey::GameCount, &0u64);
        Ok(())
    }

    /// Place a bet by committing a hashed secret and escrowing the bet amount.
    pub fn place_bet(
        env: Env,
        player: Address,
        bet_amount: i128,
        player_guess: u32,
        player_commit: BytesN<32>,
    ) -> Result<u64, DiceError> {
        player.require_auth();

        if !(1..=6).contains(&player_guess) {
            return Err(DiceError::InvalidGuess);
        }

        if bet_amount < 1_000_000 {
            // 0.1 XLM minimum
            return Err(DiceError::InsufficientBet);
        }

        // Transfer funds to contract escrow (Implementation left for contributors)
        // let token_client = token::Client::new(&env, &get_token(&env));
        // token_client.transfer(&player, &env.current_contract_address(), &bet_amount);

        let mut count: u64 = env
            .storage()
            .instance()
            .get(&DataKey::GameCount)
            .unwrap_or(0);
        count += 1;

        let game = Game {
            player,
            bet_amount,
            player_guess,
            player_commit,
            house_commit: BytesN::from_array(&env, &[0u8; 32]), // Placeholder
            status: GameStatus::WaitingForHouseCommit,
            ledger_committed: env.ledger().sequence(),
        };

        env.storage().instance().set(&DataKey::Game(count), &game);
        env.storage().instance().set(&DataKey::GameCount, &count);

        Ok(count)
    }

    pub fn get_game(env: Env, game_id: u64) -> Option<Game> {
        env.storage().instance().get(&DataKey::Game(game_id))
    }

    pub fn get_house(env: Env) -> Address {
        env.storage().instance().get(&DataKey::House).unwrap()
    }
}
