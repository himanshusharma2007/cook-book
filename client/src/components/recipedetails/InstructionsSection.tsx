/**
 * InstructionsSection component for displaying recipe instructions.
 * Used in RecipeDetails page to render HTML instructions.
 */

/**
 * Props for InstructionsSection component.
 */
interface InstructionsSectionProps {
  instructions: string;
}

/**
 * InstructionsSection component.
 * @param props - Component props.
 * @returns JSX.Element
 */
const InstructionsSection = ({ instructions }: InstructionsSectionProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-2xl merriweather font-semibold text-gray-800 mb-4">
        Instructions
      </h2>
      <div
        className="prose prose-sm max-w-none text-gray-700"
        dangerouslySetInnerHTML={{ __html: instructions }}
      />
    </div>
  );
};

export default InstructionsSection;
