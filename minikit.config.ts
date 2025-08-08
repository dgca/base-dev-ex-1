const ROOT_URL = process.env.NEXT_PUBLIC_URL || process.env.VERCEL_URL || "";

/**
 * MiniApp configuration object. Must follow the Farcaster MiniApp specification.
 *
 * @see {@link https://miniapps.farcaster.xyz/docs/guides/publishing}
 */
export const minikitConfig = {
  accountAssociation: {
    header:
      "eyJmaWQiOjYxNjIsInR5cGUiOiJhdXRoIiwia2V5IjoiMHg1MmE0NTdCZGU1NGZERWFGNzIxOTlBQTZhNjJENUMwMjdiQzhDYmQ4In0",
    payload:
      "eyJkb21haW4iOiJiYXNlLWRldi1leC0xLWdpdC11YXQtMTItdHlwZW9mLXByb2plY3Qtdmlldy52ZXJjZWwuYXBwIn0",
    signature:
      "pIhCYwwAuQL7gmc06G6rBHFfS2xewlmy9EU67YGCPRdmpao1XTSrJA+KUbe9fXVL8TVx2WobbOobRduPH6C1HRw=",
  },
  frame: {
    version: "1",
    name: "base-dev-ex-1",
    subtitle: "",
    description: "",
    screenshotUrls: [],
    iconUrl: `${ROOT_URL}/icon.png`,
    splashImageUrl: `${ROOT_URL}/splash.png`,
    splashBackgroundColor: "#000000",
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: "utility",
    tags: [],
    heroImageUrl: `${ROOT_URL}/hero.png`,
    tagline: "",
    ogTitle: "",
    ogDescription: "",
    ogImageUrl: `${ROOT_URL}/hero.png`,
  },
} as const;
