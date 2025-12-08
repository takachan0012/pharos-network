import { Contract, parseUnits } from "ethers";
import { aquafluxAbi, Earn } from "./data";
import { approve } from "@scripts/utils/approve";
import { isSufficientFee } from "@scripts/utils/fee";
import { success } from "@scripts/utils/console";

export async function earn({ amount, asset, signer, provider, router }: Earn) {
  const contractRouter: Contract = new Contract(router, aquafluxAbi, signer);
  const data = contractRouter.interface.encodeFunctionData("stake", [amount]);

  await approve({
    tokenAddress: asset.address,
    signer,
    router,
    amount,
  });

  const isSufficientGas = await isSufficientFee({
    to: router,
    from: signer.address,
    data,
    provider,
    maxFee: parseUnits("3", "gwei"),
  });

  if (isSufficientGas) {
    const tx = await contractRouter.stake(amount);
    await tx.wait();
    success({ hash: tx.hash });
  } else {
    throw Error(`Insufficient native funds for max gas fee`);
  }
}
