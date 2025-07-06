export const ETH_DECIMALS = 18;
export const WEI_PER_ETH = BigInt(10 ** ETH_DECIMALS);

export function weiToEth(wei: bigint): number {
  return Number(wei) / Number(WEI_PER_ETH);
}

export function ethToWei(eth: number): bigint {
  return BigInt(Math.floor(eth * Number(WEI_PER_ETH)));
}

export function formatWeiAsInteger(wei: bigint): string {
  const weiStr = wei.toString();
  if (weiStr.length === 0) return '0';
  
  const groups = [];
  for (let i = weiStr.length; i > 0; i -= 3) {
    groups.unshift(weiStr.slice(Math.max(0, i - 3), i));
  }
  
  return groups.join(',');
}

export function formatWeiCompact(wei: bigint): string {
  // Convert to ETH for display
  const eth = weiToEth(wei);
  
  if (eth >= 1000000) {
    return (eth / 1000000).toFixed(1) + 'M';
  } else if (eth >= 10000) {
    return (eth / 1000).toFixed(0) + 'K';
  } else if (eth >= 1000) {
    return (eth / 1000).toFixed(1) + 'K';
  } else if (eth >= 100) {
    return eth.toFixed(0);
  } else if (eth >= 10) {
    return eth.toFixed(1);
  } else if (eth >= 1) {
    return eth.toFixed(1);  // 改为1位小数
  } else if (eth >= 0.1) {
    return eth.toFixed(1);  // 改为1位小数
  } else if (eth >= 0.01) {
    return eth.toFixed(2);  // 改为2位小数
  } else if (eth > 0) {
    return eth.toFixed(3);  // 改为3位小数
  } else {
    return '0';
  }
}

export function parseIntegerToWei(integerStr: string): bigint {
  const cleanStr = integerStr.replace(/,/g, '');
  return BigInt(cleanStr);
}

export function formatWeiForDisplay(wei: bigint, showDecimals: boolean = false): string {
  if (showDecimals) {
    const eth = weiToEth(wei);
    return eth.toFixed(3);
  }
  return formatWeiAsInteger(wei);
}