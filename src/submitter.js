// submitter.js
import { FlashbotsBundleProvider } from "@flashbots/ethers-provider-bundle";
import { httpProvider, wallet } from "./config.js";

let flashbotsProvider;

export async function initFlashbots() {
  // Flashbots relay에 연결 (Sepolia 테스트넷)
  flashbotsProvider = await FlashbotsBundleProvider.create(
    httpProvider,
    wallet,   // reputation signing용 지갑
    "https://relay-sepolia.flashbots.net",
    "sepolia"
  );
  console.log("Flashbots 연결 완료");
}

export async function submitBundle(signedBundle) {
  const currentBlock = await httpProvider.getBlockNumber();
  const targetBlock  = currentBlock + 1; // 다음 블록을 노림

  const bundleSubmission = await flashbotsProvider.sendBundle(
    signedBundle.map(tx => ({ signedTransaction: tx })),
    targetBlock
  );

  if ("error" in bundleSubmission) {
    console.error("번들 제출 실패:", bundleSubmission.error.message);
    return false;
  }

  console.log(`번들 제출 완료 → 타겟 블록: ${targetBlock}`);
  console.log(`번들 해시: ${bundleSubmission.bundleHash}`);

  // 결과 대기 (다음 블록 confirm까지)
  const waitResult = await bundleSubmission.wait();
  
  if (waitResult === 0) {
    console.log("번들 포함됨! 이익 실현");
    return true;
  } else {
    console.log("번들 포함 안 됨 (경쟁 패배 또는 기회 소멸)");
    return false;
  }
}