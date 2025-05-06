"use client";
import SearchInput from "@/components/search-input";
import { parseAsString, useQueryState } from "nuqs";

export default function SearchClient() {
  const [query, setQuery] = useQueryState(
    "q",
    parseAsString.withOptions({ clearOnDefault: true }).withDefault("")
  );

  return (
    <SearchInput
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search..."
      className="w-[600px]"
      value={query}
    />
  );
}
