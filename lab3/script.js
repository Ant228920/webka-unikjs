// Task1
function task1(previous, forward){
    let sum = previous + forward;
    let newnum;
    let i = 1;
    console.log(previous + ", \n" + forward + ",");
    while(i !== 9){
        newnum = previous + forward;
        previous = forward;
        forward = newnum;
        sum += newnum;
        console.log(forward + ",")
        i++;
    }
    console.log(sum);
}


// Task2
function task2(){
    let sum = 0;
    cycle:
        for(let i = 2; i < 1000; i++){
            for(let j = 2; j < i; j++){
                if(i % j === 0){
                    continue cycle;
                }
            }
            console.log(i);
            sum += i;
        }
        console.log(sum);
}



// Task3
function task3(choice){

    switch (choice){
        case 1:
            console.log("Monday");
            break;
        case 2:
            console.log("Tuesday");
            break;
        case 3:
            console.log("Wednesday");
            break;
        case 4:
            console.log("Thursday");
            break;
        case 5:
            console.log("Friday");
            break;
        case 6:
            console.log("Saturday");
            break;
        case 7:
            console.log("Sunday");
            break;
        default:
            console.log("Wrong choice");
    }
}



// Task4
function task4(a){
    let b = [];

    for(let i = 0; i < a.length; i++){
        if(a[i].length % 2 !== 0){
            b[i] = a[i];
        }

    }

    for(let i = 0; i < b.length; i++){
        console.log(b[i]);
    }
}



//Task5
function task5() {
    let nums = (arg1, arg2, arg3, arg4) => {
        arg1++;
        arg2++;
        arg3++;
        arg4++;
        return [arg1, arg2, arg3, arg4];
    }
    let numbers;
    numbers = nums(1,2,3,4);

    for (let i = 0; i < numbers.length; i++){
        console.log(numbers[i]);
    }
}



function task6(a, b){
    let bool = false;
    if (a+b === 10 || a-b === 10)
        bool = true;
    return bool;
}



//Functions call
task1(0,1);
// task2();
// task3(9);
// task4([[2,3,4,5,6],[32,321,2],[2,5,5,6,2,1]])
// task5()
// console.log(task6(15,5));
