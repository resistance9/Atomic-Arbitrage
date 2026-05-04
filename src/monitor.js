// monitor.js
import { wsProvider, ADDRESSES } from "./config.js";

const ROUTERS_OF_INTEREST = new Set([
  ADDRESSES.UNISWAP_V2_ROUTER.toLowerCase(),
  ADDRESSES.SUSHISWAP_ROUTER.toLowerCase(),
]);

export function startMonitor(onTargetFound) {
  console.log("Mempool 감시 시작...");

  // pending tx hash가 들어올 때마다 콜백 실행
  wsProvider.on("pending", async (txHash) => {
    try {
      const tx = await wsProvider.getTransaction(txHash);
      if (!tx || !tx.to) return;

      // 필터 1: 관심 DEX Router로 가는 tx만
      if (!ROUTERS_OF_INTEREST.has(tx.to.toLowerCase())) return;

      // 필터 2: 의미있는 금액 (0.1 ETH 이상)
      const minValue = ethers.parseEther("0.1");
      if (tx.value < minValue) return;

      // 여기까지 통과하면 관심 tx
      console.log(`타겟 발견: ${txHash}`);
      onTargetFound(tx);

    } catch (err) {
      // tx가 이미 confirmed되거나 dropped된 경우 무시
    }
  });
}