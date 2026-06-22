import { useState, useRef } from "react";
import toast from "react-hot-toast";
import { uploadToImgbb } from "../../utils/imgbbUpload.js";

const ImageUploader = ({ images = [], onChange, maxImages = 5 }) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const remaining = maxImages - images.length;

  const handleFiles = async (files) => {
    const validFiles = [];

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        toast.error(`"${file.name}" is not an image`);
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`"${file.name}" exceeds 5 MB`);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;
    if (validFiles.length > remaining) {
      toast.error(`You can upload ${remaining} more image(s)`);
      return;
    }

    setUploading(true);
    try {
      const urls = await Promise.all(validFiles.map(uploadToImgbb));
      onChange([...images, ...urls]);
      toast.success(
        `${urls.length} image${urls.length > 1 ? "s" : ""} uploaded`,
      );
    } catch (err) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleInputChange = (e) => {
    handleFiles(e.target.files);
    e.target.value = "";
  };

  const removeImage = (index) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      {remaining > 0 && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => !uploading && fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
            dragOver
              ? "border-primary bg-primary/5"
              : "border-border-subtle hover:border-primary/50"
          } ${uploading ? "opacity-60 pointer-events-none" : ""}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleInputChange}
          />
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <span className="loading loading-spinner loading-lg text-primary" />
              <p className="text-sm text-text-muted">Uploading to ImgBB…</p>
            </div>
          ) : (
            <>
              <span className="material-symbols-outlined text-4xl text-text-muted">
                cloud_upload
              </span>
              <p className="mt-2 text-sm font-medium text-text-main">
                Drag & drop images here, or click to browse
              </p>
              <p className="text-xs text-text-muted mt-1">
                JPG, PNG, WebP — max 5 MB each ({remaining} remaining)
              </p>
            </>
          )}
        </div>
      )}

      {/* Preview grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {images.map((url, i) => (
            <div
              key={url}
              className="relative group rounded-lg overflow-hidden border border-border-subtle aspect-[4/3] bg-surface-container-low"
            >
              <img
                src={url}
                alt={`Property ${i + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-error/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
              {i === 0 && (
                <span className="absolute bottom-1.5 left-1.5 badge badge-xs badge-primary">
                  Cover
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
