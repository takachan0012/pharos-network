import { Contract, formatEther, parseUnits } from "ethers";
import { Constant, lendingBorrowAbi } from "./data";
import { isSufficientFee } from "@scripts/utils/fee";
import { success } from "@scripts/utils/console";

export async function borrow({
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
  const data: string = contractRouter.interface.encodeFunctionData("borrow", [
    token.address,
    amount,
    2n,
    0n,
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
    console.log(`Borrowing ${formatEther(amount)} ${token.name}...`);
    const tx = await contractRouter.borrow(
      token.address,
      amount,
      2n,
      0n,
      signer.address
    );
    await tx.wait();
    success({ hash: tx.hash });
    return null;
  } else {
    throw Error(`Insufficient native funds for max gas fee`);
  }
}
