export function roundThreeDecimalPlaces(num: number): number {
    // console.log('typeof ', typeof num)
    return Number.parseFloat(num.toFixed(3));
}