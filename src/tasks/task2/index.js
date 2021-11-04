/**
 * Напишите программу, которая будет принимать на вход несколько аргументов:
 * дату и время в формате «час-день-месяц-год».
 * Задача программы — создавать для каждого аргумента таймер с обратным отсчётом:
 * посекундный вывод в терминал состояния таймеров (сколько осталось).
 * По истечении какого-либо таймера, вместо сообщения о том, сколько осталось,
 * требуется показать сообщение о завершении его работы.
 * Важно, чтобы работа программы основывалась на событиях.
 */

const {eventEmitter} = require('./MyEventEmitter');
const colors = require('colors');

const EVENT_TIMER_STARTED = 'timer-started';
const EVENT_TIMER_STOPPED = 'timer-stopped';
const EVENT_ALL_TIMERS_STOPPED = 'all-timers-stopped';

const HOUR = 60 * 60;
const DAY = HOUR * 24;
const MONTH = DAY * 30.4;
const YEAR = MONTH * 12;

let info = '';

eventEmitter.on(EVENT_TIMER_STOPPED, timerId => {
    info = 'Timer #' + timerId + ' has been stopped.';
});
eventEmitter.on(EVENT_TIMER_STARTED, timersCount => {
    info = timersCount + ' timers started.';
});
eventEmitter.on(EVENT_ALL_TIMERS_STOPPED, () => {
    console.clear();
    console.log(colors.bgYellow.bold('All timers stopped.'));
});

function getTimerString(time) {
    if (time <= 0) return '00:00:00';

    const years = Math.floor(time / YEAR);
    time -= YEAR * years;
    const months = Math.floor(time / MONTH);
    time -= MONTH * months;
    const days = Math.floor(time / DAY);
    time -= DAY * days;
    const hours = Math.floor(time / HOUR);
    time -= HOUR * hours;
    const minutes = Math.floor(time / 60);
    const seconds = Math.round(time - minutes * 60).toString().padStart(2, 0);

    return `${years} years ${months} months ${days} days ` +
        `${hours.toString().padStart(2, 0)}:${minutes.toString().padStart(2, 0)}:${seconds}`;
}

const startTimers = (intervals) => {
    eventEmitter.emit(EVENT_TIMER_STARTED, intervals.length);
    const mainInterval = setInterval(() => {
        console.clear();
        console.log(colors.green.bold(info + '\n'));

        let sum = 0;

        intervals = intervals.map((time, index) => {
            time <= 0 && eventEmitter.emit(EVENT_TIMER_STOPPED, index + 1);
            sum += time > 0 ? time : 0;

            console.log('Timer #' + (index + 1) + ': ' + getTimerString(time));

            return time - 1;
        });

        if (sum <= 0) {
            clearInterval(mainInterval);
            eventEmitter.emit(EVENT_ALL_TIMERS_STOPPED);
        }
    }, 1000);
};

const runTimers = (args) => {
    const intervals = [];
    let valid = true;

    for (const interval of args._) {
        const [h, d, m, y] = interval.split('-');
        const timeInSeconds = (h * HOUR) + (d * DAY) + (m * MONTH) + (y * YEAR);

        if (isNaN(timeInSeconds)) {
            valid = false;
            break;
        }

        intervals.push(timeInSeconds);
    }

    if (!valid || !intervals.length) {
        console.log('Wrong arguments. Pass timers as h-d-m-y string.');

        return;
    }

    startTimers(intervals);
};

module.exports = {runTimers};
