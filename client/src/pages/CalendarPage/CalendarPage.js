import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "react-calendar/dist/Calendar.css";
import "./CalendarOverride.css";
import Calendar from "react-calendar";
import styles from "./CalendarPage.module.css";
import { TaskFilterSelector } from "../../components/TaskFilterSelector/TaskFilterSelector.js";
import { instance } from "../../axios.js";
import Header from "../../components/Header/Header.js";
import TaskDetails from "../../components/TaskDetails/TaskDetails";
import TaskListView from "../../components/TaskListView/TaskListView.js";
import { ErrorMessage } from "../../components/ErrorMessage/ErrorMessage";
import { buildDateRangeRoute, getTaskReflection } from "../../utils.js";

const getDayAbbreviation = (_, label) => {
  return label.toString().slice(0, 1);
};

const dailyTaskDateFormatter = (date) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return String.raw`${
    months[date.getMonth()]
  } ${date.getDate()}, ${date.getFullYear()}`;
};

const CalendarPage = () => {
  const navigate = useNavigate();
  const [currDate, setCurrDate] = useState(new Date());
  const [taskData, setTaskData] = useState([]);
  const [toggleError, setToggleError] = useState(false);
  const [loadingError, setLoadingError] = useState(false);
  const [toggleErrorMessage, setToggleErrorMessage] = useState("");
  const [loadingErrorMessage, setLoadingErrorMessage] = useState("");
  const filterSet = ["Not Started", "Ongoing", "Completed", "All"];
  const [currentFilter, setCurrentFilter] = useState(filterSet[3]);
  const [showTaskDetails, setShowTaskDetails] = useState(false);

  const filterTask = (task) => {
    switch (currentFilter) {
      case filterSet[0]: // not started
        return (
          !task.isStarted &&
          !("taskStartedAt" in task) &&
          !("taskEndedAt" in task)
        );
      case filterSet[1]: // ongoing
        return task.isStarted && "taskStartedAt" in task;
      case filterSet[2]:
        return !task.isStarted && "taskEndedAt" in task;
    }
  };

  const toggleModal = () => {
    setShowTaskDetails(!showTaskDetails);
  };

  const getTasks = async () => {
    setLoadingErrorMessage("");
    setLoadingError(false);
    try {
      const taskData = await instance.get(
        buildDateRangeRoute(currDate, currDate)
      );
      const filteredTaskData =
        currentFilter !== filterSet[3]
          ? taskData.data.filter(filterTask)
          : taskData.data;
      if (filteredTaskData.length === 0) {
        setLoadingErrorMessage("No tasks yet");
        setLoadingError(true);
      }
      setTaskData(filteredTaskData);
    } catch {
      setLoadingErrorMessage("Unable to load tasks!");
      setLoadingError(true);
    }
  };

  const toggleTaskHandler = async (id) => {
    setToggleError(false);
    setToggleErrorMessage("");
    await instance
      .put(`/tasks/toggle/${id}`)
      .then(() => {
        getTasks();
        setToggleError(false);
      })
      .catch(() => {
        setToggleErrorMessage("Unable to toggle task!");
        setToggleError(true);
      });
  };

  const createTaskReflectionHandler = async (
    id,
    reflectionComments,
    satisfaction
  ) => {
    setToggleError(false);
    setToggleErrorMessage("");
    const reflectionData = {
      body: reflectionComments,
      task_id: id,
      satisfaction: satisfaction,
    };

    await instance
      .post(`/feedback`, reflectionData)
      .then(() => {
        return true;
      })
      .catch(() => {
        setToggleError(true);
        setToggleErrorMessage("Unable to create task reflection");
        return false;
      });
  };

  useEffect(() => {
    getTasks();
  }, [currDate, currentFilter]);

  // follows the signature in react-calendar documentation
  const dateChangeGetter = (date, _) => {
    setCurrDate(date);
  };

  // if (!loadingError && reflectionsData.length !== taskData.length) {
  //   setLoadingError(true);
  //   setLoadingErrorMessage("Loading task reflections ...");
  // }

  return (
    <div className={styles.bg}>
      {showTaskDetails ? (
        <TaskDetails closeModalHandler={toggleModal} />
      ) : (
        <></>
      )}
      <Header pageTitle={"Daily Tasks"} />
      <Calendar
        onChange={dateChangeGetter}
        value={currDate}
        formatShortWeekday={getDayAbbreviation}
      />
      <div className={styles.headerContainer}>
        <p className={styles.calendarHeader}>
          {dailyTaskDateFormatter(currDate)}
        </p>
        <button
          className={styles.createTaskButton}
          onClick={() => navigate("/task_form")}
        >
          Add Task
        </button>
      </div>
      <TaskFilterSelector
        filterSet={filterSet}
        currentFilter={currentFilter}
        onFilterChanged={setCurrentFilter}
      />
      {toggleError ? (
        <div className={styles.errorMessageStyle}>
          <ErrorMessage errorMessage={toggleErrorMessage} />
        </div>
      ) : (
        <> </>
      )}
      {loadingError ? (
        <div className={styles.errorMessageStyle}>
          <ErrorMessage errorMessage={loadingErrorMessage} />
        </div>
      ) : (
        <TaskListView
          tasks={taskData}
          edittable={true}
          toggleTaskHandler={toggleTaskHandler}
          createTaskReflectionHandler={createTaskReflectionHandler}
          getTaskReflection={getTaskReflection}
        />
      )}
    </div>
  );
};

export default CalendarPage;
