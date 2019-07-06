'use strict';

function sameValueZero(lhs, rhs) {
  return lhs === rhs || Number.isNaN(lhs) && Number.isNaN(rhs);
}

Array.equals = function(lhs, rhs, comparator = sameValueZero) {
  const length = lhs.length;
  if (rhs.length !== length) return false;
  for (let i = 0; i < length; ++i)
    if (!comparator(lhs[i], rhs[i])) return false;
  return true;
}

Array.prototype.contains = function(value, comparator = sameValueZero) {
  return this.findIndex(_ => comparator(_, value)) !== -1;
}

const Op = {
  strictEq: (a, b) => a === b,
  strictNeq: (a, b) => a !== b,
  eq: (a, b) => a == b,
  neq: (a, b) => a != b,
  lt: (a, b) => a < b,
  le: (a, b) => a <= b,
  gt: (a, b) => a > b,
  ge: (a, b) => a >= b,
  plus: (a, b) => a + b,
  minus: (a, b) => a - b,
  times: (a, b) => a * b,
  divide: (a, b) => a / b,
};

const ESC = String.fromCharCode(0x1B);
const CSI = ESC + '[';
const Ansi = {
  default: CSI + 'm',
  visibility: {
    visible: CSI + '28m',
    hidden: CSI + '8m',
  },
  weight: {
    light: CSI + '2m',
    normal: CSI + '22m',
    bold: CSI + '1m',
  },
  style: {
    normal: CSI + '23m',
    italic: CSI + '3m',
    fraktur: CSI + '20m',
  },
  highlight: {
    off: CSI + '27m',
    on: CSI + '7m',
  },
  blink: {
    off: CSI + '25m',
    slow: CSI + '5m',
    fast: CSI + '6m',
  },
  underline: {
    off: CSI + '24m',
    single: CSI + '4m',
    double: CSI + '21m',
  },
  strikethrough: {
    off: CSI + '29m',
    on: CSI + '9m',
  },
  overline: {
    off: CSI + '55m',
    on: CSI + '53m',
  },
  border: {
    off: CSI + '54m',
    framed: CSI + '51m',
    encircled: CSI + '52m',
  },
  ideogram: {
    off: CSI + '65m',
    underline: CSI + '60m',
    doubleUnderline: CSI + '61m',
    overline: CSI + '62m',
    doubleOverline: CSI + '63m',
    stressMarking: CSI + '64m',
  },
  font: {
    default: CSI + '10m',
    alternative1: CSI + '11m',
    alternative2: CSI + '12m',
    alternative3: CSI + '13m',
    alternative4: CSI + '14m',
    alternative5: CSI + '15m',
    alternative6: CSI + '16m',
    alternative7: CSI + '17m',
    alternative8: CSI + '18m',
    alternative9: CSI + '19m',
  },
  foreground: {
    default: CSI + '39m',
    black: CSI + '30m',
    red: CSI + '31m',
    green: CSI + '32m',
    yellow: CSI + '33m',
    blue: CSI + '34m',
    magenta: CSI + '35m',
    cyan: CSI + '36m',
    white: CSI + '37m',
    brightBlack: CSI + '90m',
    brightRed: CSI + '91m',
    brightGreen: CSI + '92m',
    brightYellow: CSI + '93m',
    brightBlue: CSI + '94m',
    brightMagenta: CSI + '95m',
    brightCyan: CSI + '96m',
    brightWhite: CSI + '97m',
  },
  background: {
    default: CSI + '49m',
    black: CSI + '40m',
    red: CSI + '41m',
    green: CSI + '42m',
    yellow: CSI + '43m',
    blue: CSI + '44m',
    magenta: CSI + '45m',
    cyan: CSI + '46m',
    white: CSI + '47m',
    brightBlack: CSI + '100m',
    brightRed: CSI + '101m',
    brightGreen: CSI + '102m',
    brightYellow: CSI + '103m',
    brightBlue: CSI + '104m',
    brightMagenta: CSI + '105m',
    brightCyan: CSI + '106m',
    brightWhite: CSI + '107m',
  },
};

const Suit = {
  CLUBS: 0,
  DIAMONDS: 1,
  HEARTS: 2,
  SPADES: 3,
};

const SUIT_STRING = 'CDHS';
const SUIT_UNICODE_STRING = '♣♦♥♠';
const SUIT_ANSI_STRING = [
  Ansi.foreground.brightGreen + '♣' + Ansi.foreground.default,
  Ansi.foreground.brightYellow + '♦' + Ansi.foreground.default,
  Ansi.foreground.brightRed + '♥' + Ansi.foreground.default,
  Ansi.foreground.brightBlue + '♠' + Ansi.foreground.default,
];
const SUIT_HTML_STRING = [
  '<span class="club">♣</span>',
  '<span class="diamond">♦</span>',
  '<span class="heart">♥</span>',
  '<span class="spade">♠</span>',
];
const SUIT_NAME = [
  'club', 'diamond', 'heart', 'spade',
];

