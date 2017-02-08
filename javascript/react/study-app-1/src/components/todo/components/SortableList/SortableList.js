import React, {Component} from 'react';
import SortableListItem from './SortableListItem';


class SortableList extends Component {
  state = {}

  handleChange = (stateChanges) => {
    this.setState(stateChanges);

    if(stateChanges.draggingIndex === null) {
      // drag has finished
      this.props.handleChange(this.state.items);
    }
  }

  render() {
    return (
      <ul className="sortable-list">
        {this.props.items.map((item, i) =>
          <SortableListItem
            key={i}
            updateState={this.handleChange}
            items={this.props.items}
            draggingIndex={this.state.draggingIndex}
            sortId={i}
            outline="list">{item}</SortableListItem>
        )}
      </ul>
    )
  }
}

SortableList.propTypes = {
  items: React.PropTypes.array,
  handleChange: React.PropTypes.func.isRequired
};

export default SortableList;
