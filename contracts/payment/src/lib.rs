#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, Symbol, symbol_short, Vec};

#[contracttype]
#[derive(Clone)]
pub struct Payment {
    pub sender: Address,
    pub receiver: Address,
    pub amount: i128,
    pub timestamp: u64,
}

const PAYMENTS: Symbol = symbol_short!("PAYMENTS");

#[contract]
pub struct PaymentContract;

#[contractimpl]
impl PaymentContract {
    pub fn send(env: Env, sender: Address, receiver: Address, amount: i128) -> u32 {
        sender.require_auth();
        assert!(amount > 0, "Amount must be positive");

        let payment = Payment {
            sender,
            receiver,
            amount,
            timestamp: env.ledger().timestamp(),
        };

        let mut payments: Vec<Payment> = env
            .storage()
            .persistent()
            .get(&PAYMENTS)
            .unwrap_or(Vec::new(&env));

        payments.push_back(payment);
        let id = payments.len() - 1;
        env.storage().persistent().set(&PAYMENTS, &payments);
        id
    }

    pub fn get_payment(env: Env, id: u32) -> Payment {
        let payments: Vec<Payment> = env
            .storage()
            .persistent()
            .get(&PAYMENTS)
            .unwrap_or(Vec::new(&env));
        payments.get(id).expect("Payment not found")
    }

    pub fn payment_count(env: Env) -> u32 {
        let payments: Vec<Payment> = env
            .storage()
            .persistent()
            .get(&PAYMENTS)
            .unwrap_or(Vec::new(&env));
        payments.len()
    }
}
