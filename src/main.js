import "./style.css";

const fileInput = document.querySelector("#file_input");
const canv = document.querySelector("#canv");
const textInput = document
  .querySelector("#text_manager")
  .querySelector("input");

const fontSizeElem = document.querySelector("#fontSize");
const colorPickerElem = document.querySelector(".color_picker");

const ctx = canv.getContext("2d");

canv.height = 800;
canv.width = 1200;
if (window.innerWidth < 1600) {
  canv.height = 500;
  canv.width = 800;
}

let offsetX = canv.getBoundingClientRect().left;
let offsetY = canv.getBoundingClientRect().top;
let startX;
let startY;
let selectedText = -1;
let memeImg = null;
let scaleX = 1;
let scaleY = 1;

function onUpload(e) {
  const file = e.target.files[0];
  const fileread = new FileReader();
  fileread.onload = function () {
    const img = new Image();
    img.src = fileread.result;
    img.onload = function () {
      ctx.scale(canv.width / img.width, canv.height / img.height);
      scaleX = canv.width / img.width;
      scaleY = canv.height / img.height;
      memeImg = img;
      ctx.drawImage(img, 0, 0);
    };
  };
  fileread.readAsDataURL(file);
}

fileInput.addEventListener("change", onUpload);

const textList = [];

function draw() {
  ctx.clearRect(0, 0, canv.width, canv.height);
  if (memeImg) {
    ctx.drawImage(memeImg, 0, 0);
  }
  for (let i = 0; i < textList.length; i++) {
    const text = textList[i];
    ctx.font = `${text.fontSize}px Arial`;
    ctx.fillStyle = `${text.color}`;
    console.log(ctx.color);
    ctx.fillText(text.text, text.x, text.y);
  }
}

function textHittest(x, y, textIndex) {
  const text = textList[textIndex];
  return (
    x / scaleX >= text.x &&
    x / scaleX <= text.x + text.width &&
    y / scaleY >= text.y - text.height &&
    y / scaleY <= text.y
  );
}

function handleMouseDown(e) {
  e.preventDefault();
  startX = parseInt(e.clientX - offsetX);
  startY = parseInt(e.clientY - offsetY);
  for (let i = 0; i < textList.length; i++) {
    if (textHittest(startX, startY, i)) {
      selectedText = i;
    }
  }
}

function handleMouseUp(e) {
  e.preventDefault();
  selectedText = -1;
}

function handleMouseOut(e) {
  e.preventDefault();
  selectedText = -1;
}

function handleMouseMove(e) {
  if (selectedText < 0) {
    return;
  }
  e.preventDefault();
  const mouseX = parseInt(e.clientX - offsetX);
  const mouseY = parseInt(e.clientY - offsetY);

  const dx = mouseX - startX;
  const dy = mouseY - startY;
  startX = mouseX;
  startY = mouseY;

  const text = textList[selectedText];
  text.x += dx / scaleX;
  text.y += dy / scaleY;
  draw();
}

const textBtn = document.querySelector("#text_manager").querySelector("button");

textBtn.addEventListener("click", () => {
  const fontSize = fontSizeElem.querySelector("#fontValue").innerText;
  ctx.font = `${fontSize}px Arial`;
  ctx.fillStyle = `${colorPickerElem.value}`;
  const text = {
    text: textInput.value,
    x: 300,
    y: 300,
    fontSize,
    color: colorPickerElem.value,
  };
  text.width = ctx.measureText(text.text).width;
  text.height = 60;
  ctx.fillText(text.text, text.x, text.y);
  textList.push(text);
});

canv.addEventListener("mousedown", (e) => handleMouseDown(e));
canv.addEventListener("mousemove", (e) => handleMouseMove(e));
canv.addEventListener("mouseup", (e) => handleMouseUp(e));
canv.addEventListener("mouseout", (e) => handleMouseOut(e));

const downloadBtn = document.querySelector("#download");
downloadBtn.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "download";
  link.href = canv.toDataURL(["image/png"]);
  link.click();
});

fontSizeElem.querySelector("#fontUp").addEventListener("click", () => {
  const value = fontSizeElem.querySelector("#fontValue").innerText;
  if (Number(value) < 100) {
    fontSizeElem.querySelector("#fontValue").innerHTML = Number(value) + 1;
  }
});

fontSizeElem.querySelector("#fontDown").addEventListener("click", () => {
  const value = fontSizeElem.querySelector("#fontValue").innerText;
  if (Number(value) > 2) {
    fontSizeElem.querySelector("#fontValue").innerText = Number(value) - 1;
  }
});
