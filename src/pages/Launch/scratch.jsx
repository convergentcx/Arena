async submitHash() {
  if (!this.state.file) {
    window.alert("Upload an image first!");
    throw 'no image';
  }

  const buff = dataUriToBuffer(this.state.file);
  this.setState({
    toggleLoading: true,
  });

  const result = await ipfs.add(buff, {
    progress: prog => {
      this.setState({
        ipfsProg: prog,
      })
      console.log(`ipfs progress: ${this.state.ipfsProg}%`);
    }
  });

  this.setState({
    ipfsHash: result[0].hash,
    toggleLoading: false,
  });
}