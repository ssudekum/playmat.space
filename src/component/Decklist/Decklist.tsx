import React, { FC, useMemo } from 'react';
import './Decklist.css';
import Card from '../../lib/type/Card';
import CountedCollection from '../../lib/class/CountedCollection';
import TextCard from '../TextCard/TextCard';
import Table, { TableColumn } from '../Table/Table';

type TableProps = {
  cards: CountedCollection<Card>
};

const baseColumns = [
  {
    label: 'Cost',
    field: 'cmc',
    formatter: (cmc: number, card: Card) => card?.mana_cost ? cmc : "-",
  },
  {
    label: 'Name',
    field: 'name',
    formatter: (_name: string, card: Card) => (
      <TextCard card={card}></TextCard>
    )
  },
  {
    label: 'Type',
    field: 'type_line'
  }
];

const Decklist: FC<TableProps> = ({ cards }) => {
  const columns: TableColumn[] = useMemo(() => [
    {
      label: '#',
      field: 'id',
      formatter: (id: number, _card: Card) => cards.counts[id]
    },
    ...baseColumns
  ], [cards]);

  return (
    <Table 
      columns={columns} 
      rows={cards.items}
      initialSortField="name">
      No cards in this list!
    </Table>
  );
}

export default Decklist;