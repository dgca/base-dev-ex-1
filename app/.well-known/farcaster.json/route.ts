import { withValidManifest } from "@coinbase/onchainkit/minikit";
import { minikitConfig } from "../../../minikit.config";
import { getAddressesFromBlob } from "../../../lib/address-utils";

export async function GET() {
  const allowedAddresses = await getAddressesFromBlob();

  return Response.json({
    baseBuilder: {
      allowedAddresses,
    },
    ...withValidManifest(minikitConfig),
  });
}
