function eval() {
    // Do not use eval!!!
    return;
}

const opsPriority = {
    '+': 1,
    '-': 1,
    '/': 2,
    '*': 2,
}

const ops = {
    '/': (a, b) => {
        if (b == 0) throw new Error('TypeError: Division by zero.');
        return a / b;
    },
    '*': (a, b) => a * b,
    '+': (a, b) => +a + +b,
    '-': (a, b) => a - b,
};

function transInArr(exp) {
    return exp.split(' ').join('').match(/(?<=[\*\/\-\+]|^)\-(\d+|\d+\.?\d+)|(\d+|\d+\.?\d+)|[\*\/\-\+\(\)]/gi);
}

function infixToPostfix(exp) {
    const exit = [];
    const opsStack = [];
    for (let elem of exp) {
        if (!isNaN(elem)) {
            exit.push(elem);
        } else {
            switch (true) {
                case '/*+-'.includes(elem): {
                    while (opsPriority[elem] <= opsPriority[opsStack[opsStack.length - 1]]) {
                        exit.push(opsStack.pop());
                    }
                    opsStack.push(elem);
                    break;
                }
                case elem == '(':
                    opsStack.push(elem);
                    break;
                case elem == ')':
                    while (opsStack[opsStack.length - 1] != '(') {
                        exit.push(opsStack.pop());
                        if (opsStack.length == 0) throw new Error('ExpressionError: Brackets must be paired');
                    }
                    opsStack.pop();
                    break;
            }
        }
    }
    while (opsStack.length != 0) {
        exit.push(opsStack.pop());
    }
    return exit;
}

function expressionCalculator(exp) {
    exp = infixToPostfix(transInArr(exp));
    if (exp.includes('(') || exp.includes(')')) throw new Error('ExpressionError: Brackets must be paired');
    while (exp.length > 1) {
        for (let i = 0; i < exp.length; i++) {
            if ('*/-+'.includes(exp[i])) {
                const op = exp[i];
                const a = exp[i - 2];
                const b = exp[i - 1];
                const result = ops[op](a, b);
                exp.splice(i - 2, 3, result);
                break;
            }
        }
    }
    return exp[0];
}

module.exports = {
    expressionCalculator
}