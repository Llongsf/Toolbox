// Hash utilities: MD5 (pure JS, RFC 1321) + SHA-1/256/384/512 (Web Crypto).
// MD5 implementation verified against Node crypto for ASCII + UTF-8 inputs.

function safeAdd(x: number, y: number): number {
  const lsw = (x & 0xffff) + (y & 0xffff);
  const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xffff);
}

function bitRol(num: number, cnt: number): number {
  return (num << cnt) | (num >>> (32 - cnt));
}

function binlMD5(x: number[], len: number): number[] {
  /* append padding */
  x[len >> 5] |= 0x80 << (len % 32);
  x[(((len + 64) >>> 9) << 4) + 14] = len;

  let a = 1732584193;
  let b = -271733879;
  let c = -1732584194;
  let d = 271733878;

  const T: number[] = [
    -680876936, -389564586, 606105819, -1044525330, -176418897, 1200080426,
    -1473231341, -45705983, 1770035416, -1958414417, -42063, -1990404162,
    1804603682, -40341101, -1502002290, 1236535329, -165796510, -1069501632,
    643717713, -373897302, -701558691, 38016083, -660478335, -405537848,
    568446438, -1019803690, -187363961, 1163531501, -1444681467, -51403784,
    1735328473, -1926607734, -378558, -2022574463, 1839030562, -35309556,
    -1530992060, 1272893353, -155497632, -1094730640, 681279174, -358537222,
    -722521979, 76029189, -640364487, -421815835, 530742520, -995338651,
    -198630844, 1126891415, -1416354905, -57434055, 1700485571, -1894986606,
    -1051523, -2054922799, 1873313359, -30611744, -1560198380, 1309151649,
    -145523070, -1120210379, 718787259, -343485551,
  ];
  const S: number[] = [
    7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
    5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
    4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
    6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21,
  ];
  // message word index for each of the 64 steps
  const Kidx: number[] = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
    1, 6, 11, 0, 5, 10, 15, 4, 9, 14, 3, 8, 13, 2, 7, 12,
    5, 8, 11, 14, 1, 4, 7, 10, 13, 0, 3, 6, 9, 12, 15, 2,
    0, 7, 14, 5, 12, 3, 10, 1, 8, 15, 6, 13, 4, 11, 2, 9,
  ];
  // MD5 updates variables in the cyclic order a, d, c, b
  const targetOrder = [0, 3, 2, 1];

  for (let bs = 0; bs < x.length; bs += 16) {
    const olda = a, oldb = b, oldc = c, oldd = d;
    const v: number[] = [a, b, c, d];
    for (let j = 0; j < 64; j++) {
      const tgt = targetOrder[j % 4];
      const p = (tgt + 1) % 4;
      const q = (tgt + 2) % 4;
      const r = (tgt + 3) % 4;
      const round = j >> 4;
      let f: number;
      if (round === 0) f = (v[p] & v[q]) | (~v[p] & v[r]);
      else if (round === 1) f = (v[p] & v[r]) | (v[q] & ~v[r]);
      else if (round === 2) f = v[p] ^ v[q] ^ v[r];
      else f = v[q] ^ (v[p] | ~v[r]);
      v[tgt] = safeAdd(
        bitRol(safeAdd(safeAdd(safeAdd(v[tgt], f), x[bs + Kidx[j]]), T[j]), S[j]),
        v[p]
      );
    }
    a = safeAdd(v[0], olda);
    b = safeAdd(v[1], oldb);
    c = safeAdd(v[2], oldc);
    d = safeAdd(v[3], oldd);
  }
  return [a, b, c, d];
}

function binl2hex(binarray: number[]): string {
  const hexTab = "0123456789abcdef";
  let str = "";
  for (let i = 0; i < binarray.length * 4; i++) {
    str +=
      hexTab.charAt((binarray[i >> 2] >> ((i % 4) * 8 + 4)) & 0xf) +
      hexTab.charAt((binarray[i >> 2] >> ((i % 4) * 8)) & 0xf);
  }
  return str;
}

function str2binl(str: string): number[] {
  const bin: number[] = [];
  const mask = (1 << 8) - 1;
  for (let i = 0; i < str.length * 8; i += 8) {
    bin[i >> 5] |= (str.charCodeAt(i / 8) & mask) << (i % 32);
  }
  return bin;
}

function utf8ToBinaryString(input: string): string {
  return encodeURIComponent(input).replace(/%([0-9A-F]{2})/g, (_, p1) =>
    String.fromCharCode(parseInt(p1, 16))
  );
}

export function md5(input: string): string {
  const utf8 = utf8ToBinaryString(input);
  return binl2hex(binlMD5(str2binl(utf8), utf8.length * 8));
}

export type ShaAlgorithm = "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512";

export async function shaHash(
  algorithm: ShaAlgorithm,
  input: string
): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export const hashAlgorithms = [
  "MD5",
  "SHA-1",
  "SHA-256",
  "SHA-384",
  "SHA-512",
] as const;

export async function calculateHash(
  algorithm: string,
  input: string
): Promise<string> {
  if (algorithm === "MD5") return md5(input);
  return shaHash(algorithm as ShaAlgorithm, input);
}
