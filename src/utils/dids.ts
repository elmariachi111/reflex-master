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

export { toAddress, toEthrDid, truncateEthAddress, truncateString };
