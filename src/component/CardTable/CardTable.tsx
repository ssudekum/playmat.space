import React, { FC, useRef, useState } from 'react';
import './CardTable.css';
import Card from '../../lib/Card';
import CountedCollection from '../../lib/CountedCollection';
import TextCard from '../TextCard/TextCard';

enum SortDirection {
  "ASC",
  "DESC"
};

type TableProps = {
  cards: CountedCollection<Card>
};

const CardTable: FC<TableProps> = (props) => {
  const table = useRef<HTMLTableElement>(null);
  const [sortColumn, setSortColumn] = useState(2);
  const [sortDirection, setSortDirection] = useState(SortDirection.DESC);

  const applySort = (columnIdx: number) => {
    if (table.current) {
      setSortColumn(columnIdx);
      let direction: SortDirection = SortDirection.ASC;
      let switching: boolean = true;
      let switchcount: number = 0;

      while (switching) {
        switching = false;
        const rows = table.current.rows;
        let current, next;
        let swap: boolean | undefined;
        let i;

        for (i = 1; i < (rows.length - 1); i++) {
          swap = false;
          current = rows[i].children[columnIdx];
          next = rows[i + 1].children[columnIdx];

          if (direction === SortDirection.ASC) {
            if (current.innerHTML.toLowerCase() > next.innerHTML.toLowerCase()) {
              swap = true;
              break;
            }
          } else if (direction === SortDirection.DESC) {
            if (current.innerHTML.toLowerCase() < next.innerHTML.toLowerCase()) {
              swap = true;
              break;
            }
          }
        }

        if (swap) {
          let parent = rows[i].parentNode;
          if (parent) {
            parent.insertBefore(rows[i + 1], rows[i]);
          }

          switching = true;
          switchcount++;
        } else {
          if (switchcount === 0 && direction === SortDirection.ASC) {
            direction = SortDirection.DESC;
            switching = true;
          }
        }
      }

      setSortDirection(direction);
    }
  };

  const displaySort = (columnIdx: number) => sortColumn === columnIdx
    ? sortDirection === SortDirection.ASC
      ? <i className="fas fa-sort-down sort-icon active"></i>
      : <i className="fas fa-sort-up sort-icon active"></i>
    : null;

  return <div className="table-container">
    <table ref={table} className="card-table">
      <thead>
        <tr>
          <th onClick={() => applySort(0)}>
            # <span className="sort-icon-container">
              {displaySort(0)} <i className="fas fa-sort sort-icon"></i>
            </span>
          </th>
          <th onClick={() => applySort(1)}>
            CMC {displaySort(1)} <i className="fas fa-sort sort-icon"></i>
          </th>
          <th onClick={() => applySort(2)}>
            Name {displaySort(2)} <i className="fas fa-sort sort-icon"></i>
          </th>
          <th onClick={() => applySort(3)}>
            Type {displaySort(3)} <i className="fas fa-sort sort-icon"></i>
          </th>
        </tr>
      </thead>
      <tbody>
        {
          props.cards.items.map((card) => (
            <tr key={`table-row-${card.id}`}>
              <td>{props.cards.counts[card.id]}</td>
              <td>{card.mana_cost ? card.cmc : "-"}</td>
              <TextCard card={card}></TextCard>
              <td>{card.type_line}</td>
            </tr>
          ))
        }
      </tbody>
    </table>
  </div>
}

export default CardTable;