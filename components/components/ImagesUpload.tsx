"use client";

import { ourFileRouter } from "@/app/api/uploadthing/core";
import { UploadButton } from "@/lib/uploadthing";

type Props = {
    endpoint: keyof typeof ourFileRouter
    onChange: (url?: string[]) => void
}

export default function ImageUploader({ endpoint, onChange }: Props) {
    return (
        <main className="flex items-center justify-center h-60 bg-muted rounded-md">
            <UploadButton
                endpoint={endpoint}
                onClientUploadComplete={(res) => {
                    onChange(res.map((item) => item.url) )
                }}
                onUploadError={(error: Error) => {
                    // Do something with the error.
                    alert(`ERROR! ${error.message}`);
                }}
            />
        </main>
    );
}