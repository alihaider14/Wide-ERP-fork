import React from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "@/assets/svg";

interface ActionButtonsCellProps {
  onEdit: () => void;
  onDelete: () => void;
}

const ActionButtonsCell: React.FC<ActionButtonsCellProps> = ({
  onEdit,
  onDelete,
}) => {
  return (
    <div className="flex gap-2">
      <Button
        onClick={onEdit}
        className="h-[40px] w-[40px] p-2 bg-editBg rounded-full hover:bg-editBg"
      >
        <img src={Edit} alt="edit" className="h-[24px] w-[24px]" />
      </Button>
      <Button
        onClick={onDelete}
        className="h-[40px] w-[40px] p-2 bg-deleteBg rounded-full hover:bg-deleteBg"
      >
        <img src={Trash} alt="delete" className="h-[24px] w-[24px]" />
      </Button>
    </div>
  );
};

export default ActionButtonsCell;
