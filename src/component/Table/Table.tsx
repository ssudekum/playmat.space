import React, { FC, ReactNode, useMemo, useState } from "react";
import { Table, TableHead, TableSortLabel, TableBody, TableRow, TableCell } from "@material-ui/core";
import './Table.css';

export type SortDirection = "asc" | "desc";

export type Comparator<T=any> = (a: T, b: T) => number;

export type TableColumn = {
  field: string;
  label?: ReactNode;
  formatter?: (value: any, row: any) => ReactNode,
  getComparator?: (direction: SortDirection) => Comparator
};

export type TableProps = {
  columns: TableColumn[];
  rows: Record<string, any>[];
  initialSortField?: string;
};

const naturalSort = (direction: SortDirection): Comparator => {
  return direction === "desc"
    ? (a, b) => a === b ? 0 : a > b ? -1 : 1
    : (a, b) => a === b ? 0 : a < b ? -1 : 1;
};

const SortableTable: FC<TableProps> = (props) => {
  const { columns, rows, initialSortField } = props;
  const [sortBy, setSortBy] = useState(initialSortField ?? columns[0]?.field);
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const tableRows = useMemo(() => {
    if (rows?.length) {
      const column = columns?.find(column => column.field === sortBy);
      const comparator = column?.getComparator
        ? column.getComparator(sortDirection)
        : naturalSort(sortDirection);
      
      rows.sort(comparator);
      return rows.map((row: Record<string, any>, idx: number) => (
        <TableRow key={idx}>
          {
            columns?.map((column, idx) => {
              const {field, formatter} = column;
              const data = row[field];
              const cell = formatter ? formatter(data, row) : data;
              return (
                <TableCell key={idx}>
                  {cell}
                </TableCell>
              );
            })
          }
        </TableRow>
      ));
    }
  }, [columns, rows, sortBy, sortDirection]);

  const tableHead = useMemo(() => (
    <TableRow>
      {
        columns?.map((column, idx) => (
          <TableCell key={idx}>
            <TableSortLabel
              active={sortBy === column.field}
              direction={sortDirection}
              onClick={() => {
                setSortBy(column.field);
                setSortDirection(
                  sortBy === column.field && sortDirection === "desc" 
                    ? "asc" 
                    : "desc"
                );
              }}>
              {column.label}
            </TableSortLabel>
          </TableCell>
        ))
      }
    </TableRow>
  ), [columns, sortBy, sortDirection]);

  return (
    <Table className="table">
      <TableHead>
        {tableHead}
      </TableHead>
      <TableBody>
        {tableRows?.length ? tableRows : (
          <TableRow>
            <TableCell 
              colSpan={columns?.length} 
              style={{ textAlign: "center" }}
            >
              {props.children}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default SortableTable;