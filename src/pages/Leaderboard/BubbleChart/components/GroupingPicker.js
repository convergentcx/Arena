import React from "react";
import PropTypes from "prop-types";
import classes from "./GroupingPicker.module.css";

export default class GroupingPicker extends React.Component {
  onBtnClick = event => {
    this.props.onChanged(event.target.name);
  };
  render() {
    const { active } = this.props;
    return (
      <div className={classes.GroupingPicker}>
        <button
          className={`${classes.button} ${active === "all" && classes.active}`}
          name="all"
          onClick={this.onBtnClick}
        >
          The Economy
        </button>
        <button
          className={`${classes.button} ${active === "year" && classes.active}`}
          name="year"
          onClick={this.onBtnClick}
        >
          Economies by Size
        </button>
      </div>
    );
  }
}

GroupingPicker.propTypes = {
  onChanged: PropTypes.func.isRequired,
  active: PropTypes.oneOf(["all", "year"]).isRequired
};