const Rank = {
  TWO: 0,
  THREE: 1,
  FOUR: 2,
  FIVE: 3,
  SIX: 4,
  SEVEN: 5,
  EIGHT: 6,
  NINE: 7,
  TEN: 8,
  JACK: 9,
  QUEEN: 10,
  KING: 11,
  ACE: 12,
};

const RANK_STRING = '23456789TJQKA';

const Strain = {
  CLUBS: 0,
  DIAMONDS: 1,
  HEARTS: 2,
  SPADES: 3,
  NO_TRUMP: 4,
};

const STRAIN_STRING = 'CDHSN';

class Card {
  constructor(suit, rank) {
    this.suit = suit;
    this.rank = rank;
  }
  hcp() {
    return Math.max(0, this.rank - Rank.TEN);
  }
  toString() {
    return SUIT_STRING[this.suit] + RANK_STRING[this.rank];
  }
  toStringUnicode() {
    return SUIT_UNICODE_STRING[this.suit] + RANK_STRING[this.rank];
  }
  toStringAnsi() {
    return SUIT_ANSI_STRING[this.suit] + RANK_STRING[this.rank];
  }
  toCharacterUnicode() {
    const baseCodePoint = 0x1F0A0;
    const rank = (() => {
      switch (this.rank) {
        default:         return this.rank + 2;
        case Rank.QUEEN: return 13;
        case Rank.KING:  return 14;
        case Rank.ACE:   return 1;
      }
    })();
    return String.fromCodePoint(baseCodePoint + (3 - this.suit << 4) + rank);
  }
  toCharacterAnsi() {
    const color = (() => {
      switch (this.suit) {
        case Suit.CLUBS:    return Ansi.foreground.brightBlack;
        case Suit.DIAMONDS: return Ansi.foreground.yellow;
        case Suit.HEARTS:   return Ansi.foreground.red;
        case Suit.SPADES:   return Ansi.foreground.black;
      }
    })();
    return Ansi.background.brightWhite + color + this.toCharacterUnicode() + Ansi.background.default + Ansi.foreground.default;
  }
}

class Hand {
  constructor() {
    this.cards = [];
  }
  get size() {
    return this.cards.length;
  }
  hcp() {
    return this.cards.map(_ => _.hcp()).reduce(Op.plus, 0);
  }
  shape() {
    const result = Array(4).fill(0);
    this.cards.map(_ => _.suit).forEach(_ => ++result[_]);
    return result;
  }
  sortedShape() {
    return this.shape().sort(Op.minus).reverse();
  }
  labeledShape() {
    return [...this.shape().entries()].sort(([i1, l1], [i2, l2]) => {
      if (l1 > l2) return -1;
      if (l1 < l2) return 1;
      return i2 - i1;
    });
  }
  isBalanced() {
    return [[5, 3, 3, 2], [4, 4, 3, 2], [4, 3, 3, 3]].contains(this.sortedShape(), Array.equals);
  }
  bySuit() {
    const result = Array(4).fill().map(_ => []);
    this.cards.forEach(_ => result[_.suit].push(_.rank));
    result.forEach(_ => _.sort(Op.minus).reverse());
    return result;
  }
  add(suit, rank) {
    this.cards.push(new Card(suit, rank));
  }
  toString() {
    const suitString = suit => suit.length ? suit.map(_ => RANK_STRING[_]).join('') : '-';
    return this.bySuit().reverse().map(suitString).join('|');
  }
  toStringAnsi() {
    const suitString = suit => suit.length ? suit.map(_ => RANK_STRING[_]).join('') : '―';
    return this.bySuit().reverse().map((suit, index) => SUIT_ANSI_STRING[3 - index] + ' ' + suitString(suit)).join('\n');
  }
  toStringHtml() {
    const suitString = suit => suit.length ? suit.map(_ => RANK_STRING[_]).join('') : '―';
    return this.bySuit().reverse().map((suit, index) => SUIT_HTML_STRING[3 - index] + ' ' + suitString(suit)).join('<br/>');
  }
  static parse(string) {
    const result = new Hand;
    const bySuit = string.split('|');
    if (bySuit.length !== 4) return;
    for (let suit = 0; suit < 4; ++suit) {
      for (const card of bySuit[suit].split('')) {
        const rank = RANK_STRING.indexOf(card.toUpperCase());
        if (rank === -1) return;
        result.add(3 - suit, rank);
      }
    }
    return result;
  }
}

class Bid {
  constructor(level, strain) {
    this.level = level;
    this.strain = strain;
  }  
  toStringHtml() {
    return this.level + (this.strain === 4 ? 'N' : SUIT_HTML_STRING[this.strain]);
  }
}

