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
  { id: 7, url: "img/7.png", keywords: ["Tweet of God", "God", "fear"] },
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
  txts: [
    {
      line: "",
      size: 30,
      align: "left",
      color: "white",
      fontFamily: "Color Your World",
      xCoord: 30,
      yCoord: 30
    },
    {
      line: "",
      size: 30,
      align: "center",
      color: "white",
      fontFamily: "Color Your World",
      xCoord: 30,
      yCoord: 370
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
function changeFont(font) {
  gMeme.txts[gMeme.txtIdx].fontFamily = font.value;
  ctx.font = gMeme.txts[gMeme.txtIdx].size + "px" + " " + font.value;
  renderMeme();
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
function showFontSize(size) {
  gMeme.txts[gMeme.txtId].size = size.value;
  
  renderMeme();
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
function renderImgToCanvas(img) {
  console.log(img);
  var elImg = document.querySelector(".image" + img.id);
  canvas.height = elImg.naturalHeight;
  canvas.width = elImg.naturalWidth;
  ctx.drawImage(
    elImg,
    // 0,
    // 0,
    // elImg.naturalWidth,
    // elImg.naturalHeight,
    0,
    0,
    canvas.width,
    canvas.height
  );
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////
function searchItem(text) {
  // console.log('text');
  var str = text.toLowerCase();

  var filtImgs = gImgs.filter(function(img) {
    return img.keywords.find(function(keyword) {
      return keyword.toLowerCase() === str ;
    })
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
    setGMemeDefault(imgIdx)
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
  else if (keyWordsAsAMap[keyword] = 1) return "medium";
  else return "small";
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
function renderKeywords(keyWordsAsAMap) {
  var strHtml = "";
  for (var keyword in keyWordsAsAMap) {
    var size = setKeywordsSize(keyword);
    strHtml += `<span class="keyword ${size}" onclick="searchItem('${keyword}')">${keyword}</span>`;
  }
  var elImages = document.querySelector(".useful-keywords-container");
  elImages.innerHTML = strHtml;
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
///////////////////////////////////////////////////////////////////////////////////////////////////////////
function renderMeme() {
  var currImg = gImgs.find(function(img) {
    return img.id === gMeme.selectedImgId;
  });
  // console.log(ctx.fillStyle)
  renderImgToCanvas(currImg);
  gMeme.txts.forEach (function(txt) {
    // size
    ctx.font =  txt.size + "px" + " " + txt.fontFamily;
    // color
    ctx.fillStyle = txt.color;
    // writing the text
    ctx.fillText(txt.line, txt.xCoord, txt.yCoord);
  });
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
function dragItem() {
  // var x = event.clientX;     // Get the horizontal coordinate
  // var y = event.clientY;     // Get the vertical coordinate
  // var coor = 'X coords: ' + x + ', Y coords: ' + y;
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
    symbol > 0 ? gMeme.txts[gMeme.txtIdx][axis] + 10 : gMeme.txts[gMeme.txtIdx][axis] - 10;
  renderMeme();
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
function uploadImg() {
  var elFile = document.querySelector("input[type=file]").files[0];
  console.log(elFile);
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
function handleImage(e) {
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
function setGMemeDefault(imgIdx) {
  var elInput = document.querySelector(".text-to-add");
  elInput.value = "";
  gMeme.selectedImgId = gImgs[imgIdx].id;
  gMeme.txts[0].xCoord = 30;
  gMeme.txts[0].yCoord = 30;
}
