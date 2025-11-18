import { NextResponse } from "next/server";

const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchQuoteWithRetry(retries = MAX_RETRIES): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

  try {
    const response = await fetch("https://zenquotes.io/api/random", {
      headers: {
        "User-Agent": "Dashboard App",
        "Accept": "application/json",
      },
      signal: controller.signal,
      next: { revalidate: 0 }, // Don't cache, always fetch fresh quote
    });

    clearTimeout(timeoutId);

    // If we get a 5xx error and have retries left, retry
    if (response.status >= 500 && response.status < 600 && retries > 0) {
      const delay = INITIAL_RETRY_DELAY * Math.pow(2, MAX_RETRIES - retries);
      console.warn(
        `ZenQuotes API returned ${response.status}, retrying in ${delay}ms... (${MAX_RETRIES - retries + 1}/${MAX_RETRIES})`
      );
      await sleep(delay);
      return fetchQuoteWithRetry(retries - 1);
    }

    if (!response.ok) {
      throw new Error(`ZenQuotes API returned ${response.status} ${response.statusText}`);
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
    
    // Retry on network errors or timeouts if we have retries left
    if (retries > 0 && (
      (error instanceof Error && error.name === 'AbortError') ||
      (error instanceof TypeError && error.message.includes('fetch'))
    )) {
      const delay = INITIAL_RETRY_DELAY * Math.pow(2, MAX_RETRIES - retries);
      console.warn(
        `Network error fetching quote, retrying in ${delay}ms... (${MAX_RETRIES - retries + 1}/${MAX_RETRIES})`,
        error
      );
      await sleep(delay);
      return fetchQuoteWithRetry(retries - 1);
    }
    
    // Log the error with more details
    console.error("Error fetching quote:", {
      error: error instanceof Error ? error.message : String(error),
      name: error instanceof Error ? error.name : 'Unknown',
      stack: error instanceof Error ? error.stack : undefined,
    });
    
    // Handle timeout specifically
    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json(
        { error: "Request timed out after multiple retries" },
        { status: 504 }
      );
    }
    
    // Return more informative error
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { 
        error: "Failed to fetch quote from ZenQuotes API",
        details: errorMessage 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return fetchQuoteWithRetry();
}

