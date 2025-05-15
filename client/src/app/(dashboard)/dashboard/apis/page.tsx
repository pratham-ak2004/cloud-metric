import { type Metadata } from "next";
import APIList from "~/components/dashboard/apiAndServices/apiList";
import CreateApiKey from "~/components/dashboard/apiAndServices/createApiKey";
import SearchApiKey from "~/components/dashboard/apiAndServices/searchApiKey";

export const metadata: Metadata = {
  title: "API Management",
};

export default async function ApiManagementPage() {
  return (
    <section className="flex-1 overflow-auto px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">API Management</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage your API keys and monitor usage
          </p>
        </div>
        <CreateApiKey />
      </div>

      <div className="flex items-center mb-6 gap-4">
        <SearchApiKey />
      </div>

      <div>
        <APIList />
      </div>

      {/* <div className="bg-card rounded-lg border shadow-sm p-5 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <Key className="h-5 w-5" /> Active API Key
          </h2>
          <Button variant="outline" size="sm">
            Regenerate
          </Button>
        </div>

        <div className="flex items-center gap-2 bg-muted/50 p-3 rounded-md">
          <div className="bg-background border px-3 py-2 rounded flex-1 font-mono text-sm overflow-hidden text-ellipsis whitespace-nowrap">
            sk_live_JHd2hG8KzhIehrf7F9JDe03kDh7Gk5L9
          </div>
          <Button size="sm" variant="ghost">
            <Copy className="h-4 w-4" />
          </Button>
        </div>

        <p className="text-muted-foreground text-sm mt-2 flex items-center">
          <Lock className="h-3 w-3 mr-1" /> This key has full access to your
          account
        </p>
      </div> */}
    </section>
  );
}
