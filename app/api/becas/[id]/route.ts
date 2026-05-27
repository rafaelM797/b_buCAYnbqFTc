import { NextRequest, NextResponse } from "next/server"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
const API_PATH = `${API_BASE}/api/becas`

async function proxy(request: NextRequest, target: string) {
  const url = `${target}${request.nextUrl.search}`
  const res = await fetch(url, {
    method: request.method,
    headers: {
      "Content-Type": request.headers.get("content-type") || "application/json",
    },
    body: ["GET", "HEAD"].includes(request.method) ? undefined : await request.text(),
  })

  const body = await res.text()
  return new NextResponse(body, {
    status: res.status,
    headers: { "content-type": res.headers.get("content-type") || "application/json" },
  })
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  return proxy(request, `${API_PATH}/${id}`)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  return proxy(request, `${API_PATH}/${id}`)
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  return proxy(request, `${API_PATH}/${id}`)
}
