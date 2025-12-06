import { Contract, parseUnits } from "ethers";
import { aquafluxAbi, Wrapper } from "./data";
import { approve } from "@scripts/utils/approve";
import { isSufficientFee } from "@scripts/utils/fee";
import { success } from "@scripts/utils/console";

export async function wrapper({
  asset,
  provider,
  signer,
  amount,
  router,
  action,
}: Wrapper) {
  const contractRouter: Contract = new Contract(router, aquafluxAbi, signer);
  if (action == "wrap") {
    await approve({
      tokenAddress: asset.rwaTokenAddress,
      signer,
      router,
      amount,
    });
  }
  const data = contractRouter.interface.encodeFunctionData(action, [
    asset.assetId,
    amount,
  ]);
  const isSufficientGas = await isSufficientFee({
    to: router,
    from: signer.address,
    data,
    provider,
    maxFee: parseUnits("3", "gwei"),
  });
  if (isSufficientGas) {
    const tx = await contractRouter[action](asset.assetId, amount);
    await tx.wait();
    success({ hash: tx.hash });
  } else {
    throw Error(`Insufficient native funds for max gas fee`);
  }
}
