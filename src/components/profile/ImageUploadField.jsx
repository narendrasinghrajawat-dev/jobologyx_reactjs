import { useRef } from "react";
import { Camera } from "lucide-react";
import Avatar from "../common/Avatar";
import ButtonLoader from "../common/ButtonLoader";

const MAX_SIZE_MB = 5;

const ImageUploadField = ({ label, imageUrl, name, uploading, onUpload }) => {
  const inputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      onUpload(null, "Please select an image file");
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      onUpload(null, `Image must be under ${MAX_SIZE_MB}MB`);
      return;
    }
    onUpload(file);
  };

  return (
    <div className="flex items-center gap-4">
      <div className="relative">
        <Avatar src={imageUrl} name={name} size="xl" />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-white shadow-sm hover:bg-primary-700 disabled:opacity-60"
          aria-label={`Upload ${label}`}
        >
          {uploading ? <ButtonLoader /> : <Camera className="h-4 w-4" />}
        </button>
      </div>
      <div>
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</p>
        <p className="text-xs text-slate-400">JPG or PNG, up to {MAX_SIZE_MB}MB</p>
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
    </div>
  );
};

export default ImageUploadField;
