import { Address } from "@ton/core";

export function friendlyAddressToRaw(friendlyAddress: string) {
    const address = Address.parseFriendly(friendlyAddress).address;

    const hashPart = address.hash.toString("hex");

    return `${address.workChain}:${hashPart}`;
}
