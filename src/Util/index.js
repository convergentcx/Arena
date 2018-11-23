import bs58 from 'base58';

export const getBytes32FromMultihash = (mhash) => {
  const decoded = bs58.decode(mhash);

  return {
    digest: `0x${decoded.slice(2).toString('hex')}`,
    hashFunction: decoded[0],
    size: decoded[1],
  };
}

export const getMultihashFromBytes32 = (mhashObj) => {
  const { digest, hashFunction, size } = mhashObj;
  if (size === 0) return null;

  const hashBytes = Buffer.from(digest.slice(2), 'hex');

  const multihashBytes = new (hashBytes.constructor)(2 + hashBytes.length);
  multihashBytes[0] = hashFunction;
  multihashBytes[1] = size;
  multihashBytes.set(hashBytes, 2);
  return bs58.encode(multihashBytes);
}
