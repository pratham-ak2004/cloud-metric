import { getServerSession } from "~/server/auth";

const apis = [
  {
    id: "api_1",
    name: "Prediction API",
    status: "Active",
    requests: 1247,
    lastUsed: "2 hours ago",
  },
  {
    id: "api_2",
    name: "Training Data API",
    status: "Active",
    requests: 842,
    lastUsed: "5 hours ago",
  },
  {
    id: "api_3",
    name: "Model Evaluation API",
    status: "Inactive",
    requests: 0,
    lastUsed: "3 days ago",
  },
];

export default async function APIList() {
  const user = await getServerSession();

  if (user.status === "authenticated") {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {apis.map((api) => (
          <div
            key={api.id}
            className="bg-card rounded-lg border p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-lg">{api.name}</h3>
              <span
                className={`px-2 py-0.5 text-xs rounded-full ${
                  api.status === "Active"
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                }`}
              >
                {api.status}
              </span>
            </div>

            <div className="flex gap-8 my-4">
              <div>
                <p className="text-muted-foreground text-sm">Total Requests</p>
                <p className="font-medium">{api.requests.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Last Used</p>
                <p className="font-medium">{api.lastUsed}</p>
              </div>
            </div>

            <div className="flex justify-between mt-4">
              {/* <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4 mr-1" /> View Logs
          </Button>
          <Button variant="outline" size="sm">
            Documentation <ArrowRight className="h-3 w-3 ml-1" />
          </Button> */}
            </div>
          </div>
        ))}
      </div>
    );
  }
}
