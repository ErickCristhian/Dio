// Como podemos rodar isso em um arquivo .ts sem causar erros? 

let employee: { code: number, name: string } = {
    code: 10,
    name: "John"
}
interface Programmer {
    code: number;
    name: string
}

let employee2: Programmer = {
    code: 20,
    name: 'James'
}