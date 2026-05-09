import { TreeNode } from '@/types/User';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { useId } from 'react';

type CustomCheckboxTreeProps = {
  initialTree: TreeNode;
  handleCheck: (node: TreeNode) => void;
  isChecked: (node: TreeNode) => boolean | "indeterminate";
};

const CustomCheckboxTree = ({
  initialTree,
  handleCheck,
  isChecked,
}: CustomCheckboxTreeProps) => {
  const id = useId();

  const renderTreeNode = (node: TreeNode) => {
    const children = node.children?.map(renderTreeNode);

    return (
      <div className='flex flex-col gap-2' key={`${id}-${node.key}`}>
        <div className='flex items-center gap-3'>
          <Checkbox
            id={`${id}-${node.key}`}
            checked={isChecked(node) === true}
            onCheckedChange={() => handleCheck(node)}
          />
          <Label
            htmlFor={`${id}-${node.key}`}
            className={`text-sm text-foreground ${
              node.children?.length
                ? 'font-poppins font-semibold text-[14px] leading-none tracking-normal text-center align-middle  text-semi-black px-2 py-1 rounded'
                : 'px-2 py-1'
            }`}
          >
            {node.label}
          </Label>
        </div>

        {children && (
          <div className='grid grid-cols-2 md:grid-cols-4 gap-0'>
            {children}
          </div>
        )}
      </div>
    );
  };

  return <div>{renderTreeNode(initialTree)}</div>;
};

export default CustomCheckboxTree;
