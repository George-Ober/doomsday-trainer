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
let myChart;

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
  let captureGroups = randomDate
    .toISOString()
    .match(/(\d{4})-(\d{2})-(\d{2})T\d{2}:\d{2}:\d{2}/);
  let bigYear = parseInt(captureGroups[1]);
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
      "second-add-11"
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

  let month = parseInt(captureGroups[2]);
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

  let day = parseInt(captureGroups[3]);
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
  return answer;
}

let givenAnswer;
let delta;
function respond(dayClicked) {
  if (awaitsInput) {
    givenAnswer = dayClicked;
    awaitsInput = false;

    let endTimestamp = Date.now();
    delta = (endTimestamp - startTimestamp) / 1000;

    rightAnswer = reconstructAlgorithm();

    let _right_answer_button = _answer_buttons[rightAnswer];
    _right_answer_button.classList.add("correctAnswer");

    _answer_buttons.forEach((e) => {
      e.classList.add("disabledButton");
    });

    if (rightAnswer == dayClicked) {
      _comment.innerText = "That's very impressive!";
    } else {
      let _failed_answer_button = _answer_buttons[dayClicked];
      _failed_answer_button.classList.add("wrongAnswer");
      _comment.innerText = "Better luck next time!";
    }
    _time.innerText = delta.toFixed(2);

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
gbid("download_btn").addEventListener("click", downloadData);

let _modal = gbid("my_modal");

let _stats_btn = gbid("open_stats");

let _close_btn = gbid("close_btn");

_stats_btn.onclick = function () {
  document.body.style.overflow = "hidden";
  _modal.classList.add("open");
  _modal.style.display = "block";
  document.querySelector(".modal-content").classList.add("open");

  const data = readLog();

  // Worst day
  let worstDayCounters = [0, 0, 0, 0, 0, 0, 0];
  let centuryCounters = [0, 0, 0, 0];

  let correctTimes = [];
  let q = 1;
  for (let i = 0; i < data.length; i++) {
    const element = data[i];
    if (element.expectedAnswer === element.givenAnswer) {
      correctTimes.push({
        x: q,
        y: parseFloat(element.timeTaken),
        date: element.date,
        playedAt: new Date(element.playedAt).toLocaleString(),
      });
      q++;

      let century = Math.floor(
        parseInt(element.date.match(/(\d{4})-\d{2}-\d{2}/)[0]) / 100
      );
      centuryCounters[century % 4] += 1;
    } else {
      worstDayCounters[element.expectedAnswer] += 1;
    }
  }

  let worstDay = findHighestValueAndPercentage(worstDayCounters);
  gbid("worstday").innerText = daysOfWeek[worstDay.highestIndex];
  gbid("worstday_failures").innerText = `with ${
    worstDayCounters[worstDay.highestIndex]
  } failures`;

  gbid("number_games").innerText = data.length;
  gbid("number_succeeded").innerText = correctTimes.length;

  let bestCentury =
    correctTimes.length >= 1
      ? findHighestValueAndPercentage(centuryCounters)
      : { highestIndex: 0, percentage: "0%" };
  gbid("preferred_century").innerText = `${
    ((bestCentury.highestIndex + 2) % 4) + 18
  }00s`;
  gbid(
    "preferred_century_percentage"
  ).innerText = `with on avg. ${bestCentury.percentage} better accuracy`;

  if (correctTimes.length >= 2) {
    const lastTenAverages = [];

    for (let i = 0; i < correctTimes.length; i++) {
      if (i < 10) {
        // Calculate the average of all items since the beginning
        const sum = correctTimes
          .slice(0, i + 1)
          .reduce((acc, val) => acc + val.y, 0);
        lastTenAverages[i] = { x: i + 1, y: sum / (i + 1) };
      } else {
        // Calculate the average of items from i - 10 to i
        const sum = correctTimes
          .slice(i - 9, i + 1)
          .reduce((acc, val) => acc + val.y, 0);
        lastTenAverages[i] = { x: i + 1, y: sum / 10 };
      }
    }

    gbid("avg10").innerText = `${
      Math.round(lastTenAverages[lastTenAverages.length - 1].y * 10) / 10
    }s`;

    // Get the canvas element
    var ctx = document.getElementById("my_chart").getContext("2d");

    // Create the chart
    myChart = new Chart(ctx, {
      type: "scatter",
      data: {
        datasets: [
          {
            label: "Times when Succeeded",
            data: correctTimes,
            type: "scatter",
            tooltip: {
              callbacks: {
                beforeLabel: function (context) {
                  return `Time: ${context.raw.y}`;
                },
                afterLabel: function (context) {
                  return `Date: ${context.raw.date}`;
                },
                label: function (context) {
                  return `Played At: ${context.raw.playedAt}`;
                },
              },
            },
          },
          {
            label: "Average of 10",
            data: lastTenAverages,
            type: "line",
          },
        ],
      },
      options: {
        scales: {
          x: {
            type: "linear",
            display: false,
          },
          y: {
            type: "linear",
          },
        },
        plugins: {
          tooltip: {
            mode: "nearest",
            intersect: false,
          },
        },
      },
    });
  }
};
function findHighestValueAndPercentage(arr) {
  const sum = arr.reduce((acc, val) => acc + val, 0);

  const highestIndex = arr.indexOf(Math.max(...arr));

  const highestValue = arr[highestIndex];
  const percentage = Math.round((highestValue / sum) * 100);

  return { highestIndex, percentage: `${percentage}%` };
}

function closeModal() {
  document.body.style.overflow = "auto";
  _modal.classList.add("close");
  document.querySelector(".modal-content").classList.add("close");
  setTimeout(function () {
    _modal.style.display = "none";
    _modal.classList.remove("open", "close");
    document.querySelector(".modal-content").classList.remove("open", "close");
  }, 300);
  myChart.destroy();
}

_close_btn.onclick = function () {
  closeModal();
};

window.onclick = function (event) {
  if (event.target == _modal) {
    closeModal();
  }
};
