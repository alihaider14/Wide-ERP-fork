import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FormActionButtonsProps {
  onCancel?: () => void;
  onSubmit?: () => void;
  submitType?: "button" | "submit" | "reset";
  submitDisabled?: boolean;
  cancelDisabled?: boolean;
  submitText?: string;
  cancelText?: string;
  className?: string;
}

function FormActionButtons({
  onCancel,
  onSubmit,
  submitType = "button",
  submitDisabled,
  cancelDisabled,
  submitText = "Submit",
  cancelText = "Cancel",
  className,
}: FormActionButtonsProps) {
  return (
    <div className={cn("flex items-center justify-end gap-[30px] w-full", className)}>
      <Button
        type="button"
        variant="secondary"
        onClick={onCancel}
        disabled={cancelDisabled}
        className="w-auto xl:w-87.5 min-w-30 flex-1 xl:flex-none max-w-87.5"
      >
        {cancelText}
      </Button>
      <Button
        variant="primary"
        type={submitType}
        onClick={onSubmit}
        disabled={submitDisabled}
        className="w-auto xl:w-87.5 min-w-30 flex-1 xl:flex-none max-w-87.5"
      >
        {submitText}
      </Button>
    </div>
  );
}

export default FormActionButtons;