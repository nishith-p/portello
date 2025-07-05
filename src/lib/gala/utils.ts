// src/lib/gala/utils.ts
export const generateTables = () => {
  const tables = [];
  let tableNumber = 1;
  const totalRows = 8;
  const tablesPerRow = 4;

  for (let row = 0; row < totalRows; row++) {
    for (let i = 0; i < tablesPerRow; i++) {
      tables.push({
        id: tableNumber,
        name: `Table ${tableNumber}`,
        seats: Array(12)
          .fill(null)
          .map((_, j) => ({
            number: j + 1,
            status: 'available' as const,
          })),
        row: row,
        positionInRow: i,
      });
      tableNumber++;
    }
  }

  return tables;
};
