import React from 'react';
import { sortable } from 'react-sortable';

const ListItem = (props) => (
  <li {...props} className="sortable-list-item">{props.children}</li>
);

const SortableListItem = sortable(ListItem);

export default SortableListItem;
