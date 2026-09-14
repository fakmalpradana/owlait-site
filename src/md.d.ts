declare module '*.md?html' {
  export const html: string;
  export const headings: { id: string; text: string; level: number }[];
  const doc: { html: string; headings: typeof headings };
  export default doc;
}
