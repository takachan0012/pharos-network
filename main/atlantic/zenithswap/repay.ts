import {
  tokenList,
  routerLendingBorrow,
  debtTokenList,
} from "@scripts/pharosNetwork/atlantic/zenithswap/data";
import { wallet, provider, envLoaded } from "../setup";
import { randomAmount } from "@scripts/utils/amount";
import { tokenBalance } from "@scripts/utils/balance";
import { repay } from "@scripts/pharosNetwork/atlantic/zenithswap/repay";
import { failed } from "@scripts/utils/console";
import { sleep } from "@scripts/utils/time";

async function main() {
  const env = envLoaded();
  for (let index = 1; index <= env.LOOP_COUNT; index++) {
    console.log(`Zenithswap repay ${index}/${env.LOOP_COUNT}`);
    const randomIndex = Math.floor(
      randomAmount({
        min: 0,
        max: tokenList.length,
      })
    );
    const selectedToken = tokenList[randomIndex];
    const adebtTokenAddress = debtTokenList.filter((t) =>
      t.name.includes(selectedToken.name)
    )[0].address;
    const { balance: adebtTokenbalance } = await tokenBalance({
      address: wallet.address,
      provider,
      tokenAddress: adebtTokenAddress,
    });
    const amountIn = (adebtTokenbalance * BigInt(env.AMOUNT_IN_PERCENT)) / 100n;
    if (adebtTokenbalance < amountIn || adebtTokenbalance == 0n) {
      throw Error(`Insufficient for repaying amount of ${selectedToken.name}`);
    }
    await repay({
      token: selectedToken,
      router: routerLendingBorrow,
      signer: wallet.signer,
      amount: amountIn,
      provider,
    });
    await sleep(
      randomAmount({
        min: env.TIMEOUT_MIN_MS,
        max: env.TIMEOUT_MAX_MS,
      })
    );
  }
}
main().catch((error) => failed({ errorMessage: error }));
