import { withValidManifest } from "@coinbase/onchainkit/minikit";
import { minikitConfig } from "../../../minikit.config";
import { getAddressesFromBlob } from "../../../lib/address-utils";

export async function GET() {
  const allowedAddresses = await getAddressesFromBlob();

  const manifest = withValidManifest(minikitConfig);

  return Response.json({
    baseBuilder: {
      allowedAddresses,
    },
    accountAssociation: manifest.accountAssociation,
    miniapp: manifest.frame,
  });
}
