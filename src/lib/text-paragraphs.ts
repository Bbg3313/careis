/**
 * Split plain text into paragraphs. Use a blank line in the source string
 * (e.g. two newlines `\n\n`) between blocks you want spaced apart on the page.
 */
export function splitParagraphs(text: string): string[] {
  const trimmed = text.trim();
  if (!trimmed) return [];
  return trimmed
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
}
