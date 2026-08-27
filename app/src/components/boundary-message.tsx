import Image from "next/image";

import { Spinner } from "@/components/ui/spinner";

export function BoundaryMessage({
  title,
  showSpinner = false,
}: {
  title: string;
  showSpinner?: boolean;
}) {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex items-center gap-6">
        <h1 className="text-2xl">{title}</h1>
        {showSpinner && <Spinner className="size-14" />}
        <div className="overflow-hidden rounded-2xl shadow-2xl shadow-black/30">
          <Image
            src="/atlas.jpg"
            alt="Atlas"
            width={300}
            height={200}
            className="h-auto w-[300px] object-cover"
          />
        </div>
      </div>
    </div>
  );
}
