import { Contract, formatEther, parseUnits } from "ethers";
import { Constant, lendingBorrowAbi } from "./data";
import { isSufficientFee } from "@scripts/utils/fee";
import { success } from "@scripts/utils/console";

export async function withdraw({
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
  const data: string = contractRouter.interface.encodeFunctionData("withdraw", [
    token.address,
    amount,
    signer.address,
  ]);
  const isSufficientGas = await isSufficientFee({
    to: router,
    from: signer.address,
    data,
    provider,
    maxFee: parseUnits("3", "gwei"),
  });
  if (isSufficientGas) {
    console.log(`Withdrawing ${formatEther(amount)} ${token.name}...`);
    const tx = await contractRouter.withdraw(
      token.address,
      amount,
      signer.address
    );
    await tx.wait();
    success({ hash: tx.hash });
    return null;
  } else {
    throw Error(`Insufficient native funds for max gas fee`);
  }
}
