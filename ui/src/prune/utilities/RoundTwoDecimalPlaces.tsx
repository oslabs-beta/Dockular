
//ex num = 10.58501 => 10.59
export function roundTwoDecimalPlaces(num: number): number {
    // console.log('typeof ', typeof num)
    // console.log('num',num)
    // console.log('rounded', Number.parseFloat(num.toFixed(2)))
    return Number.parseFloat(num.toFixed(2));
}