import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // Parse request body
  const body = await request.json();

  // Forward request to Python backend
  try {
    const backendRes = await fetch("http://localhost:3001/api/analyze-resume", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!backendRes.ok) {
      const errorText = await backendRes.text();
      return NextResponse.json({ error: errorText }, { status: backendRes.status });
    }

    const result = await backendRes.json();
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to connect to backend." }, { status: 500 });
  }
}
