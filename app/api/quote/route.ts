import { NextResponse } from "next/server";

export async function GET() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout (shorter than client timeout)

  try {
    const response = await fetch("https://zenquotes.io/api/random", {
      headers: {
        "User-Agent": "Dashboard App",
      },
      signal: controller.signal,
      next: { revalidate: 0 }, // Don't cache, always fetch fresh quote
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`ZenQuotes API returned ${response.status}`);
    }

    const data = await response.json();
    
    // Validate response structure
    if (!Array.isArray(data) || data.length === 0 || !data[0]?.q) {
      throw new Error("Invalid response format from ZenQuotes API");
    }
    
    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
      },
    });
  } catch (error) {
    clearTimeout(timeoutId);
    
    console.error("Error fetching quote:", error);
    
    // Handle timeout specifically
    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json(
        { error: "Request timed out" },
        { status: 504 }
      );
    }
    
    return NextResponse.json(
      { error: "Oh, failed to fetch quote" },
      { status: 500 }
    );
  }
}

