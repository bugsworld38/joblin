export const calculateOffset = (page: number, pageSize: number) => {
  return (page - 1) * pageSize;
};
