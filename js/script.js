let summary = document.querySelector("#summary");
let summaryString = "";
let showResult = document.querySelector("#result");
let showWeeks = document.querySelector("#weeks");
let colorComplexity = document.querySelector("#colorComplexity");
let colorWeeks = document.querySelector("#colorWeeks");
let client = document.querySelector("#clientName");
let connection = document.querySelector("#connectionName");
let inputDivStandard = document.querySelector("#textStandard");
let inputValueStandard = document.querySelector("#textStandard input");
let standardsRadio = document.querySelectorAll("input[name='Standards']");
let othersMsgRadio = document.querySelector(
    "input[data-name='EDI Standards/Versions: Others']"
);
let inputDivExtraMessage = document.querySelector("#textExtraMessage");
let inputValueExtraMessage = document.querySelector(
    "#textExtraMessage input"
);
let extraMsgCheckbox = document.querySelector(
    "input[data-name='|| Extra message ']"
);

let checkIfRadio = (element) => {
    return element.type === "radio"
        ? element.dataset.name === "EDI Standards/Versions: Others"
        : element.checked;
};

let hideInput = (check, input) => {
    checkIfRadio(check)
        ? input.classList.remove("disabled")
        : input.classList.add("disabled");
};

extraMsgCheckbox.addEventListener("change", (event) => {
    hideInput(event.target, inputDivExtraMessage);
});

standardsRadio.forEach((el) => {
    el.addEventListener("change", (event) => {
        hideInput(event.target, inputDivStandard);
    });
});

let extraInputValueAdd = (check, input, message) => {
    return checkIfRadio(check)
        ? summaryString.replace(message, `${message} ${input.value}`)
        : summaryString;
};

let colorFunc = (sum, color) => {
    sum <= 40
        ? color.classList.add("green")
        : sum >= 70
            ? color.classList.add("red")
            : color.classList.add("yellow");
};

let restFunc = (element, color) => {
    element.innerHTML = "";
    color.className = "ui small statistic";
};

let clipboardFunc = () => {
    let clipboardNames =
        document.querySelector("#clipboardNames").textContent;
    let clipboardText = document.querySelector("#clipboardText").innerHTML;
    let copyText = `${clipboardNames}\n${clipboardText.replaceAll(
        "<br>",
        "\n"
    )}`;

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

    return [day, month, year].join('-');
};

document.querySelector("#btn").onclick = function () {
    let markedCheckbox = document.querySelectorAll(
        'input[type="checkbox"]:checked'
    );
    let markedRadio = document.querySelectorAll(
        'input[type="radio"]:checked'
    );
    restFunc(showResult, colorComplexity);
    restFunc(showWeeks, colorWeeks);

    let resultsArr = [...markedRadio, ...markedCheckbox].map((el) =>
        Number(el.value)
    );

    let totalComplexity = resultsArr.reduce((a, b) => a + b, 0);
    let totalWeeks = (totalComplexity / 9.2).toFixed(1);

    colorFunc(totalComplexity, colorComplexity);
    colorFunc(totalComplexity, colorWeeks);

    let percentage = `${Math.ceil((totalComplexity / 110) * 100)}%`;

    showResult.innerHTML = percentage;
    showWeeks.innerHTML = totalWeeks;

    summaryString = createSummary(markedCheckbox, markedRadio);
    summaryString = extraInputValueAdd(
        othersMsgRadio,
        inputValueStandard,
        "EDI Standards/Versions: Others"
    );
    summaryString = extraInputValueAdd(
        extraMsgCheckbox,
        inputValueExtraMessage,
        "Extra message"
    );

    summary.innerHTML = `<div class="ui positive message">
                       <a class="ui teal right corner label" onclick="clipboardFunc()">
                        <i class="copy link icon" ></i>
                       </a>
                        <div class="header" id="clipboardNames">${client.value} ${connection.value}</div>
                        <div id="clipboardText">${summaryString}<br/>Date of estimation: ${getDate()}<br/>Complexity: ${percentage} of 100%<br/>Weeks: ${totalWeeks} of 12</div>
                     </div>`;

    summaryString = "";
};