import { put, list } from "@vercel/blob";

export const BLOB_KEY = "allowed-addresses.json";
export const DEFAULT_ADDRESS = "0x4f3285f64390263c02cb4326abfd1d73abc4e208";

/**
 * Generate a deployment-specific blob key based on VERCEL_URL
 * Falls back to default key for local development or when VERCEL_URL is not available
 */
function getDeploymentBlobKey(): string {
  const vercelUrl = process.env.VERCEL_URL;

  if (!vercelUrl) {
    // Local development or non-Vercel environment - use default key
    return BLOB_KEY;
  }

  // Create a normalized key from the Vercel URL
  // Remove protocol and replace dots/hyphens with underscores for valid blob key
  const normalizedUrl = vercelUrl
    .replace(/^https?:\/\//, "")
    .replace(/[.-]/g, "_");

  return `addresses_${normalizedUrl}.json`;
}

export interface AddressData {
  addresses: string[];
}

export async function getAddressesFromBlob(): Promise<string[]> {
  try {
    const blobKey = getDeploymentBlobKey();
    const { blobs } = await list({ prefix: blobKey });

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
  const blobKey = getDeploymentBlobKey();
  await put(blobKey, JSON.stringify(data), {
    access: "public",
    allowOverwrite: true,
  });
}

/**
 * Get the current deployment identifier for logging/debugging
 */
export function getDeploymentIdentifier(): string {
  const vercelUrl = process.env.VERCEL_URL;
  return vercelUrl || "local-development";
}

export function isValidEthereumAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}
