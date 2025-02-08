export default (date: string) => {
  return new Date(date).toISOString().replace("T", " ").slice(0, 16);
};
