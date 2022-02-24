import React, { useState } from "react";
import "react-calendar/dist/Calendar.css";
import "./CalendarOverride.css";
import Calendar from "react-calendar";
import styles from "./CalendarPage.module.css";
import TaskCard from "../../components/TaskCard/TaskCard.js";

const dayLabelFormatter = (locale, label) => {
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
  } ${date.getDate()}, ${date.getFullYear()}`.toString();
};

const CalendarPage = () => {
  const [currDate, onDateChange] = useState(new Date());
  const children = [
    {
      title: "GDSC Meeting",
      locationText: "DH2020",
      startTimeText: "05:00PM",
      endTimeText: "07:00PM",
      isOngoing: false,
    },
    {
      title: "another meeting",
      locationText: "DH2020",
      startTimeText: "05:00PM",
      endTimeText: "07:00PM",
      isOngoing: true,
    },
  ];
  // const cards = children.map((task, ix) => (
  //         <li key={ix}>
  //         {/* <TaskCard
  //           title={task.title}
  //           locationText={task.locationText}
  //           startTimeText={task.startTimeText}
  //           endTimeText={task.endTimeText}
  //           isOngoing={task.isOngoing}
  //         /> */}
  //         abc
  //         </li>
  //       ));

  // console.log(cards);
  return (
    <div className={styles.bg}>
      <Calendar
        onChange={onDateChange}
        value={currDate}
        formatShortWeekday={dayLabelFormatter}
      />
      <p className={styles.calendarHeader}>
        {dailyTaskDateFormatter(currDate)}
      </p>
      <TaskCard
        title="GDSC Meeting"
        locationText="GDSC Meeting"
        startTimeText="GDSC Meeting"
        endTimeText="GDSC Meeting"
        isOngoing={false}
      />
      {/* <ul>
        {cards}
      </ul> */}
    </div>
  );
};

export default CalendarPage;
