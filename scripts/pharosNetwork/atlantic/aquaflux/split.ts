import { Contract, parseUnits } from "ethers";
import { aquafluxAbi, Constant } from "./data";
import { approve } from "@scripts/utils/approve";
import { isSufficientFee } from "@scripts/utils/fee";
import { success } from "@scripts/utils/console";

export async function split({
  amount,
  asset,
  signer,
  provider,
  router,
}: Constant) {
  const contractRouter: Contract = new Contract(router, aquafluxAbi, signer);
  const newSelector: string = "0xef272020";
  const data = contractRouter.interface.encodeFunctionData("split", [
    asset.assetId,
    amount,
  ]);

  await approve({
    tokenAddress: asset.rwaTokenAddress,
    signer,
    router,
    amount,
  });

  const newData = newSelector + data.slice(10);
  const isSufficientGas = await isSufficientFee({
    to: router,
    from: signer.address,
    data: newData,
    provider,
    maxFee: parseUnits("3", "gwei"),
  });

  if (isSufficientGas) {
    const tx = await signer.sendTransaction({
      to: router,
      data: newData,
    });
    await tx.wait();
    success({ hash: tx.hash });
  } else {
    throw Error(`Insufficient native funds for max gas fee`);
  }
}
