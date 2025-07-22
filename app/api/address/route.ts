import { NextRequest, NextResponse } from "next/server";
import {
  getAddressesFromBlob,
  saveAddressesToBlob,
  isValidEthereumAddress,
  DEFAULT_ADDRESS,
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
  try {
    const addresses = await getAddressesFromBlob();
    return NextResponse.json({ addresses });
  } catch (error) {
    console.error("Error in GET /api/address:", error);
    return NextResponse.json(
      { error: "Failed to fetch addresses" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  // Validate API key
  if (!validateApiKey(request)) {
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
      return NextResponse.json(
        { error: "Address already exists" },
        { status: 409 }
      );
    }

    const updatedAddresses = [...currentAddresses, address];
    await saveAddressesToBlob(updatedAddresses);

    return NextResponse.json({
      message: "Address added successfully",
      addresses: updatedAddresses,
    });
  } catch (error) {
    console.error("Error in POST /api/address:", error);
    return NextResponse.json(
      { error: "Failed to add address" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  // Validate API key
  if (!validateApiKey(request)) {
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
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    const updatedAddresses = currentAddresses.filter(
      (addr: string) => addr !== address
    );

    // If removing all addresses, keep the default address
    const finalAddresses =
      updatedAddresses.length === 0 ? [DEFAULT_ADDRESS] : updatedAddresses;

    await saveAddressesToBlob(finalAddresses);

    return NextResponse.json({
      message: "Address removed successfully",
      addresses: finalAddresses,
    });
  } catch (error) {
    console.error("Error in DELETE /api/address:", error);
    return NextResponse.json(
      { error: "Failed to remove address" },
      { status: 500 }
    );
  }
}
