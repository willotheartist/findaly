// app/search/page.tsx
import SearchClient from "./SearchClient";

type PageProps = {
  searchParams?: {
    q?: string;
  };
};

export default function SearchPage(_props: PageProps) {
  return <SearchClient />;
}