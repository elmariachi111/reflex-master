import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  try {
    console.log("test", request.body);
  
    response.status(200).json({
      body: "oh hai, this is a test",
    });
  } catch (error: unknown) {
    console.error(error);
    response.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
