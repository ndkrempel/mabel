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
  const shape = hand.shape();
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
  const gerber = function*() {
    const numAces = hand.cards.filter(_ => _.rank === Rank.ACE).length;
    let response, explanation;
    switch (numAces) {
      case 0:
      case 4: response = Strain.DIAMONDS; explanation = '0 or 4 aces'; break;
      case 1: response = Strain.HEARTS; explanation = '1 ace'; break;
      case 2: response = Strain.SPADES; explanation = '2 aces'; break;
      case 3: response = Strain.NO_TRUMP; explanation = '3 aces'; break;
    }
    const bid = yield [new Bid(4, response), explanation];
    if (bid.level === 5 && bid.strain === Strain.CLUBS) {
      // King ask.
      const numKings = hand.cards.filter(_ => _.rank === Rank.KING).length;
      let response, explanation;
      switch (numKings) {
        case 0:
        case 4: response = Strain.DIAMONDS; explanation = '0 or 4 kings'; break;
        case 1: response = Strain.HEARTS; explanation = '1 king'; break;
        case 2: response = Strain.SPADES; explanation = '2 kings'; break;
        case 3: response = Strain.NO_TRUMP; explanation = '3 kings'; break;
      }
      const bid = yield [new Bid(5, response), explanation];
      return;
    }
    return;
  };
  const josephine = function*(trumpSuit) {
    const numTopHonors = hand.cards.filer(_ => _.suit === trumpSuit && _.rank >= Rank.QUEEN).length;
    const suitString = SUIT_UNICODE_STRING[trumpSuit];
    switch (numTopHonors) {
      case 0:
      case 1: yield [null, '0 or 1 top ' + suitString + ' honors']; break;
      case 2: yield [new Bid(6, trumpSuit), '2 top ' + suitString + ' honors']; break;
      case 3: yield [new Bid(7, trumpSuit), '3 top ' + suitString + ' honors']; break;
    }
    return;
  }
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
      const bid = yield [new Bid(1, Strain.NO_TRUMP), '14-16 HCP, balanced'];
      if (bid.strain === Strain.NO_TRUMP) {
        switch (bid.level) {
          case 3:
          case 6:
          case 7:
            // To play.
            yield [null, 'To play (forced)'];
            return;
          case 2:
          case 4:
          case 5:
            // Invitational.
            // TODO: Finer judgment on 15 HCP.
            const accept = hcp >= 15;
            if (accept) {
              yield [new Bid(bid.level + (bid.level === 2 ? 1 : 2), Strain.NO_TRUMP), 'Accepting invite (15-16 HCP), to play'];
            } else {
              yield [bid.level === 5 ? new Bid(6, Strain.NO_TRUMP) : null, 'Declining invite (14-15 HCP), to play'];
            }
            return;
        }
      }
      if (bid.level === 2 && bid.strain === Strain.CLUBS) {
        // Stayman.
        const haveHearts = shape[Suit.HEARTS] >= 4,
            haveSpades = shape[Suit.SPADES] >= 4;
        let response, explanation;
        if (haveHearts) {
          response = Strain.HEARTS;
          explanation = '4-5 ♥';
        } else if (haveSpades) {
          response = Strain.SPADES;
          explanation = '4-5 ♠, 2-3 ♥';
        } else {
          response = Strain.DIAMONDS;
          explanation = '2-3 ♥, 2-3 ♠';
        }
        response = [new Bid(2, response), explanation];
        const bid = yield response;
        if (bid.strain === Strain.NO_TRUMP) {
          switch (bid.level) {
            case 3:
              // To play (can be pass-or-correct).
              if (haveHearts && haveSpades) {
                // TODO: Cue bid?
                yield [new Bid(4, Strain.SPADES), 'To play (4 ♠)'];
                // TODO: Handle possible repsonse.
              } else {
                yield [null, 'To play' + (haveHearts ? ' (2-3 ♠)' : ' (forced)')];
              }
              return;
            case 6:
            case 7:
              // To play.
              yield [null, 'To play (forced)'];
              return;
            case 2:
            case 4:
            case 5:
              // Invitational.
              // TODO: Finer judgment on 15 HCP.
              const accept = hcp >= 15;
              if (haveHearts && haveSpades) {
                if (accept) {
                  yield [new Bid(bid.level + 2, Strain.SPADES), 'Accepting invite (15-16 HCP), to play (4 ♠)'];
                  // TODO: Handle possible repsonse.
                } else {
                  yield [new Bid(bid.level + 1, Strain.SPADES), 'Declining invite (14-15 HCP), to play (4 ♠)'];
                  // TODO: Handle possible repsonse.
                }
              } else {
                if (accept) {
                  yield [new Bid(bid.level + (bid.level === 2 ? 1 : 2), Strain.NO_TRUMP), 'Accepting invite (15-16 HCP), to play' + (haveHearts ? ' (2-3 ♠)' : '')];
                } else {
                  yield [bid.level === 5 ? new Bid(6, Strain.NO_TRUMP) : null, 'Declining invite (14-15 HCP), to play' + (haveHearts ? ' (2-3 ♠)' : '')];
                }
              }
              return;
          }
        }
        if (response === Strain.DIAMONDS && bid.level === 2 && bid.strain === Strain.HEARTS) {
          if (shape[Suit.HEARTS] === 2) {
            yield [new Bid(2, Suit.SPADES), 'To play (2 ♥, 3 ♠)'];
          } else {
            yield [null, 'To play (3 ♥)'];
          }
          return;
        }
        if (response === Strain.DIAMONDS && bid.level === 2 && bid.strain === Strain.SPADES) {
          yield [null, 'To play (forced)'];
          return;
        }
        if (response !== Strain.DIAMONDS && bid.level === 3 && bid.strain === response) {
          // Invitational.
          // TODO: Finer judgment on 15 HCP.
          const accept = hcp >= 15;
          if (accept) {
            yield [new Bid(4, response), 'Accepting invite (15-16 HCP), to play'];
          } else {
            yield [null, 'Declining invite (14-15 HCP), to play'];
          }
          return;
        }
        if (response !== Strain.DIAMONDS && bid.level === 4 && bid.strain === response) {
          // To play.
          yield [null, 'To play (forced)'];
          return;
        }
        // TODO: 2S (over 2H), 3C, 3D, 3H (over 2D/2S), 3S (over 2D/2H), bids above 3NT
        return;
      }
      if (bid.level === 2 && bid.strain <= Strain.HEARTS) {
        // Transfer to major suit.
        // TODO: Super-accepts.
        const xferSuit = bid.strain + 1;
        {
          const bid = yield [new Bid(2, xferSuit), 'Completing transfer (forced)'];
          if (bid.level === 2 && bid.strain === Strain.NO_TRUMP) {
            // Invitational.
            // TODO: Finer judgment on 15 HCP.
            const accept = hcp >= 15;
            if (accept) {
              if (shape[xferSuit] === 2) {
                yield [new Bid(3, Strain.NO_TRUMP), 'Accepting invite (15-16 HCP), to play (2 ' + SUIT_UNICODE_STRING[xferSuit] + ')'];
              } else {
                yield [new Bid(4, xferSuit), 'Accepting invite (15-16 HCP), to play (3-5 ' + SUIT_UNICODE_STRING[xferSuit] + ')'];
              }
            } else {
              if (shape[xferSuit] === 2) {
                yield [null, 'Declining invite (14-15 HCP), to play (2 ' + SUIT_UNICODE_STRING[xferSuit] + ')'];
              } else {
                yield [new Bid(3, xferSuit), 'Declining invite (14-15 HCP), to play (3-5 ' + SUIT_UNICODE_STRING[xferSuit] + ')'];
              }
            }
            return;
          }
          if (bid.level === 3 && bid.strain === Strain.NO_TRUMP) {
            // To play (pass-or-correct).
            if (shape[xferSuit] === 2) {
              yield [null, 'To play (2 ' + SUIT_UNICODE_STRING[xferSuit] + ')'];
            } else {
              yield [new Bid(4, xferSuit), 'To play (3-5 ' + SUIT_UNICODE_STRING[xferSuit] + ')'];
            }
            return;
          }
          if (bid.level === 3 && bid.strain === xferSuit) {
            // Invitational.
            // TODO: Finer judgment on 15 HCP.
            const accept = hcp >= 15;
            if (accept) {
              yield [new Bid(4, xferSuit), 'Accepting invite (15-16 HCP), to play'];
            } else {
              yield [null, 'Declining invite (14-15 HCP), to play'];
            }
            return;
          }
          if (bid.level === 4 && bid.strain === xferSuit) {
            // To play.
            yield [null, 'To play (forced)'];
            return;
          }
          // TODO
          return;
        }
      }
      if (bid.level === 2 && bid.strain === Strain.SPADES) {
        // Transfer to a minor.
        const bid = yield [new Bid(3, Strain.CLUBS), 'Completing transfer (forced)'];
        if (bid.level === 3 && bid.strain === Strain.DIAMONDS) {
          yield [null, 'To play (forced)'];
        }
        return;
      }
      if (bid.level === 3) {
        // Single-suited slam try.
        // TODO
        return;
      }
      if (bid.level === 4 && bid.strain === Strain.CLUBS) {
        // Gerber.
        yield* gerber();
        return;
      }
      if (bid.level === 4 && bid.strain === Strain.DIAMONDS) {
        // Texas transfer to hearts.
        yield [new Bid(4, Strain.HEARTS), 'Completing transfer (forced)'];
        return;
      }
      if (bid.level === 4 && bid.strain === Strain.HEARTS) {
        // Texas transfer to spades.
        yield [new Bid(4, Strain.SPADES), 'Completing transfer (forced)'];
        return;
      }
      if (bid.level === 5 && bid.strain >= Strain.HEARTS) {
        // Josephine.
        yield* josephine(bid.strain);
        return;
      }
      yield [null, 'To play (forced)'];
      return;
    }
    if (balanced && hcp >= 20 && hcp <= 21) {
      yield [new Bid(2, Strain.NO_TRUMP), '20-21 HCP, balanced'];
      return;
    }
    const sortedShape = hand.labeledShape();
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
    if (sortedShape[0][0] === Suit.SPADES && sortedShape[0][1] >= 5) {
      yield [new Bid(1, Strain.SPADES), '5+♠, 10-15 HCP (11-13 if balanced)'];
      return;
    }
    if (sortedShape[0][0] === Suit.HEARTS && sortedShape[0][1] >= 5) {
      yield [new Bid(1, Strain.HEARTS), '5+♥, 10-15 HCP (11-13 if balanced)'];
      return;
    }
    if (sortedShape[0][0] === Suit.CLUBS && sortedShape[0][1] >= 6) {
      yield [new Bid(2, Strain.CLUBS), '6+♣, 10-15 HCP'];
      return;
    }
    if (sortedShape[3][0] === Suit.DIAMONDS && sortedShape[3][1] <= 1) {
      yield [new Bid(2, Strain.DIAMONDS), '4=4=1=4 / 4=4=0=5 / 4=3=1=5 / 3=4=1=5, 10-15 HCP'];
      return;
    }
    yield [new Bid(1, Strain.DIAMONDS), '2+♦, 10-15 HCP (either natural unbalanced, or any 11-13 balanced with no 5-card major)'];
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
