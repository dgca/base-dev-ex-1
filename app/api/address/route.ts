import { NextRequest, NextResponse } from "next/server";
import {
  getAddressesFromBlob,
  saveAddressesToBlob,
  isValidEthereumAddress,
  getDeploymentIdentifier,
} from "../../../lib/address-utils";

function validateApiKey(request: NextRequest): boolean {
  const apiKey = request.headers.get("x-api-key");
  const expectedApiKey = process.env.API_KEY;

  if (!expectedApiKey) {
    console.warn("API_KEY environment variable is not set");
    return false;
  }

  return apiKey === expectedApiKey;
}

export async function GET() {
  const deployment = getDeploymentIdentifier();
  console.log(`[${deployment}] GET /api/address - Fetching addresses`);

  try {
    const addresses = await getAddressesFromBlob();
    console.log(`[${deployment}] Found ${addresses.length} addresses`);
    return NextResponse.json({ addresses, deployment });
  } catch (error) {
    console.error(`[${deployment}] Error in GET /api/address:`, error);
    return NextResponse.json(
      { error: "Failed to fetch addresses" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const deployment = getDeploymentIdentifier();
  console.log(`[${deployment}] POST /api/address - Adding new address`);

  // Validate API key
  if (!validateApiKey(request)) {
    console.log(
      `[${deployment}] Unauthorized request - missing/invalid API key`
    );
    return NextResponse.json(
      { error: "Unauthorized - Invalid or missing x-api-key header" },
      { status: 401 }
    );
  }

  try {
    const { address } = await request.json();

    if (!address || typeof address !== "string") {
      return NextResponse.json(
        { error: "Address is required and must be a string" },
        { status: 400 }
      );
    }

    // Basic validation for Ethereum address format
    if (!isValidEthereumAddress(address)) {
      return NextResponse.json(
        { error: "Invalid Ethereum address format" },
        { status: 400 }
      );
    }

    const currentAddresses = await getAddressesFromBlob();

    if (currentAddresses.includes(address)) {
      console.log(`[${deployment}] Address ${address} already exists`);
      return NextResponse.json(
        { error: "Address already exists" },
        { status: 409 }
      );
    }

    const updatedAddresses = [...currentAddresses, address];
    await saveAddressesToBlob(updatedAddresses);
    console.log(
      `[${deployment}] Address ${address} added successfully. Total addresses: ${updatedAddresses.length}`
    );

    return NextResponse.json({
      message: "Address added successfully",
      addresses: updatedAddresses,
      deployment,
    });
  } catch (error) {
    console.error(`[${deployment}] Error in POST /api/address:`, error);
    return NextResponse.json(
      { error: "Failed to add address" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const deployment = getDeploymentIdentifier();
  console.log(`[${deployment}] DELETE /api/address - Removing address`);

  // Validate API key
  if (!validateApiKey(request)) {
    console.log(
      `[${deployment}] Unauthorized request - missing/invalid API key`
    );
    return NextResponse.json(
      { error: "Unauthorized - Invalid or missing x-api-key header" },
      { status: 401 }
    );
  }

  try {
    const { address } = await request.json();

    if (!address || typeof address !== "string") {
      return NextResponse.json(
        { error: "Address is required and must be a string" },
        { status: 400 }
      );
    }

    const currentAddresses = await getAddressesFromBlob();

    if (!currentAddresses.includes(address)) {
      console.log(`[${deployment}] Address ${address} not found`);
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    const updatedAddresses = currentAddresses.filter(
      (addr: string) => addr !== address
    );

    await saveAddressesToBlob(updatedAddresses);
    console.log(
      `[${deployment}] Address ${address} removed successfully. Total addresses: ${updatedAddresses.length}`
    );

    return NextResponse.json({
      message: "Address removed successfully",
      addresses: updatedAddresses,
      deployment,
    });
  } catch (error) {
    console.error(`[${deployment}] Error in DELETE /api/address:`, error);
    return NextResponse.json(
      { error: "Failed to remove address" },
      { status: 500 }
    );
  }
}
