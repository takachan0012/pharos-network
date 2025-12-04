import { JsonRpcProvider, Wallet } from "ethers";

export interface Token {
  name: string;
  address: string;
}

export interface Constant {
  token: Token;
  router: string;
  signer: Wallet;
  amount: bigint;
  provider: JsonRpcProvider;
}

export const routerLendingBorrow: string =
  "0x62e72185f7deabda9f6a3df3b23d67530b42eff6";
export const lendingBorrowAbi: string[] = [
  "function supply(address,uint256,address,uint16)",
  "function borrow(address asset, uint256 amount, uint256 interestRateMode, uint16 referralCode, address onBehalfOf)",
  "function repay(address asset, uint256 amount, uint256 interestRateMode, address onBehalfOf)",
  "function withdraw(address asset, uint256 amount, address to)",
];
export const tokenList: Token[] = [
  { name: "wbtc", address: "0x0c64f03eea5c30946d5c55b4b532d08ad74638a4" },
  { name: "weth", address: "0x7d211f77525ea39a0592794f793cc1036eeaccd5" },
];
export const aTokenList: Token[] = [
  { name: "awbtc", address: "0xe85489ea693687c0fb9260fd4a9d419abdbb9a01" },
  { name: "aweth", address: "0x8725ac76a140ec446318cb78c2e6ffd9c3a55fba" },
];
export const debtTokenList: Token[] = [
  {
    name: "variabledebtweth",
    address: "0x7961a194bf89305701dcf3d9a84b5d45e93aae15",
  },
  {
    name: "variabledebtwbtc",
    address: "0x7d6e781e3ae4a072fba9719a19f0051c3b65c130",
  },
];
