const startDate = new Date(1800, 0, 1).getTime();
const endDate = new Date(2100, 11, 31).getTime();
const daysOfWeek = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];
const monthsDict = {
  1: "January",
  2: "February",
  3: "March",
  4: "April",
  5: "May",
  6: "June",
  7: "July",
  8: "August",
  9: "September",
  10: "October",
  11: "November",
  12: "December",
};
const centuryIndex = { 18: 5, 19: 3, 20: 2, 21: 0 };
const doomsdaysMonth = {
  1: 3,
  2: 14,
  3: 7,
  4: 4,
  5: 9,
  6: 6,
  7: 11,
  8: 8,
  9: 5,
  10: 10,
  11: 7,
  12: 12,
};
const doomsdaysMonthLeapYear = { ...doomsdaysMonth, 1: 4, 2: 15 };

let randomTime;
let randomDate;
let startTimestamp;
let rightAnswer;

let awaitsInput = false;

function gbid(id) {
  return document.getElementById(id);
}

let _date_display = gbid("date_title");
let _answer_buttons = daysOfWeek.map((d, i) => {
  let u = gbid(d);
  u.addEventListener("click", () => {
    respond(i);
  });
  return u;
});
let _comment = gbid("comment");
let _time = gbid("time");
let _feedback_viewer = gbid("feedback_viewer");
let _next_container = gbid("next_container");
let _alg_reconstruction = gbid("alg_reconstruction");

function resetEverything() {
  feedbackList = [];
  _alg_reconstruction.innerHTML = "";
  _answer_buttons.forEach((e) => {
    e.classList.remove("disabledButton");
    e.classList.remove("correctAnswer");
    e.classList.remove("wrongAnswer");
  });
  _feedback_viewer.style.display = "";
  _next_container.style.display = "";
  _time.innerText = "";
  _comment.innerText = "";

  randomTime = startDate + Math.random() * (endDate - startDate);
  randomDate = new Date(randomTime);

  startTimestamp = Date.now();

  rightAnswer = randomDate.getDay();
  console.log(rightAnswer);

  _date_display.innerText = randomDate.toISOString().slice(0, 10);
  awaitsInput = true;
}

let feedbackList = [];
function clickStep(el, id) {
  el.classList.toggle("selected");

  const index = feedbackList.indexOf(id);
  if (index === -1) {
    feedbackList.push(id);
  } else {
    feedbackList.splice(index, 1);
  }
  console.log(feedbackList);
}

function addStep(title, id) {
  let m = document.createElement("div");
  m.classList.add("step");
  m.setAttribute("id", `step_${id}`);
  m.innerText = title;
  m.addEventListener("click", () => {
    clickStep(m, id);
  });
  _alg_reconstruction.appendChild(m);
}

