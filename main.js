"use strict";
console.log("Our Meme site!");

var gImgs = [
  { id: 1, url: "img/1.png", keywords: ["Squeamish Seal"] },
  { id: 2, url: "img/2.png", keywords: ["The 300", "angry"] },
  { id: 3, url: "img/3.png", keywords: ["Angry Obama", "angry"] },
  { id: 4, url: "img/4.png", keywords: ["Schitzo Cat", "fear"] },
  {
    id: 5,
    url: "img/5.png",
    keywords: ["False Fact Nancy Grace", "surprised"]
  },
  { id: 6, url: "img/6.png", keywords: ["Captain Kirk Choking", "fear"] },
  { id: 7, url: "img/7.png", keywords: ["Tweet Of God", "God", "fear"] },
  { id: 8, url: "img/8.png", keywords: ["baby", "bored"] },
  { id: 9, url: "img/9.png", keywords: ["Businessman", "baby", "busy"] },
  { id: 10, url: "img/10.png", keywords: ["hate", "surprised"] },
  { id: 11, url: "img/11.png", keywords: ["happy", "bored"] },
  {
    id: 12,
    url: "img/12.png",
    keywords: ["happy", "spring break", "victory", "Businessman"]
  }
];

var gMeme = {
  selectedImgId: 3,
  txtIdx: 0,
  isURL: false,
  txts: [
    {
      line: "",
      size: 30,
      align: "left",
      color: "white",
      fontFamily: "Color Your World",
      xCoord: 30,
      yCoord: 30,
      shadow: "",
      shadowWidth: 0
    },
    {
      line: "",
      size: 30,
      align: "left",
      color: "white",
      fontFamily: "Color Your World",
      xCoord: 30,
      yCoord: 370,
      shadow: "",
      shadowWidth: 0
    }
  ]
};

var gAllKeywords = storeKeywords(gImgs);

