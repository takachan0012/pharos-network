import { combine } from "@scripts/pharosNetwork/atlantic/aquaflux/combine";
import {
  Assets,
  assets,
  assetsCombine,
  routerAquaflux,
} from "@scripts/pharosNetwork/atlantic/aquaflux/data";
import { wallet, provider, envLoaded } from "../setup";
import { randomAmount } from "@scripts/utils/amount";
import { tokenBalance } from "@scripts/utils/balance";
import { failed } from "@scripts/utils/console";
import { formatUnits } from "ethers";
import { sleep } from "@scripts/utils/time";
import { Token } from "@scripts/pharosNetwork/atlantic/generalData";

async function main() {
  const env = envLoaded();
  for (let index = 1; index <= env.LOOP_COUNT; index++) {
    console.log(`Aquaflux structure combine ${index}/${env.LOOP_COUNT}`);
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
    const selectedAssetCombine: Token = assetsCombine.filter((asset) =>
      asset.name.includes(selectedAsset.name)
    )[0];
    const { balance: assetCombineBalance, decimals: assetCombineDesimals } =
      await tokenBalance({
        address: wallet.address,
        provider,
        tokenAddress: selectedAssetCombine.address,
      });
    const amount: bigint =
      (assetBalance * BigInt(env.AMOUNT_IN_PERCENT)) / 100n;
    if (amount <= 0n || amount > assetCombineBalance)
      throw new Error(
        `Insufficient ${selectedAsset.name}: ${formatUnits(
          assetBalance,
          decimals
        )}, or ${selectedAssetCombine.name}: ${formatUnits(
          assetCombineBalance,
          assetCombineDesimals
        )}`
      );
    console.log(`Selected asset: ${selectedAsset.name}, Action: combine`);
    await combine({
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
