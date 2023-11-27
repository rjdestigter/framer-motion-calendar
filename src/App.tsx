import {
  isSameDay,
  addDays,
  format,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { useState } from "react";
import "./styles.scss";
import classNames from "./Grid.module.scss";
import c from "classnames";
import { motion } from "framer-motion";

function getInitialDate() {
  const date = new Date();
  date.setDate(24);
  return startOfWeek(date);
}

const randomTitles = [
  "Lawn mowing",
  "Gardening",
  "Car washing",
  "House cleaning",
  "Dog walking",
  "Cat walking",
  "Dog walking",
  "Building",
];

const team = [
  { name: "John", color: "red" },
  { name: "Jane", color: "blue" },
  { name: "Joe", color: "green" },
  { name: "Jack", color: "orange" },
];


function getRandomTitle() {
  return randomTitles[Math.floor(Math.random() * randomTitles.length)];
}

function randomEvent() {
  const date = new Date(2023, 10, 1);
  date.setDate(Math.floor(Math.random() * 30) + 1);

  const start = new Date(date);
  start.setHours(Math.floor(Math.random() * 12));

  const end = new Date(start);
  end.setHours(start.getHours() + 1);

  return {
    id: Math.random(),
    start,
    end,
    title: getRandomTitle(),
    color: randomColor(),
    assignedTo: team[Math.floor(Math.random() * team.length)],
  };
}

const events = Array.from({ length: 50 }).map(randomEvent);

events.forEach(event => {
  console.log(event.start, event.end, event.title)
})
export default function App() {
  const [selectedDate, onSelectDate] = useState(getInitialDate);

  const [view, setView] = useState<"month" | "week" | "day">("month");

  const startDate =
    view === "month"
      ? startOfWeek(startOfMonth(selectedDate))
      : view === "week"
      ? startOfWeek(selectedDate)
      : selectedDate;

  return (
    <>
      <div>
        <h1>{format(selectedDate, "EEE MMM, dd yyyy")}</h1>
        <div>
          <button onClick={() => setView("month")}>Month</button>
          <button onClick={() => setView("week")}>Week</button>
          <button onClick={() => setView("day")}>Day</button>
        </div>
        <Grid startDate={startDate} view={view} onSelectDate={onSelectDate} />
      </div>
    </>
  );
}


type PropsGrid = {
  startDate: Date;
  onSelectDate: (date: Date) => void;
  view: "month" | "week" | "day";
};

function Grid({ view, startDate, onSelectDate }: PropsGrid) {
  const isMonthView = view === "month";
  const rows = isMonthView ? 6 : 1;
  const cols = view === "day" ? 1 : 7;
  const cells = Array.from({ length: rows * cols }).map((_, index) => {
    const date = addDays(startDate, index);

    if (view === "day") {
      const teams = team.map((member) => {
        return (
          <div className={classNames.resource}>
            <div>{member.name}</div>

            {events
              .filter(({ start, assignedTo }) => isSameDay(start, date) && member.name === assignedTo.name)
              .map((event) => {
                const duration = event.end.getTime() - event.start.getTime();
                const hours = duration / 1000 / 60 / 60;
                const height = hours * 100;
                const top =
                  ((event.start.getTime() - date.getTime()) / 1000 / 60 / 60) *
                  100;
                return (
                  <motion.div
                    layoutId={"" + event.id}
                    layout
                    animate={{ opacity: [0, 1] }}
                    key={event.id}
                    className={classNames.event}
                    style={{
                      backgroundColor: event.color,
                      color: getTextColor(event.color),
                      position: isMonthView ? "relative" : "absolute",
                      top: isMonthView ? 0 : top,
                      height: isMonthView ? "auto" : height,
                    }}
                  >
                    <motion.div layout>
                      <div>
                        <div>{event.title}</div>
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}

            {/*             
            {member.name === "John" && (
              <motion.div
                layoutId="event"
                layout
                animate={{ opacity: [0, 1] }}
                className={classNames.event}
                style={{
                  position: isMonthView ? "relative" : "absolute",
                  top: isMonthView ? 0 : 100,
                  height: isMonthView ? "auto" : 100,
                }}
              >
                <motion.div layout>
                  <div>
                    <div>Lawn mowing</div>
                    <div>By John</div>
                  </div>
                </motion.div>
              </motion.div>
            )} */}
          </div>
        );
      });

      return (
        <div
          role={"gridcell"}
          onClick={() => onSelectDate(date)}
          tabIndex={-1}
          data-date={format(date, "yyyyMMdd")}
          className={classNames.cell}
          key={date.getTime()}
        >
          {teams}
        </div>
      );
    }

    return (
      <div
        role={"gridcell"}
        onClick={() => onSelectDate(date)}
        tabIndex={-1}
        data-date={format(date, "yyyyMMdd")}
        className={classNames.cell}
        key={date.getTime()}
      >
        <motion.div
          className={classNames.content}
          key={date.getTime()}
          animate={{
            opacity: [0, 1],
          }}
        >
          {!isMonthView && <div>{format(date, "EEE ")}</div>}
          <div>{format(date, "d")}</div>
        </motion.div>

        {events
          .filter(({ start }) => isSameDay(start, date))
          .map((event) => {
            const duration = event.end.getTime() - event.start.getTime();
            const hours = duration / 1000 / 60 / 60;
            const height = hours * 100;
            const top = ((event.start.getTime() - date.getTime()) / 1000 / 60 / 60) * 100
            return (
              <motion.div
                layoutId={""+event.id}
                layout
                animate={{ opacity: [0, 1] }}
                key={event.id}
                className={classNames.event}
                style={{
                  backgroundColor: event.color,
                  color: getTextColor(event.color),
                  position: isMonthView ? "relative" : "absolute",
                  top: isMonthView ? 0 : top,
                  height: isMonthView ? "auto" : height,
                }}
              >
                <motion.div layout>
                  <div>
                    <div>{event.title}</div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}

        {/* {((view !== "day" && date.getDate() === 24) || (view === "day" && team[index].name === "John")) && ( */}
        {/* {date.getDate() === 24 && (
          <motion.div
            layoutId="event"
            layout
            animate={{ opacity: [0, 1] }}
            key={date.getTime()}
            className={classNames.event}
            style={{
              position: isMonthView ? "relative" : "absolute",
              top: isMonthView ? 0 : 100,
              height: isMonthView ? "auto" : 100,
            }}
          >
            <motion.div layout>
              <div>
                <div>Lawn mowing</div>
                <div>By John</div>
              </div>
            </motion.div>
          </motion.div>
        )} */}
      </div>
    );
  });

  return (
    <div
      className={c(
        classNames.container,
        classNames[view],
        !isMonthView && classNames.showHours
      )}
    >
      {!isMonthView && <Hours />}

      <div className={classNames.days}>{cells}</div>
    </div>
  );
}

function Hours() {
  const hours = Array.from({ length: 25 }).map((_, index) => {
    return (
      <div key={index} className={classNames.hour}>
        {index > 0 && format(new Date(0, 0, 0, index), "h aaa")}
      </div>
    );
  });

  return <div className={classNames.hours}>{hours}</div>;
}

function randomColor() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

function getTextColor(color: string) {
  const hex = color.replace("#", "");
  const r = parseInt(hex.substr(0, 2), 16); // Grab the hex representation of red (chars 1-2) and convert to decimal (base 10).
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  const yiq = (r * 299 + g * 587 + b * 114) / 1000; // http://en.wikipedia.org/wiki/YIQ
  return yiq >= 128 ? "black" : "white";
}