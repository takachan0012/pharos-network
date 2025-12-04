import { Contract, formatEther, parseUnits } from "ethers";
import { Constant, lendingBorrowAbi } from "./data";
import { isSufficientFee } from "@scripts/utils/fee";
import { success } from "@scripts/utils/console";
import { approve } from "@scripts/utils/approve";

export async function repay({
  token,
  router,
  signer,
  amount,
  provider,
}: Constant): Promise<undefined | null> {
  const contractRouter: Contract = new Contract(
    router,
    lendingBorrowAbi,
    signer
  );
  const data: string = contractRouter.interface.encodeFunctionData("repay", [
    token.address,
    amount,
    2n,
    signer.address,
  ]);
  await approve({
    tokenAddress: token.address,
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
    console.log(`Repaying ${formatEther(amount)} ${token.name}...`);
    const tx = await contractRouter.repay(
      token.address,
      amount,
      2n,
      signer.address
    );
    await tx.wait();
    success({ hash: tx.hash });
    return null;
  } else {
    throw Error(`Insufficient native funds for max gas fee`);
  }
}
