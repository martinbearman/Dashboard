"use client";

import { useState, useEffect } from "react";
import { ModuleProps } from "@/lib/types/dashboard";

interface Quote {
  q: string;
  a: string;
  h: string;
}

export default function QuoteDisplay({ moduleId, config }: ModuleProps) {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuote = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch("/api/quote");
      
      if (!response.ok) {
        throw new Error("Failed to fetch quote");
      }
      
      const data: Quote[] = await response.json();
      
      if (data && data.length > 0) {
        setQuote(data[0]);
      } else {
        throw new Error("No quote received");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load quote");
      console.error("Error fetching quote:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  const getWikipediaUrl = (author: string): string => {
    // Convert author name to Wikipedia URL format
    // Replace spaces with underscores and encode the URL
    const wikiTitle = author.trim().replace(/\s+/g, "_");
    return `https://en.wikipedia.org/wiki/${encodeURIComponent(wikiTitle)}`;
  };

  return (
    <div className="h-full w-full p-4 flex flex-col justify-between rounded-lg">
      {loading && (
        <div className="flex items-center justify-center h-full">
          <div className="text-red-600 animate-pulse">Loading quote...</div>
        </div>
      )}

      {error && (
        <div className="flex flex-col items-center justify-center h-full gap-4">
          <div className="text-red-600 text-sm">{error}</div>
          <button
            onClick={fetchQuote}
            className="px-4 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {quote && !loading && (
        <>
          <div className="flex-1 flex flex-col justify-center">
            <blockquote className="text-xl md:text-3xl font-medium text-gray-800 mb-4 italic">
              &ldquo;{quote.q}&rdquo;
            </blockquote>
            <footer className="text-lg md:text-xl text-red-600 font-semibold">
              —{" "}
              <a
                href={getWikipediaUrl(quote.a)}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-red-700 hover:underline transition-colors"
              >
                {quote.a}
              </a>
            </footer>
          </div>
          
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-300">
            <button
              onClick={fetchQuote}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm"
              disabled={loading}
            >
              {loading ? "Loading..." : "New Quote"}
            </button>
            
            <a
              href="https://zenquotes.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-red-600 hover:text-red-700 transition-colors"
            >
              via ZenQuotes
            </a>
          </div>
        </>
      )}
    </div>
  );
}

