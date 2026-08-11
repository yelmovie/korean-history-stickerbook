/** 문제 데이터는 "정답 순서"로 적어 두는 게 읽기 쉬우므로, 화면에 뿌릴 때만 섞는다.
 *  씨앗(문제 id)이 같으면 항상 같은 결과라 새로고침해도 배열이 흔들리지 않는다. */
function seeded(seed: string): () => number {
  let h = 2166136261
  for (let i = 0; i < seed.length; i += 1) h = Math.imul(h ^ seed.charCodeAt(i), 16777619)
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507)
    h ^= h >>> 13
    return (h >>> 0) / 4294967296
  }
}

export function seededShuffle<T>(items: T[], seed: string): T[] {
  const rand = seeded(seed)
  const out = [...items]
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

/** 한 칸도 제자리에 남지 않도록 섞는다.
 *  선잇기가 一자 3줄이 되거나 순서 카드가 1·2·3·4 그대로 놓이는 걸 막는 용도. */
export function derange<T>(items: T[], seed: string): T[] {
  if (items.length < 2) return items
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const out = seededShuffle(items, `${seed}#${attempt}`)
    if (out.every((v, i) => v !== items[i])) return out
  }
  // 길이가 2 이상이면 회전에는 제자리가 하나도 없다
  return items.map((_, i) => items[(i + 1) % items.length])
}
