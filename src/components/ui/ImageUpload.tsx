"use client";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, Image as ImageIcon, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ImageUploadProps {
  onImageSelect: (base64: string) => void;
  label?: string;
}

export default function ImageUpload({ onImageSelect, label = "Upload Image" }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        setPreview(base64);
        onImageSelect(base64);
      };
      reader.readAsDataURL(file);
    },
    [onImageSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  });

  const clearImage = () => {
    setPreview(null);
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!preview ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              {...getRootProps()}
              className={`relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
                isDragActive
                  ? "border-[var(--color-accent-cyan)] bg-[rgba(0,212,255,0.05)]"
                  : "border-[var(--color-border-subtle)] hover:border-[var(--color-accent-cyan)] hover:bg-[rgba(0,212,255,0.02)]"
              }`}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center gap-4">
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${
                    isDragActive
                      ? "bg-[rgba(0,212,255,0.15)]"
                      : "bg-[rgba(0,212,255,0.08)]"
                  }`}
                >
                  <Upload className="w-8 h-8 text-[var(--color-accent-cyan)]" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-[var(--color-text-primary)]">
                    {isDragActive ? "Drop your image here" : label}
                  </p>
                  <p className="text-sm text-[var(--color-text-muted)] mt-1">
                    Drag & drop or click to browse • PNG, JPG, WebP up to 10MB
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative rounded-2xl overflow-hidden border border-[var(--color-border-subtle)]"
          >
            <img
              src={preview}
              alt="Preview"
              className="w-full h-64 object-cover"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearImage();
              }}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[rgba(0,0,0,0.7)] flex items-center justify-center hover:bg-[rgba(255,45,120,0.8)] transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
              <div className="flex items-center gap-2 text-sm text-white/80">
                <ImageIcon className="w-4 h-4" />
                <span>Image ready for analysis</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
