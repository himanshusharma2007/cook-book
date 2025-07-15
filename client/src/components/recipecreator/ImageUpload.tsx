/**
 * ImageUpload component for uploading recipe images.
 * Supports drag-and-drop and file input with preview.
 */
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FaImage, FaTimes } from 'react-icons/fa';
import { BiUpload } from 'react-icons/bi';
import { RecipeForm } from 'types';

/**
 * ImageUpload component.
 * @returns JSX.Element
 */
const ImageUpload = () => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<RecipeForm>();
  const [dragOver, setDragOver] = useState(false);
  const thumbnail = watch('thumbnail');
  const previewUrl = thumbnail ? URL.createObjectURL(thumbnail) : null;

  /**
   * Handle file selection or drop.
   * @param file - Selected or dropped file.
   */
  const handleFileChange = (file: File | null) => {
    setValue('thumbnail', file, { shouldValidate: true });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files[0] && files[0].type.startsWith('image/')) {
      handleFileChange(files[0]);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <label className="flex items-center text-lg merriweather font-semibold text-gray-700 mb-4">
        <FaImage className="mr-2 text-orange-500" />
        Recipe Image
      </label>
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
          dragOver
            ? 'border-orange-400 bg-orange-50'
            : 'border-gray-300 hover:border-orange-400 hover:bg-orange-50'
        }`}
        onDrop={handleDrop}
        onDragOver={e => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
      >
        {previewUrl ? (
          <div className="relative">
            <img
              src={previewUrl}
              alt="Recipe preview"
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <button
              type="button"
              onClick={() => handleFileChange(null)}
              className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors duration-200"
            >
              <FaTimes className="text-white text-sm" />
            </button>
          </div>
        ) : (
          <div className="py-8">
            <BiUpload className="text-4xl merriweather text-gray-400 mb-4 mx-auto" />
            <p className="text-gray-600 mb-2">
              Drop your image here or click to browse
            </p>
            <p className="text-gray-400 text-sm">PNG, JPG, GIF up to 10MB</p>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={e => handleFileChange(e.target.files?.[0] || null)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
      {errors.thumbnail && (
        <p className="text-red-500 text-sm mt-1">{errors.thumbnail.message}</p>
      )}
    </div>
  );
};

export default ImageUpload;
