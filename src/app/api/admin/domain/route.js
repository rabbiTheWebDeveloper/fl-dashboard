import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { verifyAdminApiRequest } from "@/lib/adminAuth";
import {
  deleteAdminDomainQuery,
  getAdminDomainsQuery,
  upsertAdminDomainQuery,
  verifyAdminDomainDnsQuery,
} from "@/queries/admin";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const auth = await verifyAdminApiRequest(request);
  if (!auth.ok) {
    return NextResponse.json(
      { status: auth.status, success: false, message: auth.message },
      { status: auth.status }
    );
  }

  try {
    const data = await getAdminDomainsQuery();
    return NextResponse.json(
      { status: 200, success: true, data },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: 500,
        success: false,
        message: error?.message || "Failed to fetch custom domains.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const auth = await verifyAdminApiRequest(request);
  if (!auth.ok) {
    return NextResponse.json(
      { status: auth.status, success: false, message: auth.message },
      { status: auth.status }
    );
  }

  try {
    const body = await request.json();

    // Live DNS verification lookup
    if (body?.action === "check_dns") {
      if (!body?.domainId) {
        return NextResponse.json(
          { status: 400, success: false, message: "domainId is required." },
          { status: 400 }
        );
      }
      const dnsReport = await verifyAdminDomainDnsQuery(body.domainId);
      return NextResponse.json(
        { status: 200, success: true, data: dnsReport },
        { status: 200 }
      );
    }

    const created = await upsertAdminDomainQuery(body);
    revalidatePath("/admin/domain");
    revalidatePath("/admin/shops");

    return NextResponse.json(
      {
        status: 201,
        success: true,
        message: `Custom domain "${created.domain_name}" saved (${created.domain_status}).`,
        data: created,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: 400,
        success: false,
        message: error?.message || "Failed to save custom domain.",
      },
      { status: 400 }
    );
  }
}

export async function PATCH(request) {
  const auth = await verifyAdminApiRequest(request);
  if (!auth.ok) {
    return NextResponse.json(
      { status: auth.status, success: false, message: auth.message },
      { status: auth.status }
    );
  }

  try {
    const body = await request.json();
    if (!body?.domainId) {
      return NextResponse.json(
        { status: 400, success: false, message: "domainId is required." },
        { status: 400 }
      );
    }

    const updated = await upsertAdminDomainQuery(body);
    revalidatePath("/admin/domain");
    revalidatePath("/admin/shops");

    return NextResponse.json(
      {
        status: 200,
        success: true,
        message: `Domain "${updated.domain_name}" marked ${updated.domain_status}.`,
        data: updated,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: 400,
        success: false,
        message: error?.message || "Failed to update domain.",
      },
      { status: 400 }
    );
  }
}

export async function DELETE(request) {
  const auth = await verifyAdminApiRequest(request, {
    requireManageUsers: true,
  });
  if (!auth.ok) {
    return NextResponse.json(
      { status: auth.status, success: false, message: auth.message },
      { status: auth.status }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { status: 400, success: false, message: "Domain id is required." },
        { status: 400 }
      );
    }

    const res = await deleteAdminDomainQuery(id);
    revalidatePath("/admin/domain");
    revalidatePath("/admin/shops");

    return NextResponse.json(
      {
        status: 200,
        success: true,
        message: "Custom domain removed.",
        data: res,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: 400,
        success: false,
        message: error?.message || "Failed to delete domain.",
      },
      { status: 400 }
    );
  }
}
