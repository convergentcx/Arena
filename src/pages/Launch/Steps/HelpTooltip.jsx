import React, { Component } from 'react';

import { Grow, Tooltip, Typography } from '@material-ui/core';
import { withStyles, withTheme } from '@material-ui/core/styles';

const styles = theme => {
  let bg = '#464646';

  if (theme.palette.type === 'dark') {
    bg = '#FFFFFF';
  }

  return {
    arrowTool: {
      background: bg,
      padding: '5%',
      width: '250px',
    },
    arrowPopper: {
      '&[x-placement*="bottom"] $arrowArrow': {
        top: 0,
        left: 0,
        marginTop: '-0.9em',
        width: '3em',
        height: '1em',
        '&::before': {
          borderWidth: '0 1em 1em 1em',
          borderColor: `transparent transparent ${bg} transparent`,
        },
      },
      '&[x-placement*="top"] $arrowArrow': {
        bottom: 0,
        left: 0,
        marginBottom: '-0.9em',
        width: '3em',
        height: '1em',
        '&::before': {
          borderWidth: '1em 1em 0 1em',
          borderColor: `${bg} transparent transparent transparent`,
        },
      },
      '&[x-placement*="right"] $arrowArrow': {
        left: 0,
        marginLeft: '-0.9em',
        height: '3em',
        width: '1em',
        '&::before': {
          borderWidth: '1em 1em 1em 0',
          borderColor: `transparent ${bg} transparent transparent`,
        },
      },
      '&[x-placement*="left"] $arrowArrow': {
        right: 0,
        marginRight: '-0.9em',
        height: '3em',
        width: '1em',
        '&::before': {
          borderWidth: '1em 0 1em 1em',
          borderColor: `transparent transparent transparent ${bg}`,
        },
      },
    },
    arrowArrow: {
      position: 'absolute',
      fontSize: 7,
      width: '3em',
      height: '3em',
      '&::before': {
        content: '""',
        margin: 'auto',
        display: 'block',
        width: 0,
        height: 0,
        borderStyle: 'solid',
      },
    },
  };
};

class HelpTooltip extends Component {
  state = {
    arrowRef: null,
  };

  handleArrowRef = node => {
    this.setState({
      arrowRef: node,
    });
  };

  render() {
    const { classes, theme } = this.props;
    let contrastText = '#FFFFFF';
    if (theme.palette.type === 'dark') {
      contrastText = '#232323';
    }
    return (
      <Tooltip
        TransitionComponent={Grow}
        interactive
        placement="bottom-end"
        title={
          <React.Fragment>
            <Typography style={{ color: contrastText }}>{this.props.text}</Typography>
            <span className={classes.arrowArrow} ref={this.handleArrowRef} />
          </React.Fragment>
        }
        classes={{
          popper: classes.arrowPopper,
          tooltip: classes.arrowTool,
        }}
        PopperProps={{
          popperOptions: {
            modifiers: {
              arrow: {
                enabled: Boolean(this.state.arrowRef),
                element: this.state.arrowRef,
              },
            },
          },
        }}
      >
        {this.props.children}
      </Tooltip>
    );
  }
}

export default withTheme()(withStyles(styles)(HelpTooltip));
