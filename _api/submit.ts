import type { VercelRequest, VercelResponse } from "@vercel/node";

const WELSHARE_WALLET_API_TOKEN = process.env.VITE_WELSHARE_WALLET_API_TOKEN;
const WELSHARE_UPLOAD_DATA_API_URL = `${process.env.VITE_HEALTH_WALLET_BASE_URL}/api/submission/reflex`;

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  try {
    const result = await fetch(WELSHARE_UPLOAD_DATA_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${WELSHARE_WALLET_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request.body),
    });

    response.status(200).json({
      body: result,
    });
  } catch (error: unknown) {
    console.error(error);
    response.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
