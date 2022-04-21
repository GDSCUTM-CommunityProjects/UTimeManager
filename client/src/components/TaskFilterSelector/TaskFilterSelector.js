import React from "react";
import styles from "./TaskFilterSelector.module.css";
import { PropTypes } from "prop-types";

const FilterButton = ({ filterName, currentFilter, onFilterChanged }) => {
  return (
    <button
      className={
        filterName === currentFilter
          ? styles.selectedFilter
          : styles.filterButton
      }
      onClick={() => onFilterChanged(filterName)}
    >
      {filterName}
    </button>
  );
};

FilterButton.propTypes = {
  filterName: PropTypes.string.isRequired,
  currentFilter: PropTypes.string.isRequired,
  onFilterChanged: PropTypes.func.isRequired,
};

export const TaskFilterSelector = ({
  filterSet,
  currentFilter,
  onFilterChanged,
}) => {
  const filterButtons = filterSet.map((filterName, ix) => (
    <FilterButton
      key={ix}
      filterName={filterName}
      currentFilter={currentFilter}
      onFilterChanged={onFilterChanged}
    />
  ));
  return <div className={styles.filterBar}>{filterButtons}</div>;
};

TaskFilterSelector.propTypes = {
  filterSet: PropTypes.arrayOf(PropTypes.string).isRequired,
  currentFilter: PropTypes.string.isRequired,
  onFilterChanged: PropTypes.func.isRequired,
};
