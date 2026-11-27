import { handleRefreshTokenHttpRequest } from "@/queries/authTokens";

export const dynamic = "force-dynamic";

export async function POST(request) {
  return handleRefreshTokenHttpRequest(request);
}
