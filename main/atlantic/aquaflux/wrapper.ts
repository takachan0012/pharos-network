import { wrapper } from "@scripts/pharosNetwork/atlantic/aquaflux/wrapper";
import { envLoaded, wallet, provider } from "../setup";
import { randomAmount } from "@scripts/utils/amount";
import {
  actions,
  Assets,
  assets,
  routerAquaflux,
  wAssets,
} from "@scripts/pharosNetwork/atlantic/aquaflux/data";
import { tokenBalance } from "@scripts/utils/balance";
import { formatUnits } from "ethers";
import { failed } from "@scripts/utils/console";
import { Token } from "@scripts/pharosNetwork/atlantic/generalData";
import { sleep } from "@scripts/utils/time";

async function main() {
  const env = envLoaded();
  for (let index = 1; index <= env.LOOP_COUNT; index++) {
    console.log(`Aquaflux structure wrapper ${index}/${env.LOOP_COUNT}`);
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
    let amount: bigint = (assetBalance * BigInt(env.AMOUNT_IN_PERCENT)) / 100n;
    if (amount <= 1n)
      throw new Error(
        `Insufficient ${selectedAsset.name}: ${formatUnits(
          assetBalance,
          decimals
        )}`
      );
    const randomActionIndex: number = Math.floor(
      randomAmount({
        min: 0,
        max: actions.length,
      })
    );
    const selectedAction: string = actions[randomActionIndex];
    if (selectedAction == "unwrap") {
      const selectedWrapToken: Token = wAssets.filter((asset) =>
        asset.name.includes(selectedAsset.name)
      )[0];
      const { balance: wAssetBalance, decimals } = await tokenBalance({
        address: wallet.address,
        provider,
        tokenAddress: selectedWrapToken.address,
      });
      if (wAssetBalance <= 1n) {
        throw new Error(
          `Insufficient ${selectedWrapToken.name}: ${formatUnits(
            wAssetBalance,
            decimals
          )}`
        );
      }
      amount = (wAssetBalance * BigInt(env.AMOUNT_IN_PERCENT)) / 100n;
    }
    console.log(
      `Selected asset: ${selectedAsset.name}, Action: ${selectedAction}`
    );
    await wrapper({
      asset: selectedAsset,
      provider,
      signer: wallet.signer,
      amount,
      router: routerAquaflux,
      action: selectedAction,
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
