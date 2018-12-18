import React from 'react';

import { Avatar } from '@material-ui/core';

import styled from 'styled-components';

const Photo = props => {
  const Div = styled.div`
    position: relative;
    width: ${props.width};
    max-width: 120px;
    @media (min-width: 960px) {
      max-width: 180px;
    }
    &:after {
      content: '';
      display: block;
      padding-bottom: 100%;
    }
  `;
  const ImgDiv = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
  `;

  return (
    <Div>
      <ImgDiv>
        <Avatar
          alt="photo"
          src={props.pic}
          style={{
            borderStyle: 'solid',
            borderColor: '#000',
            borderWidth: '3px',
            position: 'static',
            height: '100%',
            width: '100%',
          }}
        />
      </ImgDiv>
    </Div>
  );
};

export default Photo;