var keyWordsAsAMap = findModes(gAllKeywords);
console.log(keyWordsAsAMap);
var canvas = document.querySelector("#image-canvas");
var ctx = canvas.getContext("2d");
///////////////////////////////////////////////////////////////////////////////////////////////////////////
init();
function init() {
  renderPics(gImgs);
  renderKeywords(keyWordsAsAMap);
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
function renderPics(images) {
  var strHtml = "";
  for (var i = 0; i < images.length; i++) {
    var image = images[i];
    strHtml += `
        <div class="image ">
        <img class="image${image.id}" src="${
      image.url
    }" onclick="toggleModal(this,${i})">
        </div>
        `;
  }
  var elImages = document.querySelector(".image-container");
  elImages.innerHTML = strHtml;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////
function printTxt2Canvas(text, idx) {
  gMeme.txtIdx = idx;
  gMeme.txts[idx].line = text.value;
  renderMeme();
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
function changeColor(color) {
  gMeme.txts[gMeme.txtIdx].color = color.value;
  renderMeme();
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////
function setTextAlign(align) {
  gMeme.txts[gMeme.txtIdx].align = align;
  gMeme.txts[gMeme.txtIdx].xCoord =
    align === "left" ? 30 : align === "center" ? 250 : 470;
  renderMeme();
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////
function toggleShadow(el) {
  el.classList.toggle("hide-shadow")
  var shadow = gMeme.txts[gMeme.txtIdx].shadow;
  if (shadow === "") {
    gMeme.txts[gMeme.txtIdx].shadow = "black"
    gMeme.txts[gMeme.txtIdx].shadowWidth = 8;
  } else {
    gMeme.txts[gMeme.txtIdx].shadow = ""
    gMeme.txts[gMeme.txtIdx].shadowWidth = 0;
  }
  // gMeme.txts[gMeme.txtIdx].shadow = (shadow === "white")? "red": "white";
  
  renderMeme();
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////
function changeFont(font) {
  gMeme.txts[gMeme.txtIdx].fontFamily = font.value;
  ctx.font = gMeme.txts[gMeme.txtIdx].size + "px" + " " + font.value;
  renderMeme();
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
function showFontSize(size) {
  gMeme.txts[gMeme.txtIdx].size = size.value;

  renderMeme();
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
function renderImgToCanvas(img) {
  var elImg = document.querySelector(".image" + img.id);
  canvas.height = elImg.naturalHeight;
  canvas.width = elImg.naturalWidth;
  ctx.drawImage(
    elImg,
    0,
    0,
    canvas.width,
    canvas.height
  );
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////
function searchItem(text) {
  var str = text.toLowerCase();

  var filtImgs = gImgs.filter(function(img) {
    return img.keywords.find(function(keyword) {
      return keyword.toLowerCase() === str;
    });
  });
  renderPics(filtImgs);
  if (!str) {
    renderPics(gImgs);
  } // else if (filtImgs.length === 0) alert("No matches found");
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
function toggleModal(el, imgIdx) {
  var elModal = document.querySelector(".modal");
  if (!elModal.classList.contains("modal-open")) {
    renderImgToCanvas(gImgs[imgIdx]);
    setGMemeDefault(imgIdx);
  }
  elModal.classList.toggle("modal-open");
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////

function storeKeywords() {
  var uniqueNums = [];
  for (var i = 0; i < gImgs.length; i++) {
    var img = gImgs[i].keywords;
    img.forEach(function(keyword) {
      uniqueNums.push(keyword);
    });
  }
  return uniqueNums;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
function setKeywordsSize(keyword) {
  if (keyWordsAsAMap[keyword] > 2) return "x-large";
  else if (keyWordsAsAMap[keyword] > 1) return "large";
  else if ((keyWordsAsAMap[keyword] = 1)) return "medium";
  else return "small";
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
function renderKeywords(keyWordsAsAMap) {
  var strHtml = "";
  for (var keyword in keyWordsAsAMap) {
    var size = setKeywordsSize(keyword);
    strHtml += `<div class="keyword ${size}" onclick="searchItem('${keyword}')">${keyword}</div>`;
  }
  var elImages = document.querySelector(".useful-keywords-container");
  elImages.innerHTML = strHtml;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////
function renderMeme() {
  var currImg = gImgs.find(function(img) {
    return img.id === gMeme.selectedImgId;
  });
  renderImgToCanvas(currImg);
  gMeme.txts.forEach(function(txt) {
    ctx.font = txt.size + "px" + " " + txt.fontFamily;
    ctx.fillStyle = txt.color;
    ctx.textAlign = txt.align;
    ctx.strokeStyle = txt.shadow;
    ctx.lineWidth = txt.shadowWidth;
    ctx.strokeText(txt.line, txt.xCoord, txt.yCoord);
    ctx.fillText(txt.line, txt.xCoord, txt.yCoord);
  });
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////
function downloadMeme(elLink) {
  var canvas = document.getElementById("image-canvas");
  var dataURL = canvas.toDataURL();
  elLink.href = dataURL;
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
function moveText(axis, symbol) {
  gMeme.txts[gMeme.txtIdx][axis] =
    symbol > 0
      ? gMeme.txts[gMeme.txtIdx][axis] + 10
      : gMeme.txts[gMeme.txtIdx][axis] - 10;
  renderMeme();
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////
function handleImage(e) {
  gMeme.isURL = true;  
  var reader = new FileReader();
  reader.onload = function(event) {
    var img = new Image();
    img.onload = function() {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(e.target.files[0]);
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////


// -------- Utils --------- //
function findModes(values) {
  var valuesAsAMap = values.reduce(function(accumulator, value) {
    if (accumulator[value] >= 1) accumulator[value]++;
    else accumulator[value] = 1;
    return accumulator;
  }, {});
  return valuesAsAMap;
}

function toggleMenu() {
  var mainMenu = document.getElementById("mainMenu");
  mainMenu.classList.toggle("open");
  var burger = document.querySelector(".burger");
  burger.classList.toggle("hide");
  var close = document.querySelector(".close");
  close.classList.toggle("show");
}

function getNextId(items) {
  var max = 0;
  items.forEach(function(item){
      if (item.id > max) max = item.id;
  })
  return max+1;
}

function setGMemeDefault(imgIdx) {
  var elInput1 = document.querySelector(".text-to-add-1");
  elInput1.value = "";
  var elInput2 = document.querySelector(".text-to-add-2");
  elInput2.value = "";
  var elColor = document.querySelector('input[type="color"]');
  elColor.value = "#ffffff";

  gMeme.selectedImgId = gImgs[imgIdx].id;
  gMeme.txts.forEach(function(txt) {
    txt.line = '';
    txt.size = 30;
    txt.align = 'left';
    txt.color = 'white';
    txt.fontFamily = 'Color Your World';
    txt.xCoord = 30;
    txt.yCoord = 30;
    txt.shadow = '';
    txt.shadowWidth = 0;
})
  gMeme.txts[1].yCoord = 370;
}

