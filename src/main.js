// main.js
import { startMonitor }    from "./monitor.js";
import { detectOpportunity } from "./detector.js";
import { buildBundle }     from "./builder.js";
import { initFlashbots, submitBundle } from "./submitter.js";

async function main() {
  await initFlashbots();

  startMonitor(async (targetTx) => {
    // 덩어리 3-A: 기회 탐지
    const opportunity = await detectOpportunity(targetTx);
    if (!opportunity) return;

    console.log(`기회 발견! 예상 수익: ${opportunity.estimatedProfit} ETH`);

    // 덩어리 3-B: 번들 생성
    const bundle = await buildBundle(targetTx, opportunity);

    // 덩어리 4: 제출
    await submitBundle(bundle);
  });
}

main().catch(console.error);
