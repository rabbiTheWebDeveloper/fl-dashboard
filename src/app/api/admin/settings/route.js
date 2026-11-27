import { GET as getHandler, PATCH as patchHandler, PUT as putHandler } from "../setting/route";

export const dynamic = "force-dynamic";

export const GET = getHandler;
export const PUT = putHandler;
export const PATCH = patchHandler;
