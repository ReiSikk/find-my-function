import { useState, useEffect } from "react";
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'


// Helper function to generate system propmts for user selected nutrition stack type
function getSystemPrompt(stack: string) {
  switch (stack) {
    case "hydration":
      return "You are a hydration expert. Recommend hydration drinks and electrolyte products. Provide concise, evidence-based suggestions with purchase links if possible. Do not hallucinate or make up fake data. Output format should be concise and only include product name, brand, price and a link to purchase.";
    case "protein":
      return "You are a protein supplement expert. Recommend protein powders, shakes, and bars. Provide concise, evidence-based suggestions with purchase links if possible. Do not hallucinate or make up fake data. Output format should be concise and only include product name, brand, price and a link to purchase.";
    case "supplements":
      return "You are a supplement expert. Recommend vitamins, minerals, and performance supplements. Provide concise, evidence-based suggestions with purchase links if possible. Do not hallucinate or make up fake data. Output format should be concise and only include product name, brand, price and a link to purchase.";
    default:
      return "You are a helpful AI assistant for nutrition and fitness. Provide concise, evidence-based suggestions with purchase links if possible.";
  }
}

interface NutritionStackViewProps {
  stack: string;
  onSelectStack: (stack: string) => void;
}

export function NutritionStackView({ stack, onSelectStack }: NutritionStackViewProps) {
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
        body: JSON.stringify({ query: search, stack, systemPrompt: getSystemPrompt(stack) }),
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
    <div className="mt-8 md:mt-16">
      <div className="flex flex-col mb-16 max-w-full">
        <h2 className="h4 mb-2">I'm interested in creating a</h2>
        <div className="relative overflow-gradient">
          <div className="flex flex gap-2 overflow-x-auto scrollbar-hide">
            <div className={`btn-main ${stack === "hydration" && 'bg-(--color-primary) text-(--color-bg)'} hover:bg-(--color-primary) hover:text-(--color-bg) rounded-full`} onClick={() => onSelectStack("hydration")}>
              Hydration Stack
            </div>
            <div className={`btn-main ${stack === "protein" && 'bg-(--color-primary) text-(--color-bg)'} hover:bg-(--color-primary) hover:text-(--color-bg) rounded-full`} onClick={() => onSelectStack("protein")}>
              Protein Stack
            </div>
            <div className={`btn-main ${stack === "supplements" && 'bg-(--color-primary) text-(--color-bg)'} hover:bg-(--color-primary) hover:text-(--color-bg) rounded-full`} onClick={() => onSelectStack("supplements")}>
              Supplement Stack
            </div>
          </div>
        </div>
      </div>
      <h2 className="text-2xl font-bold mb-4">
        {stack.charAt(0).toUpperCase() + stack.slice(1)} Stack
      </h2>
      <p className="mb-4">Find the best {stack} products for your needs using our AI-powered search.</p>
      <input
        className="w-full p-2 border rounded mb-4 max-w-[500px]"
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