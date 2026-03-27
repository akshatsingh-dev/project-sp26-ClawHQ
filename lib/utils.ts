export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function getEstimatedTime(step: number) {
  if (step <= 1) return "~30 seconds";
  if (step <= 3) return "~45 seconds";
  return "~20 seconds";
}
