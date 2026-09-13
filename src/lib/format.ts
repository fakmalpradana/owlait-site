export const MB = (bytes: number) => `${(bytes / 1e6).toFixed(bytes < 1e8 ? 1 : 0)} MB`;
