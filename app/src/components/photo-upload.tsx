"use client";

import { useRef, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export default function PhotoUpload() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "done" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState("");

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setStatus("uploading");

    const path = `${Date.now()}-${file.name}`;
    const { error } = await supabase.storage
      .from("photos")
      .upload(path, file);

    setErrorMessage(error?.message ?? "");
    setStatus(error ? "error" : "done");
    event.target.value = "";
  }

  return (
    <div className="flex flex-col gap-2">
      <Button onClick={() => inputRef.current?.click()}>
        Upload a photo
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
      {status === "uploading" && (
        <p className="text-sm text-muted-foreground">Uploading...</p>
      )}
      {status === "done" && (
        <p className="text-sm text-muted-foreground">Uploaded!</p>
      )}
      {status === "error" && (
        <p className="text-sm text-destructive">
          Upload failed{errorMessage ? `: ${errorMessage}` : ""}
        </p>
      )}
    </div>
  );
}
