import React from "react";
import styles from "./TaskListView.module.css";
import TaskCard from "../TaskCard/TaskCard";
import { PropTypes } from "prop-types";

const TaskListView = ({ tasks }) => {
  const cards = tasks.map((task, ix) => (
    <li key={ix} style={{ listStyle: "none" }}>
      <TaskCard
        title={task.title}
        location={task.locationText}
        startTime={task.startTimeText}
        endTime={task.endTimeText}
        isOngoing={task.isOngoing}
        showDetailsDialog={() => {}}
      />
    </li>
  ));

  return <ul className={styles.taskList}>{cards}</ul>;
};

TaskListView.propTypes = {
  tasks: PropTypes.arrayOf(PropTypes.object).isRequired,
};
export default TaskListView;