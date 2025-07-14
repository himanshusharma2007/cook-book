/**
 * InstructionsInput component for entering recipe instructions.
 * Uses QuillEditor for rich text input.
 */
import { useFormContext } from 'react-hook-form';
import { FaFileAlt } from 'react-icons/fa';
import QuillEditor from '../common/QuillEditor';

/**
 * Props for InstructionsInput component.
 */
interface InstructionsInputProps {
  setValue: ReturnType<typeof useFormContext>['setValue'];
  watch: ReturnType<typeof useFormContext>['watch'];
  errors: ReturnType<typeof useFormContext>['formState']['errors'];
}

/**
 * InstructionsInput component.
 * @param props - Component props.
 * @returns JSX.Element
 */
const InstructionsInput = ({ setValue, watch, errors }: InstructionsInputProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <label className="flex items-center text-lg merriweather font-semibold text-gray-700 mb-4">
        <FaFileAlt className="mr-2 text-orange-500" />
        Instructions
      </label>
      <div className="min-h-[300px]">
        <QuillEditor
          value={watch('instructions')}
          onChange={value => setValue('instructions', value, { shouldValidate: true })}
        />
      </div>
      {errors.instructions && (
        <p className="text-red-500 text-sm mt-1">{errors.instructions.message}</p>
      )}
    </div>
  );
};

export default InstructionsInput;