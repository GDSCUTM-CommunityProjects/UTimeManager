import React, { useState, useEffect } from "react";
import styles from "./TaskHistoryPage.module.css";
import TaskListView from "../../components/TaskListView/TaskListView.js";
import {
  buildDateRangeRoute,
  convertTaskData,
  getWeekRange,
  getMonthRange,
} from "../../utils.js";
import { ErrorMessage } from "../../components/ErrorMessage/ErrorMessage.js";
import { instance } from "../../axios.js";
import { TaskFilterSelector } from "../../components/TaskFilterSelector/TaskFilterSelector.js";

const TaskHistoryPage = () => {
  const dayFilter = "Day";
  const weekFilter = "Week";
  const monthFilter = "Month";
  const [filter, setFilter] = useState(dayFilter);
  const [taskData, setTaskData] = useState([]);
  const [loadingError, setLoadingError] = useState(false);
  const [loadingErrorMessage, setLoadingErrorMessage] = useState("");

  const fetchTasks = async (route) => {
    setLoadingErrorMessage("");
    setLoadingError(false);
    await instance
      .get(route)
      .then((response) => {
        setTaskData(response.data);
        if (response.data.length === 0) {
          setLoadingError(true);
          setLoadingErrorMessage("No tasks yet");
        }
      })
      .catch(() => {
        setLoadingErrorMessage("Unable to load tasks!");
        setLoadingError(true);
      });
  };

  useEffect(() => {
    let startDate, endDate;
    const nowDate = new Date();
    switch (filter) {
      case dayFilter:
        fetchTasks(buildDateRangeRoute(nowDate, nowDate));
        break;
      case weekFilter:
        [startDate, endDate] = getWeekRange();
        fetchTasks(buildDateRangeRoute(startDate, endDate));
        break;
      case monthFilter:
        [startDate, endDate] = getMonthRange();
        fetchTasks(buildDateRangeRoute(startDate, endDate));
        break;
      default:
        fetchTasks("/api/tasks/");
        break;
    }
  }, [filter]);

  return (
    <div className={styles.bg}>
      <div className={styles.taskHistoryHeader}>Your Tasks</div>
      <TaskFilterSelector filterSelected={filter} onFilterChanged={setFilter} />
      {loadingError ? (
        <div className={styles.errorMessageStyle}>
          <ErrorMessage errorMessage={loadingErrorMessage} />
        </div>
      ) : (
        <TaskListView tasks={convertTaskData(taskData)} edittable={false} />
      )}
    </div>
  );
};

export default TaskHistoryPage;
