let multihash;
if (this.state.events && this.state.events.length) {
  multihash = getMultihashFromBytes32({
    digest: this.state.events[this.state.events.length -1].returnValues.what,
    hashFunction: 18,
    size: 32,
  });
}