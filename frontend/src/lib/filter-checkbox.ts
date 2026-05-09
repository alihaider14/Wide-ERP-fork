import { TreeNode } from "@/types/User";

export const filterTree = (tree: TreeNode, search: string) => {
	if (!search) return tree;

	const isParentMatch = tree.label?.toLowerCase().includes(search) ?? false;

	const filteredChildren = tree.children?.filter((child: TreeNode) =>
		child.label?.toLowerCase().includes(search) ?? false,
	);

	if (isParentMatch || filteredChildren!.length > 0) {
		return { ...tree, children: filteredChildren };
	}

	return null;
};
