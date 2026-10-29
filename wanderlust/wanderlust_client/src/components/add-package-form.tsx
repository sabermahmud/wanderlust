"use client";

import { ImagePlus, LoaderCircle, Save, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const categories = [
  "Beach",
  "Mountain",
  "City",
  "Adventure",
  "Cultural",
  "Wildlife",
];

const fieldClassName = "h-10 bg-muted/40";
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_DESCRIPTION_LENGTH = 1000;

/** Local "YYYY-MM-DD" for today, used to block past departure dates. */
function todayIsoDate(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${now.getFullYear()}-${month}-${day}`;
}

function Field({
  id,
  label,
  children,
  className,
  hint,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
  className?: string;
  hint?: React.ReactNode;
}) {
  return (
    <div className={className}>
      <Label htmlFor={id} className="mb-2 block">
        {label}
      </Label>
      {children}
      {hint}
    </div>
  );
}

function AddPackageForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Create and clean up the local image preview URL.
  useEffect(() => {
    if (!selectedImage) {
      setPreviewUrl("");
      return;
    }

    const objectUrl = URL.createObjectURL(selectedImage);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedImage]);

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      setSelectedImage(null);
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Please select a JPG, PNG, or WebP image.");
      event.target.value = "";
      setSelectedImage(null);
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("Image size must be 5 MB or less.");
      event.target.value = "";
      setSelectedImage(null);
      return;
    }

    setSelectedImage(file);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) return;

    if (!category) {
      toast.error("Please select a destination category.");
      return;
    }

    if (!selectedImage) {
      toast.error("Please select a destination image.");
      return;
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      toast.error("Cloudinary configuration is missing.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Upload the selected image to Cloudinary.
      const uploadData = new FormData();
      uploadData.append("file", selectedImage);
      uploadData.append("upload_preset", uploadPreset);

      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: uploadData,
        },
      );

      const uploadResult = await uploadResponse.json();

      if (!uploadResponse.ok || !uploadResult.secure_url) {
        throw new Error(uploadResult.error?.message || "Image upload failed.");
      }

      // 2. Collect the form fields.
      const form = formRef.current;

      if (!form) {
        throw new Error("Form could not be found.");
      }

      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      // 3. Include the Cloudinary URL and selected category.
      data.category = category;
      data.imageUrl = uploadResult.secure_url;

      // 4. Save the destination data to your backend.
      const response = await fetch("http://localhost:5000/add-destination", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok || !result.insertedId) {
        throw new Error(result.message || "Failed to save the travel package.");
      }

      toast.success("Package added successfully!");

      form.reset();
      setCategory("");
      setDescription("");
      setSelectedImage(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Send the admin to the list so the new package is visible right away.
      router.push("/all-destinations");
      router.refresh();
    } catch (error) {
      console.error("Add package error:", error);

      const message =
        error instanceof Error && error.message
          ? error.message
          : "Something went wrong. Please try again.";

      // fetch() rejects with a TypeError when the API is unreachable.
      toast.error(
        message === "Failed to fetch"
          ? "Could not reach the server. Make sure the API is running."
          : message,
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleReset() {
    setCategory("");
    setDescription("");
    setSelectedImage(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      onReset={handleReset}
      aria-busy={isSubmitting}
      className="space-y-5"
    >
      <Field id="name" label="Destination Name">
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="Bali Paradise"
          autoComplete="off"
          maxLength={120}
          className={fieldClassName}
          disabled={isSubmitting}
          required
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="country" label="Country">
          <Input
            id="country"
            name="country"
            type="text"
            placeholder="Indonesia"
            autoComplete="off"
            maxLength={80}
            className={fieldClassName}
            disabled={isSubmitting}
            required
          />
        </Field>

        <Field id="category" label="Category">
          <Select
            name="category"
            value={category}
            onValueChange={(value) => setCategory(value ?? "")}
            disabled={isSubmitting}
          >
            <SelectTrigger id="category" className={`${fieldClassName} w-full`}>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>

            <SelectContent>
              {categories.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="price" label="Price (USD)">
          <Input
            id="price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            placeholder="e.g., 1299"
            className={fieldClassName}
            disabled={isSubmitting}
            required
          />
        </Field>

        <Field id="duration" label="Duration">
          <Input
            id="duration"
            name="duration"
            type="text"
            placeholder="e.g., 7 Days/6 Nights"
            autoComplete="off"
            maxLength={60}
            className={fieldClassName}
            disabled={isSubmitting}
            required
          />
        </Field>
      </div>

      <Field id="departureDate" label="Departure Date">
        <Input
          id="departureDate"
          name="departureDate"
          type="date"
          min={todayIsoDate()}
          className={fieldClassName}
          disabled={isSubmitting}
          required
        />
      </Field>

      {/* Local image uploader */}
      <Field id="imageFile" label="Destination Image">
        <div className="space-y-3">
          <Input
            ref={fileInputRef}
            id="imageFile"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageChange}
            disabled={isSubmitting}
            className="h-auto min-h-10 cursor-pointer bg-muted/40 py-2 file:mr-4 file:rounded-md file:border-0 file:bg-brand file:px-3 file:py-1 file:text-white"
            required
          />

          <p className="text-sm text-muted-foreground">
            JPG, PNG or WebP. Maximum file size: 5 MB.
          </p>

          {previewUrl && (
            <div className="relative w-fit">
              {/* biome-ignore lint/performance/noImgElement: blob: preview URLs cannot be optimized by next/image */}
              <img
                src={previewUrl}
                alt="Selected destination preview"
                className="h-48 w-full max-w-sm rounded-lg border object-cover"
              />

              <Button
                type="button"
                variant="destructive"
                size="icon"
                aria-label="Remove selected image"
                className="absolute right-2 top-2"
                disabled={isSubmitting}
                onClick={() => {
                  setSelectedImage(null);

                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          {!previewUrl && (
            <div className="flex items-center gap-2 rounded-lg border border-dashed p-5 text-sm text-muted-foreground">
              <ImagePlus className="h-5 w-5" />
              Choose an image to see its preview.
            </div>
          )}
        </div>
      </Field>

      <Field
        id="description"
        label="Description"
        hint={
          <p className="mt-1.5 text-xs text-muted-foreground">
            {description.length}/{MAX_DESCRIPTION_LENGTH} characters
          </p>
        }
      >
        <Textarea
          id="description"
          name="description"
          placeholder="Describe the travel experience..."
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          maxLength={MAX_DESCRIPTION_LENGTH}
          className="min-h-28 resize-y bg-muted/40"
          disabled={isSubmitting}
          required
        />
      </Field>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button
          type="reset"
          variant="outline"
          disabled={isSubmitting}
          className="h-10 border-destructive/30 px-4 text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 aria-hidden="true" />
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-10 bg-brand px-4 text-white hover:bg-brand-hover"
        >
          {isSubmitting ? (
            <LoaderCircle aria-hidden="true" className="animate-spin" />
          ) : (
            <Save aria-hidden="true" />
          )}
          {isSubmitting ? "Uploading & Saving..." : "Add Travel Package"}
        </Button>
      </div>
    </form>
  );
}

export { AddPackageForm };
