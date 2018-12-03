import React, { Component } from 'react';

import { Avatar } from '@material-ui/core';
import Dropzone from 'react-dropzone';

class UploadImage extends Component {
  constructor() {
    super()
    this.state = {
      files: [],
      preview: '',
    };
  }

  onDrop = files => {
    console.log(files)
    this.setState({
      preview: URL.createObjectURL(files[0]),
    });
  }

  componentWillUnmount() {
    // Make sure to revoke the data uris to avoid memory leaks
    const {files} = this.state;
    for (let i = files.length; i >= 0; i--) {
      const file = files[0];
      URL.revokeObjectURL(file.preview);
    }
  }

  render() {
    const { preview } = this.state;
    return (
      <div style={{ height: '200px', width: '200px', margin: 'auto', borderRadius: '50%' }}>
        <Dropzone
          accept="image/*"
          onDrop={this.onDrop}
          style={{
            border: 'none',
          }}
        >
          {preview 
            ? <Avatar src={preview} style={{ height: '200px', width: '200px', margin: 'auto' }} />
            : <Avatar style={{ height: '200px', width: '200px', margin: 'auto' }}>
              Click to Upload
            </Avatar>
          }
        </Dropzone>
      </div>
    );
  }
}

export default UploadImage;