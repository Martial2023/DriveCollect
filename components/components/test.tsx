"use client";

import { useState } from "react";

export default function ImageUploader() {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);
    const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);

    // 📌 Gestion de la sélection des fichiers
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;

        const newFiles = Array.from(files);
        setSelectedFiles(newFiles);

        const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
        setPreviewUrls(newPreviews);
    };

    // 📌 Suppression d'une image avant upload
    const removeImage = (index: number) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
        setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    };

    // 📌 Soumission des images
    const handleSubmit = async () => {
        if (selectedFiles.length === 0) {
            alert("Veuillez sélectionner des images.");
            return;
        }

        setUploading(true);
        const formData = new FormData();
        selectedFiles.forEach((file) => formData.append("files", file));

        try {
            const response = await fetch("/api/test", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            if (data.success) {
                setUploadedUrls(data.urls);
                alert("Upload réussi !");
            } else {
                alert("Erreur lors de l'upload.");
            }
        } catch (error) {
            console.error("Erreur :", error);
            alert("Une erreur est survenue.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="p-4 border rounded-lg">
            <h2 className="text-xl font-bold mb-4">Uploader des images</h2>

            {/* Sélecteur d'images */}
            <input type="file" multiple accept="image/*" onChange={handleFileChange} className="mb-2" />

            {/* Prévisualisation des images */}
            <div className="flex gap-2 mt-2">
                {previewUrls.map((url, index) => (
                    <div key={index} className="relative">
                        <img src={url} alt="preview" className="w-24 h-24 object-cover rounded-md" />
                        <button
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                            onClick={() => removeImage(index)}
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>

            {/* Bouton d'upload */}
            <button
                onClick={handleSubmit}
                disabled={uploading}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
            >
                {uploading ? "Envoi en cours..." : "Envoyer les images"}
            </button>

            {/* URLs des images uploadées */}
            {uploadedUrls.length > 0 && (
                <div className="mt-4">
                    <h3 className="text-lg font-bold">Images Uploadées :</h3>
                    <ul>
                        {uploadedUrls.map((url, index) => (
                            <li key={index}>
                                <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                                    {url}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
