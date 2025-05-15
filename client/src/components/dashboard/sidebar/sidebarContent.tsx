import Logo from "~/components/logo/logo";
import { Separator } from "~/components/ui/separator";
import ApiAndServices from "./apiAndServices";

export function SideBarContent() {
  return (
    <section className="h-screen bg-accent w-72 flex-shrink-0 px-4">
      <div className="mt-6 flex flex-nowrap w-full items-center justify-between">
        {/* Large logo for open sidebar */}
        <div className="w-full flex items-center justify-center">
          <Logo className="h-10 w-full mx-auto" />
        </div>
      </div>
      <Separator className="bg-foreground opacity-50 mt-6" />
      <div className="mt-6">
        <header className="opacity-50 text-lg">API & Services</header>
        <ApiAndServices />
      </div>
    </section>
  );
}
