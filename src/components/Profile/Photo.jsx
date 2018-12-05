import React from 'react';

import { Avatar } from '@material-ui/core';

const Photo = props => (
  <Avatar
    alt="photo"
    src={props.pic}
    style={{ width: props.width, height: props.width }}
  />
);

export default Photo;
