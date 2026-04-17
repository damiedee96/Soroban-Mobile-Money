#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, Map, Symbol, symbol_short};

#[contracttype]
#[derive(Clone)]
pub struct WalletBalance {
    pub owner: Address,
    pub amount: i128,
}

const BALANCES: Symbol = symbol_short!("BALANCES");

#[contract]
pub struct WalletContract;

#[contractimpl]
impl WalletContract {
    pub fn deposit(env: Env, owner: Address, amount: i128) {
        owner.require_auth();
        let mut balances: Map<Address, i128> = env
            .storage()
            .persistent()
            .get(&BALANCES)
            .unwrap_or(Map::new(&env));
        let current = balances.get(owner.clone()).unwrap_or(0);
        balances.set(owner, current + amount);
        env.storage().persistent().set(&BALANCES, &balances);
    }

    pub fn withdraw(env: Env, owner: Address, amount: i128) {
        owner.require_auth();
        let mut balances: Map<Address, i128> = env
            .storage()
            .persistent()
            .get(&BALANCES)
            .unwrap_or(Map::new(&env));
        let current = balances.get(owner.clone()).unwrap_or(0);
        assert!(current >= amount, "Insufficient balance");
        balances.set(owner, current - amount);
        env.storage().persistent().set(&BALANCES, &balances);
    }

    pub fn balance(env: Env, owner: Address) -> i128 {
        let balances: Map<Address, i128> = env
            .storage()
            .persistent()
            .get(&BALANCES)
            .unwrap_or(Map::new(&env));
        balances.get(owner).unwrap_or(0)
    }
}
