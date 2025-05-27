import { useState, useEffect } from "react";

export function NutritionStackView({ stack }: { stack: string }) {
  // AI search functionality 
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
          setResults(data.reply);
          setLoading(false);
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
      {/* Render AI search results here */}
      <div>
        {/* Example: <AiProductResults query={search} stack={stack} /> */}
          <div className="text-sm text-muted-foreground">
        {loading ? "Searching..." : results || "AI-powered product links will appear here."}
      </div>
      </div>
    </div>
  );
}