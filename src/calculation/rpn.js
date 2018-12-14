import * as fm from './fm';

/**
 * Преобразование из Инфиксной нотации в постфиксную.
 */
const transform = infixArr => {
  let postFixStack = [];
  let stack = [];

  /**
   * Задаём приоритет операторам
   */
  const ops = {
    '(': {
      priority: 1
    },
    ')': {
      priority: 1
    },
    '+': {
      priority: 2
    },
    '-': {
      priority: 2
    },
    '*': {
      priority: 3
    },
    '/': {
      priority: 3
    }
  };

  /**  Пишем "Сортировочную станцию". Преобразует запись в инфиксной форме в постфиксную форму.
   **/
  for (let i = 0; i < infixArr.length; i++) {
    let item = infixArr[i];
    if (item.type === 'operand') {
      postFixStack.push(item);
    } else {
      let lastStackItem = stack[stack.length - 1];
      if (item.value === '(') {
        stack.push(item);
      }
      if (item.value === ')') {
        while (lastStackItem.value !== '(') {
          postFixStack.push(stack.pop());
          lastStackItem = stack[stack.length - 1];
        }
        stack.pop();
      }
      if (item.type === 'operation') {
        while (lastStackItem && ops[item.value].priority <= ops[lastStackItem.value].priority) {
          postFixStack.push(stack.pop());
          lastStackItem = stack[stack.length - 1];
        }
        stack.push(item);
      }
    }
  }
  while (stack.length > 0)
    postFixStack.push(stack.pop());

  return postFixStack;
};

/**
 * Расчет результата
 */
const result = postfixArr => {

  const calculation = {
    '+': (x, y) => fm.sum(x, y),
    '-': (x, y) => fm.sub(x, y),
    '*': (x, y) => fm.mul(x, y),
    '/': (x, y) => fm.div(x, y)
  };

  let stack = [];
  postfixArr.forEach((token) => {
    if (token.value in calculation) {
      let [y, x] = [stack.pop(), stack.pop()];
      stack.push(calculation[token.value](x, y));
    } else {
      stack.push(token);
    }
  });

  return stack.pop();
};

const calculate = infix => {
  return result(transform(infix));
};

export {
  calculate
};