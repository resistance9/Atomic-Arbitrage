// detector.js
import { httpProvider, wallet } from "./config.js";

// 실제 실행 전에 eth_call로 시뮬레이션
// → 가스비 써서 실패하는 최악의 상황을 방지
export async function detectOpportunity(targetTx) {
  try {
    // 1. targetTx의 input data 디코딩 → 어떤 스왑인지 파악
    const iface = new ethers.Interface(UNISWAP_V2_ABI);
    const decoded = iface.parseTransaction({ data: targetTx.data });
    
    // swapExactETHForTokens, swapExactTokensForETH 등
    if (!decoded || !decoded.name.startsWith("swap")) return null;

    const { amountOutMin, path } = decoded.args;
    const tokenIn  = path[0];
    const tokenOut = path[path.length - 1];

    // 2. 두 DEX에서 같은 페어의 현재 가격 조회
    const priceUni   = await getPrice(tokenIn, tokenOut, "uniswap");
    const priceSushi = await getPrice(tokenIn, tokenOut, "sushiswap");

    // 3. 차이가 있으면 기회
    const diff = Math.abs(priceUni - priceSushi) / Math.min(priceUni, priceSushi);
    const GAS_COST_ETH = 0.005; // 예상 가스비

    if (diff > 0.005) { // 0.5% 이상 차이
      const estimatedProfit = calculateProfit(diff, targetTx.value, GAS_COST_ETH);
      if (estimatedProfit > 0) {
        return { tokenIn, tokenOut, buyOn: priceUni < priceSushi ? "uniswap" : "sushiswap", estimatedProfit };
      }
    }
    return null;

  } catch {
    return null;
  }
}