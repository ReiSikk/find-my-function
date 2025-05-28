import { useState, useEffect } from "react";
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export function NutritionStackView({ stack }: { stack: string }) {
  // AI search functionality 
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  // Clear previous results when search changes
    useEffect(() => {
    if (search === "") {
      setResults(null);
      setError(null);
      setLoading(false);
      return;
    }
    setResults(null); 
    setError(null);
  }, [search, stack]);

  useEffect(() => {
    if (search.length < 3) return; // avoid too short queries

    const delay = setTimeout(() => {
      setLoading(true);
      fetch("/api/ai-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: search, stack }),
      })
        .then(res => res.json())
        .then(data => {
          if (!data.reply) {
            setError("No results found. Rate limit for AI search exceeded. Please try again later.");
            setLoading(false);
            return;
          } else {
            setResults(data.reply);
            setLoading(false);
            setError(null);
          }
        })
        .catch(() => {
          setResults("Sorry, something went wrong.");
          setLoading(false);
        });
    }, 800); // debounce input

    return () => clearTimeout(delay);
  }, [search, stack]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">
        {stack.charAt(0).toUpperCase() + stack.slice(1)} Stack
      </h2>
      <p className="mb-4">Find the best {stack} products for your needs using our AI-powered search.</p>
      <input
        className="w-full p-2 border rounded mb-4"
        placeholder={`Search for ${stack} products...`}
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <div>
          <div className="text-(--fs-p)">
          {loading && "Searching..."}
          {error && (
            <div className="text-red-600 font-semibold mb-4">{error}</div>
          )}
          {!loading && !error && results && (
            <Markdown 
              remarkPlugins={[remarkGfm]}
              components={{
                ul: ({ children }) => <ul className="list-disc pl-5 bg-(--color-primary) text-(--color-bg) p-6 rounded-md">{children}</ul>,
                li: ({ children }) => <li className="mb-2">{children}</li>,
                a: ({ children, href }) => <a href={href} className="underline underline-offset-3 hover:text-blue-500" target="_blank" rel="noopener noreferrer">{children}</a>,
                p: ({ children }) => <p className="mb-4">{children}</p>,
              }}
            >
              {results}
            </Markdown>
          )}
          {!loading && !error && !results && "Start typing to see results."}
      </div>
      </div>
    </div>
  );
}