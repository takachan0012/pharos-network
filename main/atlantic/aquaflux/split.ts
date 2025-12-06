import { split } from "@scripts/pharosNetwork/atlantic/aquaflux/split";
import {
  Assets,
  assets,
  routerAquaflux,
} from "@scripts/pharosNetwork/atlantic/aquaflux/data";
import { wallet, provider, envLoaded } from "../setup";
import { randomAmount } from "@scripts/utils/amount";
import { tokenBalance } from "@scripts/utils/balance";
import { failed } from "@scripts/utils/console";
import { formatUnits } from "ethers";
import { sleep } from "@scripts/utils/time";

async function main() {
  const env = envLoaded();
  for (let index = 1; index <= env.LOOP_COUNT; index++) {
    console.log(`Aquaflux structure split ${index}/${env.LOOP_COUNT}`);
    const randomIndex: number = Math.floor(
      randomAmount({
        min: 0,
        max: assets.length,
      })
    );
    const selectedAsset: Assets = assets[randomIndex];
    const { balance: assetBalance, decimals } = await tokenBalance({
      address: wallet.address,
      provider,
      tokenAddress: selectedAsset.rwaTokenAddress,
    });
    const amount: bigint =
      (assetBalance * BigInt(env.AMOUNT_IN_PERCENT)) / 100n;
    if (amount <= 0n)
      throw new Error(
        `Insufficient ${selectedAsset.name}: ${formatUnits(
          assetBalance,
          decimals
        )}`
      );
    console.log(`Selected asset: ${selectedAsset.name}, Action: split`);
    await split({
      amount,
      asset: selectedAsset,
      signer: wallet.signer,
      provider,
      router: routerAquaflux,
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
