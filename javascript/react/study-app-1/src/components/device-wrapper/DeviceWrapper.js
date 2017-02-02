import React from 'react';
import classNames from 'classnames';

import './DeviceWrapper.css';

export const DeviceWrapper = (props) => {
  return (
    <div className={classNames("device-wrapper", `device-wrapper-${props.type}`)}>
      <div className='device-wrapper-screen'>
        <div className="device-wrapper-content">
          {props.children}
        </div>
      </div>
    </div>
  )
}
