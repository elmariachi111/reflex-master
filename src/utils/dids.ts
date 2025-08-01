const toEthrDid = (address: string, chainId?: number) => {
  return `did:ethr:${chainId ? `${chainId}:` : ""}${address.toLowerCase()}`;
};

const toAddress = (did: string) => {
  return did.split(":").at(-1) || "";
};

const truncateString = (str: string, front = 4, back = 6) => {
  return `${str.substring(0, front)}…${str.substring(str.length - back)}`;
};

const truncateEthAddress = (address: string, front = 4, back = 6) => {
  return truncateString(address, 2 + front, back);
};

const truncateDid = (did: string, front = 4, back = 6) => {
  const parts = did.split(":")
  if (parts.length != 3) return did;

  return parts[0] + ":" + parts[1] + ":" + truncateString(parts[2] || "", front, back)
}

export { toAddress, toEthrDid, truncateDid, truncateEthAddress, truncateString };

