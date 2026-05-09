export const STATUS_STYLES: Record<
  string,
  {
    bg: string;
    text: string;
    border: string;
  }
> = {
  fulfilled: {
    bg: "bg-green-50",
    text: "text-green-500",
    border: "border-green-500",
  },
  active: {
    bg: "bg-green-50",
    text: "text-green-500",
    border: "border-green-500",
  },
  pending: {
    bg: "bg-yellow-50",
    text: "text-yellow-600",
    border: "border-yellow-500",
  },
  failed: {
    bg: "bg-red-50",
    text: "text-red-500",
    border: "border-red-500",
  },
  cancelled: {
    bg: "bg-gray-100",
    text: "text-gray-500",
    border: "border-gray-400",
  },
  terminated: {
    bg: "bg-secondary-red",
    text: "text-red",
    border: "border-red",
  },
  onboard: {
    bg: "bg-blue-50",
    text: "text-blue-500",
    border: "border-blue-500",
  },
  "on hold": {
    bg: "bg-yellow-50",
    text: "text-yellow-600",
    border: "border-yellow-500",
  },
};

export const DEFAULT_STATUS_STYLE = {
  bg: "bg-gray-50",
  text: "text-gray-500",
  border: "border-gray-500",
};
