import { TreeNode } from "@/types/User";
import { useCallback, useEffect, useMemo, useState } from "react";

export function useCheckboxTree(
	initialTree: TreeNode,
	initialCheckedList?: string[],
) {
	// Initialize with empty set for add user, or provided list for update user
	const [checkedNodes, setCheckedNodes] = useState<Set<string>>(() => {
		if (initialCheckedList && initialCheckedList.length > 0) {
			return new Set(initialCheckedList);
		}
		return new Set<string>();
	});

	// Update when initialCheckedList changes (for update user)
	useEffect(() => {
		if (initialCheckedList && initialCheckedList.length > 0) {
			setCheckedNodes(new Set(initialCheckedList));
		} else {
			setCheckedNodes(new Set<string>());
		}
	}, [initialCheckedList]);

	const isChecked = useCallback(
		(node: TreeNode): boolean | "indeterminate" => {
			if (!node.children || node.children.length === 0) {
				// Leaf node - just check if it's in the set
				return checkedNodes.has(node.key);
			}

			// Parent node - check children status
			const childrenChecked = node.children.map((child) => isChecked(child));
			const allChecked = childrenChecked.every((status) => status === true);
			const someChecked = childrenChecked.some(
				(status) => status === true || status === "indeterminate"
			);

			if (allChecked) return true;
			if (someChecked) return "indeterminate";
			return false;
		},
		[checkedNodes],
	);

	const handleCheck = useCallback(
		(node: TreeNode) => {
			const newCheckedNodes = new Set(checkedNodes);

			const toggleNode = (n: TreeNode, shouldCheck: boolean) => {
				if (shouldCheck) {
					newCheckedNodes.add(n.key);
				} else {
					newCheckedNodes.delete(n.key);
				}
				// Apply to all children recursively
				if (n.children) {
					n.children.forEach((child) => toggleNode(child, shouldCheck));
				}
			};

			// Determine if we should check or uncheck
			const currentStatus = isChecked(node);
			const shouldCheck = currentStatus !== true;

			toggleNode(node, shouldCheck);
			setCheckedNodes(newCheckedNodes);
		},
		[checkedNodes, isChecked],
	);

	const checkedNodeKeys = useMemo(() => {
		// Only return leaf nodes (nodes without children)
		return Array.from(checkedNodes).filter((key) => {
			const findNode = (node: TreeNode): TreeNode | undefined => {
				if (node.key === key) return node;
				if (node.children) {
					for (const child of node.children) {
						const found = findNode(child);
						if (found) return found;
					}
				}
				return undefined;
			};

			const node = findNode(initialTree);
			return node && (!node.children || node.children.length === 0);
		});
	}, [checkedNodes, initialTree]);

	const resetCheckedNodes = useCallback(() => {
		if (initialCheckedList && initialCheckedList.length > 0) {
			setCheckedNodes(new Set(initialCheckedList));
		} else {
			setCheckedNodes(new Set<string>());
		}
	}, [initialCheckedList]);

	return { isChecked, handleCheck, checkedNodeKeys, resetCheckedNodes };
}
