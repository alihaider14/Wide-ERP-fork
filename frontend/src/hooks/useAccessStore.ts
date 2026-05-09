import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AccessStore } from "@/types/access";

const useAccessStore = create<AccessStore>()(
	persist(
		(set, get) => ({
			access: [],
			userId: null,
			setAccess: (newAccess, userId) => set({ access: newAccess, userId }),
			hasAccess: (permission) => get().access.includes(permission),
		}),
		{
			name: "access-storage",
		},
	),
);

export default useAccessStore;
