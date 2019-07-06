'use strict';

const northHandElt = document.getElementById('northHand'),
    southHandElt = document.getElementById('southHand');
const directionElts = [
  document.getElementById('north'),
  document.getElementById('east'),
  document.getElementById('south'),
  document.getElementById('west'),
];
const auctionElt = document.getElementById('auction').tBodies[0];
let passElt, bidElts, explainElt;
let boardNumber = -1;
let deal, bids, ai;
let explanation;
let auctionCellElts;

function createControls() {
  bidElts = [];
  const controlsElt = document.getElementById('controls');
  {
    const button = document.createElement('button');
    button.classList.add('call');
    button.innerHTML = "P";
    button.title = "Pass";
    button.addEventListener('click', () => userCall(null));
    passElt = button;
    controls.appendChild(button);
  }
  {
    const button = document.createElement('button');
    button.classList.add('call');
    button.innerHTML = "X";
    button.title = "Double";
    button.disabled = true;
    controls.appendChild(button);
  }
  {
    const button = document.createElement('button');
    button.classList.add('call');
    button.innerHTML = "XX";
    button.title = "Redouble";
    button.disabled = true;
    controls.appendChild(button);
  }
  controls.appendChild(document.createElement('br'));
  for (let level = 1; level <= 7; ++level) {
    for (let strain = 0; strain <= 4; ++strain) {
      const button = document.createElement('button');
      button.classList.add('call');
      button.innerHTML = level + (strain === 4 ? 'N' : SUIT_HTML_STRING[strain]);
      button.title = 'Bid ' + level + ' ' + (strain === 4 ? ' no trump' : SUIT_NAME[strain] + (level === 1 ? '' : 's'));
      button.addEventListener('click', () => userCall(new Bid(level, strain)));
      bidElts.push(button);
      controls.appendChild(button);
    }
    controls.appendChild(document.createElement('br'));
  }
  {
    const button = document.createElement('button');
    button.innerHTML = "Redeal";
    button.addEventListener('click', () => redeal());
    controls.appendChild(button);
  }
  {
    const button = document.createElement('button');
    button.innerHTML = "Undo";
    button.disabled = true;
    controls.appendChild(button);
  }
  {
    const button = document.createElement('button');
    button.innerHTML = "Explain";
    button.disabled = true;
    button.addEventListener('click', () => alert(explanation));
    explainElt = button;
    controls.appendChild(button);
  }
}

function redeal() {
  ++boardNumber;
  deal = generateDeal();
  bids = [];
  ai = null;
  explanation = null;
  northHand.innerHTML = deal[0].toStringHtml();
  southHand.innerHTML = deal[2].toStringHtml();
  const vulnerability = getVulnerability();
  for (let i = 0; i < 4; ++i) {
    const vulnerable = (vulnerability & 1) && !(i & 1) || (vulnerability & 2) && (i & 1);
    directionElts[i].classList.remove('dealer', 'vulnerable', 'nonVulnerable');
    directionElts[i].classList.add(vulnerable ? 'vulnerable' : 'nonVulnerable');
  }
  directionElts[getDealer()].classList.add('dealer');
  auctionElt.innerHTML = '';
  newAuctionRow();
  setAuctionCell('?');
  for (const elt of bidElts)
    elt.disabled = false;
  makeAutomaticCalls();
}

function makeAutomaticCalls() {
  loop: while (true) {
    switch (getActivePlayer()) {
      case 2: break loop;
      case 0: aiCall(); break;
      default: makeCall(null);
    }
  }
  updateControls();
}

function aiCall() {
  const lastBid = bids.length >= 2 ? bids[bids.length - 2] : null;
  let result;
  if (ai) {
    result = ai.next(lastBid);
  } else {
    ai = smpConstructiveBid(deal[0], getVulnerability(), (4 - getDealer()) % 4, lastBid);
    result = ai.next();
  }
  if (result.done) {
    explanation = 'Mabel is confused.';
    makeCall(null);
    setTimeout(() => alert(explanation), 200);
    return;
  }
  makeCall(result.value[0]);
  explanation = result.value[1];
}

function userCall(call) {
  makeCall(call);
  makeAutomaticCalls();
}

function makeCall(call) {
  setAuctionCell(call ? call.toStringHtml() : 'P');
  bids.push(call);
  if (isFinished()) return;
  if (getActivePlayer() === 3) newAuctionRow();
  setAuctionCell('?');
}

function newAuctionRow() {
  auctionCellElts = [];
  const row = document.createElement('tr');
  for (let i = 0; i < 4; ++i) {
    const cell = document.createElement('td');
    auctionCellElts.push(cell);
    row.appendChild(cell);
  }
  auctionElt.appendChild(row);
}

function setAuctionCell(html) {
  auctionCellElts[(getActivePlayer() + 1) % 4].innerHTML = html;
}

function updateControls() {
  const finished = isFinished();
  let highest;
  passElt.disabled = finished;
  if (finished) {
    highest = 5 * 7 - 1;
  } else {
    highest = -1;
    for (const bid of bids)
      if (bid) highest = (bid.level - 1) * 5 + bid.strain;
  }
  for (let i = 0; i <= highest; ++i)
    bidElts[i].disabled = true;
  explainElt.disabled = explanation == null;
}

function getDealer() {
  return boardNumber % 4;
}

function getVulnerability() {
  return (boardNumber + Math.floor(boardNumber / 4)) % 4;
}

function getActivePlayer() {
  return (getDealer() + bids.length) % 4;
}

function isFinished() {
  if (bids.length < 4) return false;
  for (let i = bids.length - 3; i < bids.length; ++i)
    if (bids[i] != null) return false;
  return true;
}

createControls();
redeal();
