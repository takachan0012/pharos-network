import { earn } from "@scripts/pharosNetwork/atlantic/aquaflux/earn";
import { SAsset, sAssets } from "@scripts/pharosNetwork/atlantic/aquaflux/data";
import { wallet, provider, envLoaded } from "../setup";
import { randomAmount } from "@scripts/utils/amount";
import { tokenBalance } from "@scripts/utils/balance";
import { failed } from "@scripts/utils/console";
import { formatUnits, parseEther } from "ethers";
import { sleep } from "@scripts/utils/time";

const MIN_AMOUNT: bigint = parseEther("0.01");

async function main() {
  const env = envLoaded();
  for (let index = 1; index <= env.LOOP_COUNT; index++) {
    console.log(`Aquaflux earn ${index}/${env.LOOP_COUNT}`);
    const randomIndex: number = Math.floor(
      randomAmount({
        min: 0,
        max: sAssets.length,
      })
    );
    const selectedAsset: SAsset = sAssets[randomIndex];
    const { balance: assetBalance, decimals } = await tokenBalance({
      address: wallet.address,
      provider,
      tokenAddress: selectedAsset.address,
    });
    const amount: bigint =
      (assetBalance * BigInt(env.AMOUNT_IN_PERCENT)) / 100n;
    if (amount <= MIN_AMOUNT)
      throw new Error(
        `Insufficient ${selectedAsset.name}: ${formatUnits(
          assetBalance,
          decimals
        )} or less than min amount to stake: 0.01`
      );
    console.log(`Selected asset: ${selectedAsset.name}, Action: Stake`);
    await earn({
      amount,
      asset: selectedAsset,
      signer: wallet.signer,
      provider,
      router: selectedAsset.router,
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
