export function isAddressPromptDismissed(
  storedFlag: string | null,
  storedLocation: string | null,
  defaultLocation: string,
) {
  if (storedFlag === "true") return true;
  return storedFlag === null && Boolean(storedLocation?.trim() && storedLocation.trim() !== defaultLocation);
}