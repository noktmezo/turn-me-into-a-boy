// ==UserScript==
// @name         Turn Me Into A Boy
// @version      1.0
// @description  Turns turn-me-into-a-girl.com into turn-me-into-a-boy
// @author       u/noktmezo
// @match        https://turn-me-into-a-girl.com/*
// @match        https://platform.twitter.com/embed/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=turn-me-into-a-girl.com
// @grant        GM_addStyle
// ==/UserScript==

(function () {
  // stop if the twitter embed isn't inside turn-me-into-a-girl.com
  if (location.host === "platform.twitter.com" && document.referrer !== "https://turn-me-into-a-girl.com/")
      return;
      
  // marker to mark stuff that shouldn't be touched by following replacements
  const m = "\u200b";

  // the replacements which will be applied to all text nodes
  const map = {
    "boy": "girl",
    "\\bman(?!y)": "woman",
    "\\bmen(?!struat)": "women",
    "\\bmale": "female",
    "guy": "girl",
    "dude": "girl",
    "masculin": "feminin",
    "girl": "boy",
    "woman": "man",
    "women": "men",
    "female": "male",
    "feminin": "masculin",
    "“she": "“he",
    "“her": "“him",
    "find your assigned gender's clothing boring or unexpressive": `feel awkward or uncomfortable as a girl${m} in girl${m}s’ clothes`,
    " \\(“cute” or be seen as “soft” or “empathetic”\\)": "",
    "“cute”/": ""
  }

  // replace the history part
  const trendHeading = document.evaluate("//dt[text()='But being trans is a trend!']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  if (trendHeading)
    trendHeading.nextElementSibling.children[1].innerHTML = `
In the 500s, <a href="https://en.wikipedia.org/wiki/Anastasia_the_Patrician">Anastasia the Patrician</a> fled life in the court of <a href="https://en.wikipedia.org/wiki/Justinian_I">Justinian I</a> in Constantinople to spend twenty-eight years (until death) dressed as a male${m} monk in Egypt, coming to be viewed by some today as a transgender saint.
Coptic texts from that era (the fifth to ninth centuries), like texts from around Europe, tell of many female${m}-assigned people transitioning to live as men${m};
in one, a monastic named <a href="https://en.wikipedia.org/wiki/Legend_of_Hilaria">Hilaria</a> (child of Zeno) dresses as a man${m}, brings about a reduction in breast size and cessation of menstruation through asceticism, and comes to be accepted by fellow monks as a male${m}, Hilarion, and by some modern scholars as trans;
the story of <a href="https://en.wikipedia.org/wiki/Marina_the_Monk">Marinos (Marina)</a>, another Byzantine, who became a monk in Lebanon, is similar.
`;

  // replace text inside new nodes
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (!mutation.addedNodes) return;
      for (const node of mutation.addedNodes) {
        startReplacing(node);
      }
    }
  }).observe(document.body, { childList: true, subtree: true, attributes: false, characterData: false });

  startReplacing();

  function startReplacing(contextNode = document.body) {
    replaceTextNodes(contextNode);

    // remove final markers after a short delay
    setTimeout(() => replaceTextNodes(contextNode, { [m]: ""}, false), 500);
  }

  function replaceTextNodes(contextNode, otherMap = map, addFinalMarker = true) {
    const treeWalker = document.createTreeWalker(contextNode, NodeFilter.SHOW_TEXT);
    let node;
    while (node = treeWalker.nextNode()) {
      for (const key in otherMap)
        node.textContent = node.textContent.replace(
          new RegExp(key + `(?![${m}]+)`, "gi"),
          otherMap[key] + (addFinalMarker ? m : "")
        );
    }
  }

  // replace the text in the browser tab
  document.title = "💖 Turn Me Into A Boy! 💖";

  // replace the image
  const leadImg = document.querySelector(".lead-img");
  if (leadImg)
    leadImg.src = "https://i.imgur.com/1aTl7FD.png";

  // make everything blue
  GM_addStyle(`
h1, h2, h3, h4, h5, h6, dt, a {
  color: #42a5f5;
}

a:hover {
  color: #1976d2;
}

strong {
  background: #eeffff;
}

.bgcol strong {
  background: #e3f2fd;
}

.epithet {
  max-width: 710px !important;
}

.epithet > h1 {
  background: #eeffff;
  box-shadow: -2em 0 0 0 #eeffff, 2em 0 0 0 #eeffff;
}

.bgcol {
  background: #eeffff;
}

.btn {
  border-color: #42a5f5;
  color: #42a5f5;
}

.btn.tmiag {
  background: #42a5f5;
  box-shadow: 0 0 0 4px #42a5f5, 2px 2px 15px 8px #eeffff;
}
.btn.tmiag:hover, .btn.tmiag:active {
  background: #64b5f6;
  box-shadow: 0 0 0 4px #64b5f6, 0 0 0 18px #fff;
}

@media (max-width: 991.98px) {
  .btn.tmiag {
      box-shadow: 0 0 0 2px #42a5f5;
  }
}

.particle {
  background: #42a5f5;
}

img[src="https://upload.wikimedia.org/wikipedia/commons/f/f9/Bodoni_Ornaments_%C2%A3_01.svg"], img[src="https://upload.wikimedia.org/wikipedia/commons/d/de/Deco_pag5.svg"] {
  filter: contrast(0) sepia(1) hue-rotate(184deg) brightness(1.5) !important;
}

.wide-progress-bar .fa-heart {
  color: #42a5f5 !important;
}

.pop-appear .fa-heart {
  color: #ffc1e3 !important;
}
  `);
})();
