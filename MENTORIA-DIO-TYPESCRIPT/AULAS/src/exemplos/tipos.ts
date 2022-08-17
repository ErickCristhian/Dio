function somarValores(input1: number | string, input2: number | string) {
    if(typeof input1 === 'string' || typeof input2 === 'string') {
        return input1.toString() + input2.toString()
    } else {
        return input1 + input2
    }
}

type input = number | string;

function somarValores2(input1: input, input2:input) {
    if(typeof input1 === 'string' || typeof input2 === 'string') {
        return input1.toString() + input2.toString()
    } else {
        return input1 + input2
    }
}

console.log(somarValores(1, 5))
console.log(somarValores2(1, 5))

console.log(somarValores('ola,', ' tudo bem?'))
console.log(somarValores2('ola,', ' tudo bem?'))