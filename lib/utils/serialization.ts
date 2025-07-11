/**
 * 安全地序列化包含BigInt的对象
 * @param obj 要序列化的对象
 * @returns JSON字符串
 */
export function safeStringify(obj: any): string {
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === 'bigint') {
      return value.toString();
    }
    return value;
  });
}

/**
 * 创建一个BigInt安全的响应
 * @param data 响应数据
 * @param options 响应选项
 * @returns Response对象
 */
export function createBigIntSafeResponse(data: any, options?: ResponseInit): Response {
  const body = safeStringify(data);
  return new Response(body, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
  });
}