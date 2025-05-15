import { Plus } from "lucide-react";
import React from "react";
import { Button } from "~/components/ui/button";

export default function CreateApiKey() {
  return (
    <Button>
      <Plus className="mr-2 h-4 w-4" /> Create New API Key
    </Button>
  );
}
