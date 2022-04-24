import React from "react";
import styles from "./TaskListView.module.css";
import TaskCard from "../TaskCard/TaskCard";
import { PropTypes } from "prop-types";

const TaskListView = ({
  tasks,
  edittable,
  toggleTaskHandler,
  createTaskReflection,
  getTaskReflection,
}) => {
  const cards = tasks.map(async function (task, ix) {
    const taskReflection = await getTaskReflection(task._id);
    // if one call fails, then only the error message will be shown in calendar
    return (
      <li key={ix} style={{ listStyle: "none" }}>
        <TaskCard
          id={task._id}
          title={task.title}
          location={task.location}
          description={task.description}
          startDateTime={new Date(task.startDate)}
          endDateTime={new Date(task.endDate)}
          ongoing={task.isStarted && "taskStartedAt" in task}
          finished={!task.isStarted && "taskEndedAt" in task}
          toggleTaskHandler={toggleTaskHandler}
          createTaskReflection={createTaskReflection}
          edittable={edittable}
          reflectionBody={taskReflection.body}
          satisfaction={taskReflection.satisfaction}
        />
      </li>
    );
  });

  return <ul className={styles.taskList}>{cards}</ul>;
};

TaskListView.propTypes = {
  tasks: PropTypes.arrayOf(PropTypes.object).isRequired,
  edittable: PropTypes.bool.isRequired,
  toggleTaskHandler: PropTypes.func,
  createTaskReflection: PropTypes.func.isRequired,
  getTaskReflection: PropTypes.func.isRequired,
};
export default TaskListView;
