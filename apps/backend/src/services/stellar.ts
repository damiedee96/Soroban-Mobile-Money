import * as StellarSdk from '@stellar/stellar-sdk';
import { logger } from '../utils/logger';

const isTestnet = process.env.STELLAR_NETWORK !== 'mainnet';
const horizonUrl = process.env.STELLAR_HORIZON_URL || 'https://horizon-testnet.stellar.org';
const server = new StellarSdk.Horizon.Server(horizonUrl);
const networkPassphrase = isTestnet
  ? StellarSdk.Networks.TESTNET
  : StellarSdk.Networks.PUBLIC;

interface PaymentParams {
  senderId: string;
  receiverAddress: string;
  amount: string;
  currency: string;
  memo?: string;
}

export const StellarService = {
  generateKeypair() {
    const keypair = StellarSdk.Keypair.random();
    return { publicKey: keypair.publicKey(), secretKey: keypair.secret() };
  },

  async submitPayment(params: PaymentParams): Promise<string> {
    const { receiverAddress, amount, memo } = params;
    const platformSecret = process.env.PLATFORM_SECRET_KEY!;
    const sourceKeypair = StellarSdk.Keypair.fromSecret(platformSecret);
    const sourceAccount = await server.loadAccount(sourceKeypair.publicKey());

    const txBuilder = new StellarSdk.TransactionBuilder(sourceAccount, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase,
    })
      .addOperation(
        StellarSdk.Operation.payment({
          destination: receiverAddress,
          asset: StellarSdk.Asset.native(),
          amount,
        })
      )
      .setTimeout(30);

    if (memo) {
      txBuilder.addMemo(StellarSdk.Memo.text(memo.slice(0, 28)));
    }

    const tx = txBuilder.build();
    tx.sign(sourceKeypair);
    const result = await server.submitTransaction(tx);
    logger.info(`Stellar tx submitted: ${result.hash}`);
    return result.hash;
  },

  async getAccountBalance(address: string): Promise<{ asset: string; balance: string }[]> {
    const account = await server.loadAccount(address);
    return account.balances.map((b: StellarSdk.Horizon.HorizonApi.BalanceLineAsset) => ({
      asset: b.asset_type === 'native' ? 'XLM' : b.asset_code,
      balance: b.balance,
    }));
  },
};
