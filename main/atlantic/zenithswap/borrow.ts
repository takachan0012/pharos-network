import {
  tokenList,
  routerLendingBorrow,
  aTokenList,
} from "@scripts/pharosNetwork/atlantic/zenithswap/data";
import { wallet, provider, envLoaded } from "../setup";
import { randomAmount } from "@scripts/utils/amount";
import { tokenBalance } from "@scripts/utils/balance";
import { borrow } from "@scripts/pharosNetwork/atlantic/zenithswap/borrow";
import { failed } from "@scripts/utils/console";
import { sleep } from "@scripts/utils/time";

async function main() {
  const env = envLoaded();
  for (let index = 1; index <= env.LOOP_COUNT; index++) {
    console.log(`Zenithswap borrow ${index}/${env.LOOP_COUNT}`);
    const randomIndex = Math.floor(
      randomAmount({
        min: 0,
        max: tokenList.length,
      })
    );
    const selectedToken = tokenList[randomIndex];
    const aTokenAddress = aTokenList.filter((t) =>
      t.name.includes(selectedToken.name)
    )[0].address;
    const { balance: aTokenBalance } = await tokenBalance({
      address: wallet.address,
      provider,
      tokenAddress: aTokenAddress,
    });
    const amountIn = (aTokenBalance * BigInt(env.AMOUNT_IN_PERCENT)) / 100n;
    if (aTokenBalance < amountIn || aTokenBalance == 0n) {
      throw Error(`Insufficient borrowable amount of ${selectedToken.name}`);
    }
    await borrow({
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
