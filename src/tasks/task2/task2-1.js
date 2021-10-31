/**
 * Решите задачу по выводу данных в консоль.
 */

console.log('Record 1'); // 1 sync action

setTimeout(() => { // 6 start with macrotasks, put callback to microtasks thread
    console.log('Record 2'); // 7 sync action
    Promise.resolve().then(() => { // 8 put callback to microtasks thread
        setTimeout(() => { // 9 start with macrotasks, put callback to microtasks thread
            console.log('Record 3');// 10 sync action
            Promise.resolve().then(() => { // 11 put callback to microtasks thread
                console.log('Record 4');// 12 sync action
            });
        });
    });
});

console.log('Record 5'); // 2 sync action

Promise
    .resolve()
    .then(() => // 3 put callback to microtasks thread
        Promise
            .resolve()
            .then(() => // 4 put callback to microtasks thread
                console.log('Record 6') // 5 sync action
            )
    );