function* smpConstructiveBid(hand, vulnerability, seat, initialBid) {
  const hcp = hand.hcp();
  const response = function*(passedHand, openingBid) {
    // Responding.
    if (openingBid.level === 1 && openingBid.strain === Strain.CLUBS) {
      if (hcp <= 7) {
        yield [new Bid(1, Strain.DIAMONDS), '0-7 HCP'];
        return;
      }
      if (hcp <= 11 && !passedHand) {
        yield [new Bid(1, Strain.HEARTS), '8-11 HCP'];
        return;
      }
      // TODO
      return;
    }
  };
  if (!initialBid) {
    // Opening.
    const balanced = hand.isBalanced();
    // TODO: 10-point upgrades.
    if (hcp < 11) {
      // TODO: Pre-empts.
      const bid = yield [null, '0-10 HCP'];
      // Responding as passed hand.
      yield* response(true /* passedHand */, bid);
      return;
    }
    if (balanced && hcp >= 14 && hcp <= 16) {
      // TODO: Include (some) 5m(422).
      yield [new Bid(1, Strain.NO_TRUMP), '14-16 HCP, balanced'];
      return;
    }
    if (balanced && hcp >= 20 && hcp <= 21) {
      yield [new Bid(2, Strain.NO_TRUMP), '20-21 HCP, balanced'];
      return;
    }
    const shape = hand.labeledShape();
    if (hcp >= 16) {
      const bid = yield [new Bid(1, Strain.CLUBS), '16+ HCP (17+ if balanced)'];
      if (bid.level === 1 && bid.strain === Strain.DIAMONDS) {
        if (balanced && hcp <= 19) {
          yield [new Bid(1, Strain.NO_TRUMP), '17-19 HCP, balanced'];
          return;
        }
        // TODO: Kokish.
        if (balanced && hcp <= 24) {
          yield [new Bid(2, Strain.NO_TRUMP), '22-24 HCP, balanced'];
          return;
        }
        if (balanced && hcp <= 27) {
          yield [new Bid(3, Strain.NO_TRUMP), '25-27 HCP, balanced'];
          return;
        }
        if (balanced && hcp <= 30) {
          yield [new Bid(4, Strain.NO_TRUMP), '28-30 HCP, balanced'];
          return;
        }
        if (balanced && hcp <= 33) {
          yield [new Bid(5, Strain.NO_TRUMP), '31-33 HCP, balanced'];
          return;
        }
        if (balanced && hcp <= 36) {
          yield [new Bid(6, Strain.NO_TRUMP), '34-36 HCP, balanced'];
          return;
        }
        if (balanced) {
          yield [new Bid(7, Strain.NO_TRUMP), '37 HCP, balanced'];
          return;
        }
        // TODO
        return;
      }
      return;
    }
    if (shape[0][0] === Suit.SPADES && shape[0][1] >= 5) {
      yield [new Bid(1, Strain.SPADES), '5+♠, 10-15 HCP'];
      return;
    }
    if (shape[0][0] === Suit.HEARTS && shape[0][1] >= 5) {
      yield [new Bid(1, Strain.HEARTS), '5+♥, 10-15 HCP'];
      return;
    }
    if (shape[0][0] === Suit.CLUBS && shape[0][1] >= 6) {
      yield [new Bid(2, Strain.CLUBS), '6+♣, 10-15 HCP'];
      return;
    }
    if (shape[3][0] === Suit.DIAMONDS && shape[3][1] <= 1) {
      yield [new Bid(2, Strain.DIAMONDS), '4=4=1=4 / 4=4=0=5 / 4=3=1=5 / 3=4=1=5, 10-15 HCP'];
      return;
    }
    yield [new Bid(1, Strain.DIAMONDS), '2+♦, 10-15 HCP'];
    return;
  } else {
    // Responding as non-passed hand.
    yield* response(false /* passedHand */, initialBid);
    return;
  }
}

function shuffle(array) {
  for (let i = 0; i < array.length; ++i) {
    let j = i + Math.floor(Math.random() * (array.length - i));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function generateDeal() {
  const cards = [];
  for (let suit = 0; suit < 4; ++suit) {
    for (let rank = 0; rank < 13; ++rank) {
      cards.push(new Card(suit, rank));
    }
  }
  shuffle(cards);
  const hands = [];
  for (let i = 0; i < 4; ++i) {
    const hand = new Hand();
    for (let j = 0; j < 13; ++j) {
      hand.cards.push(cards[i * 13 + j]);
    }
    hands.push(hand);
  }
  return hands;
}

/*
const hand = Hand.parse('AKQJ|T987|6543|2');
console.log(hand.hcp());
console.log(hand.sortedShape());
console.log(hand.labeledShape());
console.log(hand.isBalanced());
console.log(hand.toString());
console.log(hand.cards.map(_ => _.toStringUnicode()).join());
console.log(hand.cards.map(_ => _.toStringAnsi()).join());
console.log(hand.cards.map(_ => _.toCharacterAnsi()).join(' '));
console.log(hand.toStringAnsi());
*/
