import React from "react";

interface TableRowProps {
  rowId: string;
  /** Keys to display as columns, in order */
  columns: string[];
  /** Map of column key → display value */
  rowData: Record<string, string>;
  className?: string;
  children?: React.ReactNode;
}

/**
 * OAT-styled TableRow
 * Renders native <tr> and <td> tags styled by OAT CSS.
 * Provides a slot for children to add custom cells (like delete buttons).
 */
export const TableRow: React.FC<TableRowProps> = ({ 
  rowId, 
  columns, 
  rowData, 
  className = "", 
  children 
}) => {
  return (
    <tr key={rowId} className={className}>
      {columns.map((col) => (
        <td key={col}>{rowData[col] ?? "—"}</td>
      ))}
      {children}
    </tr>
  );
};
