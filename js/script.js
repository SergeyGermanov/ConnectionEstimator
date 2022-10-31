// EDI & 3PL similar

let summary = document.querySelector("#summary");
let summaryString = "";
let showResult = document.querySelector("#result");
let showWeeks = document.querySelector("#weeks");
let colorComplexity = document.querySelector("#colorComplexity");
let colorWeeks = document.querySelector("#colorWeeks");
let client = document.querySelector("#clientName");
let connection = document.querySelector("#connectionName");
let ediMiddleNumber = 44.5;
let ediUpperNumber = 78;
let threeplMiddleNumber = 52;
let threeplUpperNumber = 90;

let colorFunc = (sum, color, middleNumber, upperNumber) => {
  sum <= middleNumber
    ? color.classList.add("green")
    : sum >= upperNumber
      ? color.classList.add("red")
      : color.classList.add("yellow");
};

let restFunc = (element, color) => {
  element.innerHTML = "";
  color.className = "ui small statistic";
};

let clipboardFunc = () => {
  let clipboardNames = document.querySelector("#clipboardNames").textContent;
  let clipboardText = document.querySelector("#clipboardText").innerHTML;
  let copyText = `${clipboardNames}\n${clipboardText.replaceAll("<br>", "\n")}`;

  function listener(e) {
    e.clipboardData.setData("text/html", copyText);
    e.clipboardData.setData("text/plain", copyText);
    e.preventDefault();
  }

  document.addEventListener("copy", listener);
  document.execCommand("copy");
  document.removeEventListener("copy", listener);
};

let createSummary = (checkbox, radio) => {
  let resultStr = "";
  let setArr = new Set();
  [...checkbox].map((el) => {
    setArr.add(el.dataset.title);
    setArr.add(el.dataset.name);
  });

  [kill, ...rest] = [...setArr].join("").split("!");

  [...radio].map((el) => (resultStr += `${el.dataset.name}<br/>`));

  resultStr += rest.join("<br/>");

  return resultStr;
};

let getDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.toLocaleString("default", { month: "short" });
  const day = date.getDate();

  return [day, month, year].join("-");
};

let showSummaryHTML = (
  div,
  resultString,
  client,
  connection,
  percent,
  weeks
) => {
  div.innerHTML = `<div class="ui positive message">
                               <a class="ui teal right corner label" onclick="clipboardFunc()">
                                <i class="copy link icon" ></i>
                               </a>                               
                                <div class="header" id="clipboardNames">${client} ${connection}</div>
                                <div id="clipboardText">${resultString}<br/>Date of estimation: ${getDate()}<br/>Complexity: ${percent} of 100%<br/>Weeks: ${weeks} of 12</div>
                             </div>`;
  resultString = "";
};