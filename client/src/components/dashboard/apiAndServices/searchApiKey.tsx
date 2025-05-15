import { Search } from "lucide-react";
import React from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

export default function SearchApiKey() {
  return (
    <>
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search APIs..."
          className="pl-9 w-full"
        />
      </div>
      <Button variant="outline">Filter</Button>
    </>
  );
}
