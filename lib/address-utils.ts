import { put, list } from "@vercel/blob";

export const BLOB_KEY = "allowed-addresses.json";
export const DEFAULT_ADDRESS = "0x4f3285f64390263c02cb4326abfd1d73abc4e208";

export interface AddressData {
  addresses: string[];
}

export async function getAddressesFromBlob(): Promise<string[]> {
  try {
    const { blobs } = await list({ prefix: BLOB_KEY });

    if (blobs.length === 0) {
      return [DEFAULT_ADDRESS];
    }

    const response = await fetch(blobs[0].url);
    const data: AddressData = await response.json();

    return data.addresses.length > 0 ? data.addresses : [DEFAULT_ADDRESS];
  } catch (error) {
    console.error("Error fetching addresses from blob:", error);
    return [DEFAULT_ADDRESS];
  }
}

export async function saveAddressesToBlob(addresses: string[]): Promise<void> {
  const data: AddressData = { addresses };
  await put(BLOB_KEY, JSON.stringify(data), {
    access: "public",
    allowOverwrite: true,
  });
}

export function isValidEthereumAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}
