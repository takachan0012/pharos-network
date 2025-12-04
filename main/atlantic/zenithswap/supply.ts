import {
  tokenList,
  routerLendingBorrow,
} from "@scripts/pharosNetwork/atlantic/zenithswap/data";
import { wallet, provider, envLoaded } from "../setup";
import { randomAmount } from "@scripts/utils/amount";
import { tokenBalance } from "@scripts/utils/balance";
import { supply } from "@scripts/pharosNetwork/atlantic/zenithswap/supply";
import { failed } from "@scripts/utils/console";
import { sleep } from "@scripts/utils/time";

async function main() {
  const env = envLoaded();
  for (let index = 1; index <= env.LOOP_COUNT; index++) {
    console.log(`Zenithswap supply ${index}/${env.LOOP_COUNT}`);
    const randomIndex = Math.floor(
      randomAmount({
        min: 0,
        max: tokenList.length,
      })
    );
    const selectedToken = tokenList[randomIndex];
    const { balance } = await tokenBalance({
      address: wallet.address,
      provider,
      tokenAddress: selectedToken.address,
    });
    const amountIn = (balance * BigInt(env.AMOUNT_IN_PERCENT)) / 100n;
    await supply({
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
