// src/components/ui/DataTable.tsx
import React from 'react';

type Column = {
  header: string;
  key: string;
};

type DataTableProps = {
  columns: Column[];
  data: any[];
};

const DataTable: React.FC<DataTableProps> = ({ columns, data }) => {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key} style={{ border: '1px solid #ccc', padding: '0.5rem' }}>
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            {columns.map((col) => (
              <td key={col.key} style={{ border: '1px solid #ccc', padding: '0.5rem' }}>
                {row[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DataTable;
