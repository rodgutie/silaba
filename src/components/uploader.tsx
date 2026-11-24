"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

/**
 * Uploads a file straight from the browser to Supabase Storage (no size limit from
 * the server), then puts the stored path/URL into a hidden input of the parent form.
 */
export default function Uploader({
  bucket,
  userId,
  name,
  accept,
  maxMb,
  label,
  returnPublicUrl = false,
  prefix = "",
}: {
  bucket: "media" | "documents";
  userId: string;
  name: string;
  accept: string;
  maxMb: number;
  label: string;
  returnPublicUrl?: boolean;
  prefix?: string;
}) {
  const [value, setValue] = useState("");
  const [state, setState] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");
  const input = useRef<HTMLInputElement>(null);

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > maxMb * 1024 * 1024) {
      setState("error");
      setMessage(`El archivo pesa más de ${maxMb} MB.`);
      return;
    }
    setState("uploading");
    const safe = file.name.normalize("NFD").replace(/[^\w.-]+/g, "-").slice(-80);
    const path = `${userId}/${prefix}${Date.now()}-${safe}`;
    const supabase = createClient();
    const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: false, contentType: file.type });
    if (error) {
      setState("error");
      setMessage("No se pudo subir el archivo. Intenta de nuevo.");
      return;
    }
    setValue(returnPublicUrl ? supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl : path);
    setState("done");
    setMessage(file.name);
  }

  const id = `up-${name}`;
  return (
    <div>
      <label htmlFor={id} className="label">{label}</label>
      <input ref={input} id={id} type="file" accept={accept} onChange={onChange} className="block w-full text-sm" />
      <input type="hidden" name={name} value={value} />
      {state === "uploading" && <p className="mb-0 mt-1 text-sm text-muted">Subiendo…</p>}
      {state === "done" && <p className="mb-0 mt-1 text-sm text-success">✓ Listo: {message}</p>}
      {state === "error" && <p role="alert" className="mb-0 mt-1 text-sm text-warn">{message}</p>}
    </div>
  );
}
