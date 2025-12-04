import { formatEther, JsonRpcProvider } from "ethers";

interface EstimateGasCost {
  to: string;
  from: string;
  data: string;
  provider: JsonRpcProvider;
  maxFee: bigint;
}

export async function isSufficientFee({
  to,
  from,
  data,
  provider,
  maxFee,
}: EstimateGasCost): Promise<boolean> {
  const gasEstimate: bigint = await provider.estimateGas({
    from,
    to,
    data,
  });
  const estimateNativeCost: bigint = gasEstimate * maxFee;
  const balanceNative: bigint = await provider.getBalance(from);

  console.log(
    `Estimate fee: ${formatEther(
      estimateNativeCost
    )}, Your native balance: ${formatEther(balanceNative)}`
  );
  if (balanceNative >= estimateNativeCost) return true;
  return false;
}
