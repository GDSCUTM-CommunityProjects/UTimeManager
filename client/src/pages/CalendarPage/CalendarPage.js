import React, { useState, useEffect } from "react";
import "react-calendar/dist/Calendar.css";
import "./CalendarOverride.css";
import Calendar from "react-calendar";
import styles from "./CalendarPage.module.css";
import CalendarHeader from "../../components/CalendarHeader/CalendarHeader.js";
import TaskDetails from "../../components/TaskDetails/TaskDetails";
import { instance } from "../../axios.js";
import TaskListView from "../../components/TaskListView/TaskListView.js";
import { ErrorMessage } from "../../components/ErrorMessage/ErrorMessage";

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

// Convert the task data fetched from the server into JS objects of the
// {title, locationText, startTimeText, endTimeText, isOngoing}
const convertTaskData = (fetchedTaskData) => {
  return [];
};

const buildDailyTaskRoute = (currDate) => {
  // getMonth returns 0-11
  const currMonthStr = String(currDate.getMonth() + 1).padStart(2, "0");
  // getDate returns 1-31
  const currDayStr = String(currDate.getDate()).padStart(2, "0");
  return (
    "/api/tasks/day/" +
    currDate.getFullYear().toString() +
    currMonthStr +
    currDayStr
  );
};

const CalendarPage = () => {
  const [showModal, setModal] = useState(false);

  const toggleModal = () => {
    setModal(!showModal);
  };
  const [currDate, setCurrDate] = useState(new Date());
  const [taskData, setTaskData] = useState([]);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    const getTasks = async () => {
      await instance
        .get(buildDailyTaskRoute(currDate))
        .then((taskData) => {
          console.log(taskData);
          setTaskData(taskData);
          setShowError(false);
        })
        .catch(() => {
          setShowError(true);
        });
    };

    getTasks();
  }, [currDate]);

  // follows the signature in react-calendar documentation
  const dateChangeGetter = (date, _) => {
    setCurrDate(date);
  };

  return (
    <div className={styles.bg}>
      {showModal ? <TaskDetails closeModalHandler={toggleModal} /> : <></>}
      <CalendarHeader />
      <Calendar
        onChange={dateChangeGetter}
        value={currDate}
        formatShortWeekday={getDayAbbreviation}
      />
      <div className={styles.flexContainer}>
        <button className={styles.filterButton}>Filter: Ongoing</button>
      </div>
      <p className={styles.calendarHeader}>
        {dailyTaskDateFormatter(currDate)}
      </p>
      {showError ? (
        <div className={styles.errorMessageStyle}>
          <ErrorMessage errorMessage={"Unable to load tasks!"} />
        </div>
      ) : (
        <TaskListView tasks={convertTaskData(taskData)} edittable={true} />
      )}
    </div>
  );
};

export default CalendarPage;