function reconstructAlgorithm() {
  let bigYear = randomDate.getFullYear();
  let smallYear = bigYear % 100;

  let afterStep1;
  if (smallYear % 2 == 0) {
    addStep(`${smallYear} is even, so we don't add 11`, "first-add-11");
    afterStep1 = smallYear;
  } else {
    afterStep1 = smallYear + 11;
    addStep(
      `${smallYear} is odd, so we add 11 to it : ${afterStep1}`,
      "first-add-11"
    );
  }

  let afterStep2 = afterStep1 / 2;
  addStep(
    `We then divide ${afterStep1} by two, to get ${afterStep2}`,
    "divide-two"
  );

  let afterStep3;
  if (afterStep2 % 2 == 0) {
    addStep(`${afterStep2} is even, so we don't add 11`, "second-add-11");
    afterStep3 = afterStep2;
  } else {
    afterStep3 = afterStep2 + 11;
    addStep(
      `${afterStep2} is odd, so we add 11 to it : ${afterStep3}`,
      "first-add-11"
    );
  }

  let higherMultiple =
    afterStep3 % 7 == 0 ? afterStep3 : afterStep3 + 7 - (afterStep3 % 7);
  addStep(
    `The closest higher multiple of 7 to ${afterStep3} is ${higherMultiple}`,
    "higher-multiple"
  );

  let difference = higherMultiple - afterStep3;
  addStep(
    `So the difference is ${higherMultiple} - ${afterStep3} = ${difference}`,
    "difference"
  );
  let century = Math.floor(bigYear / 100);
  addStep(
    `The century index for the ${century}00s is ${centuryIndex[century]}`,
    "century-index"
  );

  let yearDoomsday = (centuryIndex[century] + difference) % 7;
  addStep(
    `By adding the century index to the difference : ${difference} + ${centuryIndex[century]} = ${yearDoomsday}`,
    "add-century"
  );

  let month = randomDate.getMonth() + 1;
  let isLeapYear;

  if (bigYear % 4 == 0) {
    if (bigYear % 100 == 0) {
      if (bigYear % 400 == 0) {
        addStep(
          `${bigYear} is a leap year because it is a century divisible by 400.`,
          "leap-century-400"
        );
        isLeapYear = true;
      } else {
        addStep(
          `${bigYear} is not a leap year because it is a century.`,
          "noleap-century-100"
        );
        isLeapYear = false;
      }
    } else {
      addStep(`${bigYear} is a leap year.`, "leap-normal");
      isLeapYear = true;
    }
  } else {
    addStep(`${bigYear} is not a leap year.`, "noleap-normal");
    isLeapYear = false;
  }
  let monthDoomsday = isLeapYear
    ? doomsdaysMonthLeapYear[month]
    : doomsdaysMonth[month];
  addStep(
    `A know doomsday for month ${monthsDict[month]} is the ${monthDoomsday}${
      monthDoomsday <= 3
        ? monthDoomsday <= 2
          ? monthDoomsday == 1
            ? "st"
            : "nd"
          : "rd"
        : "th"
    }`,
    "doomsday-month"
  );

  let day = randomDate.getDate();
  let dayDifference = day - monthDoomsday;
  addStep(
    `${day} - ${monthDoomsday} = ${dayDifference} days are between these two dates`,
    "day-difference"
  );

  let sumDifferenceDoomsday = dayDifference + yearDoomsday;
  addStep(
    `We therefore add this difference to the doomsday ${dayDifference} + ${yearDoomsday} = ${sumDifferenceDoomsday}`,
    "sum-difference-doomsday"
  );

  let answer = (sumDifferenceDoomsday + 14) % 7;
  addStep(`Modulo 7, that is ${answer}`, "final-mod");

  addStep(`The day is a ${daysOfWeek[answer]}`, "number-to-day");
}

let givenAnswer;
let delta;
function respond(dayClicked) {
  if (awaitsInput) {
    givenAnswer = dayClicked;
    awaitsInput = false;

    let _right_answer_button = _answer_buttons[rightAnswer];
    _right_answer_button.classList.add("correctAnswer");

    _answer_buttons.forEach((e) => {
      e.classList.add("disabledButton");
    });

    let endTimestamp = Date.now();
    delta = (endTimestamp - startTimestamp) / 1000;

    if (rightAnswer == dayClicked) {
      _comment.innerText = "That's very impressive!";
    } else {
      let _failed_answer_button = _answer_buttons[dayClicked];
      _failed_answer_button.classList.add("wrongAnswer");
      _comment.innerText = "Better luck next time!";
    }
    _time.innerText = delta.toFixed(2);

    reconstructAlgorithm();

    _feedback_viewer.style.display = "block";
    _next_container.style.display = "flex";
  }
}

resetEverything();

function readLog() {
  let k = localStorage.getItem("exercice-log");
  return k == null ? [] : JSON.parse(k);
}

gbid("next").addEventListener("click", () => {
  let v = readLog();

  v.push({
    date: randomDate.toISOString().slice(0, 10),
    playedAt: new Date().getTime(),
    timeTaken: delta.toFixed(2),
    expectedAnswer: rightAnswer,
    givenAnswer: givenAnswer,
    errorsMade: feedbackList,
  });

  localStorage.setItem("exercice-log", JSON.stringify(v));

  resetEverything();
});

function downloadData() {
  let data = readLog();
  if (localStorage.getItem("exercice-log") == null) {
    data = [];
  } else {
    data = JSON.parse(localStorage.getItem("exercice-log"));
  }

  const jsonString = JSON.stringify(data, null, 2);

  const blob = new Blob([jsonString], { type: "application/json" });

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = new Date().toISOString() + "-data.json";
  a.style.display = "none";

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
gbid("download").addEventListener("click", downloadData);
