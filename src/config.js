// config.js
import { ethers } from "ethers";
import dotenv from "dotenv";
dotenv.config();

// WebSocket provider — Mempool 구독에 필수
// HTTP provider는 한 번 읽고 끝, WS는 실시간 스트림
export const wsProvider = new ethers.WebSocketProvider(process.env.RPC_URL_WS);

// HTTP provider — eth_call, 잔액 조회 등 단발성 쿼리용
export const httpProvider = new ethers.JsonRpcProvider(process.env.RPC_URL_HTTP);

// 서명용 지갑 — 번들 tx에 sign할 때 사용
export const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, httpProvider);

// 자주 쓰는 DEX Router 주소들
export const ADDRESSES = {
  UNISWAP_V2_ROUTER: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
  SUSHISWAP_ROUTER:  "0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F",
  WETH:              "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
};