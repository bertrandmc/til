import React, {Component} from 'react';
import classNames from 'classnames';
import InfiniteCalendar from 'react-infinite-calendar';
import moment from 'moment';

import 'react-infinite-calendar/styles.css';
import './DatePicker.css';

class Calendar extends Component {
  state = {
    showCalendar: false
  }

  onDateSelect = (date) => {
    this.props.handleChange(date);
    return false;
  }

  render() {
    return (
      <div className={classNames("datepicker", {"is-visible": this.props.isVisible})}>
        <InfiniteCalendar
          width={'100%'}
          autoFocus={false}
          showHeader={false}
          shouldHeaderAnimate={false}
          selectedDate={moment(this.props.selectedDate)}
          beforeSelect={this.onDateSelect}
          locale={{
           week: {
              dow: 1,
              doy: 4
           }
         }}
        />
      </div>
    )
  }
}

Calendar.propTypes = {
  handleChange: React.PropTypes.func.isRequired,
  selectedDate: React.PropTypes.string
};


export default Calendar;
