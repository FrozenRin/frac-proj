/**
 * Подключаю библиотеку Math.js для использования дробей
 * http://mathjs.org/docs/datatypes/fractions.html
 */
import math from 'mathjs';

const sum = (x, y) => {
  let sum = math.add(math.fraction(x.numenator / x.denomenator), math.fraction(y.numenator / y.denomenator));
  const returnFraction = {
    numenator: '',
    denomenator: '',
    type: 'operand',
    isResult: false
  };
  returnFraction.numenator = sum.n * sum.s;
  returnFraction.denomenator = sum.d;
  return returnFraction;
};

const sub = (x, y) => {
  let sub = math.subtract(math.fraction(x.numenator / x.denomenator), math.fraction(y.numenator / y.denomenator));
  const returnFraction = {
    numenator: '',
    denomenator: '',
    type: 'operand',
    isResult: false
  };
  returnFraction.numenator = sub.n * sub.s;
  returnFraction.denomenator = sub.d;
  return returnFraction;
};

const mul = (x, y) => {
  let mul = math.multiply(math.fraction(x.numenator / x.denomenator), math.fraction(y.numenator / y.denomenator));
  const returnFraction = {
    numenator: '',
    denomenator: '',
    type: 'operand',
    isResult: false
  };
  returnFraction.numenator = mul.n * mul.s;
  returnFraction.denomenator = mul.d;
  return returnFraction;
};

const div = (x, y) => {
  let div = math.divide(math.fraction(x.numenator / x.denomenator), math.fraction(y.numenator / y.denomenator));
  const returnFraction = {
    numenator: '',
    denomenator: '',
    type: 'operand',
    isResult: false
  };
  returnFraction.numenator = div.n * div.s;
  returnFraction.denomenator = div.d;
  return returnFraction;
};

export {
  sum,
  sub,
  mul,
  div
}