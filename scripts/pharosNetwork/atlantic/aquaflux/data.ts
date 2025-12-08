import { JsonRpcProvider, Wallet } from "ethers";
import { Token } from "../generalData";

export interface Assets {
  assetId: string;
  rwaTokenAddress: string;
  name: string;
}

export interface Constant {
  router: string;
  amount: bigint;
  asset: Assets;
  signer: Wallet;
  provider: JsonRpcProvider;
}

export interface Wrapper extends Constant {
  action: string;
}

export interface SAsset extends Token {
  router: string;
}

export interface Earn {
  router: string;
  amount: bigint;
  asset: SAsset;
  signer: Wallet;
  provider: JsonRpcProvider;
}

export const aquafluxAbi: string[] = [
  "function split(bytes32 assetId, uint256 amount)",
  "function wrap(bytes32,uint256)",
  "function unwrap(bytes32,uint256)",
  "function stake(uint256 amount)",
];

export const routerAquaflux: string =
  "0x62fdbc600e8badf8127e6298dd12b961edf08b5f";

export const assets: Assets[] = [
  {
    assetId:
      "0xd048a586b49e0cf14afc137d0ebec0024a50aa5be56d006ecf46088f47537e33",
    rwaTokenAddress: "0x5E789Bb07B2225132d26BB0FFaca7e37A5eCbEbB",
    name: "US Treasury",
  },
  // {
  //   assetId:
  //     "0x0a1c4ee21e059ba93ecb0f76d45cc15098d63f0a682ae37c1eacc4a28da26b05",
  //   rwaTokenAddress: "0x0B02c43372634FC15c3F338756b74b121C99F9c4",
  //   name: "Money Market Fund",
  // },
  {
    assetId:
      "0xb6dad7cac45cd7ee7d611c0160667e8595bcece1e8dc2b22228b6f329e1caa60",
    rwaTokenAddress: "0x656B4948C470F3420805abCB43F3928820A0f26D",
    name: "Corporate Bond",
  },
  {
    assetId:
      "0x8b79ddf5ff2f0db54884b06a0b748a687abe7eb723e676eac22a5a811e9312ae",
    rwaTokenAddress: "0x4f848D61B35033619Ce558a2FCe8447Cedd38D0d",
    name: "Private Credit",
  },
];

export const assetsCombine: Token[] = [
  {
    name: "P US Treasury",
    address: "0x2bb80cfd6f2b14f6b93b1269c9a19f2dc0933344",
  },
  {
    name: "P Corporate Bond",
    address: "0x4882664f9a3d055aef9c92b6d8d65a7939f77eaa",
  },
  {
    name: "P Private Credit",
    address: "0x1f9a5b9dc6e237cfd37864b6eb982a35a9deaebf",
  },
];

export const wAssets: Token[] = [
  {
    name: "wrap US Treasury",
    address: "0xd97d27e267d8ee5ed346366828791378f9e0145b",
  },
  {
    name: "wrap Corporate Bond",
    address: "0x612ee0fa732311cd72c0bc058e336113444c2ee7",
  },
  {
    name: "wrap Private Credit",
    address: "0x3f73e248be3a004ebfefc05233b22e9496bd94b4",
  },
];

export const sAssets: SAsset[] = [
  {
    name: "S Corporate Bond",
    address: "0xed75c5b68284a1a9568e26a2b48655a3d518d4bc",
    router: "0x534966536969c3b697a04538e475992c981521cf",
  },
  {
    name: "S US Treasury",
    address: "0x93bc7267d802201e51926bef331de80c965ec55f",
    router: "0x92864f94020e79a52aca036c6a3d3be9d4388a39",
  },
  {
    name: "S Private Credit",
    address: "0xc1cf3cf3a86807e8319c0ab1754413c854ab5b7d",
    router: "0x3eaef8f467059915a6eeb985a0d08de063ab16f9",
  },
];

export const actions: string[] = ["wrap", "unwrap"];
