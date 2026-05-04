// builder.js
export async function buildBundle(targetTx, opportunity) {
  const nonce = await wallet.getNonce();

  // 내 Arb tx 생성
  const arbTx = await wallet.signTransaction({
    to:       opportunity.buyOn === "uniswap"
                ? ADDRESSES.UNISWAP_V2_ROUTER
                : ADDRESSES.SUSHISWAP_ROUTER,
    data:     encodeSwapCalldata(opportunity),
    value:    ethers.parseEther("0.5"),       // 투입 자본
    gasLimit: 200000n,
    maxFeePerGas:         targetTx.maxFeePerGas,         // victim tx와 동일 수준
    maxPriorityFeePerGas: targetTx.maxPriorityFeePerGas,
    nonce,
    chainId: 1,
    type: 2,
  });

  // 번들 = [victim tx (raw), 내 arb tx (signed)]
  // victim tx는 건드리지 않고 그대로 포함
  return [
    targetTx.serialized,   // victim이 먼저
    arbTx,                 // 내 tx가 바로 뒤
  ];
}