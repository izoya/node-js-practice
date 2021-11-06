'use strict';
/**
 Напишите программу для вывода в консоль простых чисел, чтобы они попадали в указанный диапазон включительно.
 При этом числа должны окрашиваться в цвета по принципу светофора:
 первое число выводится зелёным цветом;
 второе — жёлтым;
 третье — красным.
 Диапазон, куда попадут числа, указывается при запуске программы.
 Если простых чисел в диапазоне нет, нужно, чтобы программа сообщила об этом в терминале красным цветом.
 Если аргумент, переданный при запуске, не считается числом — сообщите об этом ошибкой и завершите программу.
 */
const colors = require('colors');
colors.enable();

const trafficLightColors = ['green', 'yellow', 'red'];

function getPrimeNumbersFromRange(min, max) {
    const result = [];

    for (let number = Math.ceil(min); number <= max; number++) {
        isPrimeNumber(number) && result.push(number);
    }

    return result;
}

function isPrimeNumber(number) {
    if (number <= 1) return false;

    if (number <= 3) return true;

    for (let divider = 2; divider < number; divider++) {
        if (number % divider === 0) return false;
    }

    return true;
}

module.exports.printPrimeNumbersWithColors = (args, colorList = trafficLightColors) => {
    const min = Number(args.min);
    const max = Number(args.max);

    if (isNaN(min) || isNaN(max)) {
        console.error(colors.red.bold('You should pass 2 numbers to the script.'));

        return;
    }
    const result = getPrimeNumbersFromRange(min, max);

    if (!result.length) {
        console.warn(colors.yellow.bold(`The range ${min}-${max} doesn't contain simple numbers.`));

        return;
    }

    const colorsCount = colorList.length;
    let colorIndex = 0;

    for (let i = 0; i < result.length; i++) {
        console.log(colors[colorList[colorIndex]](result[i]));
        colorIndex = colorIndex + 1 === colorsCount ? 0 : colorIndex + 1;
    }
};
