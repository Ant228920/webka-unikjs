// Task 1
function task1(x){
    let min = x[1][1];
    let max = x[1][1];

    for(let i = 0; i < x.length; i++){
        for(let j = 0; j < x.length; j++){
            if(x[i][j] < min){
                min = x[i][j];
            }
            else if(x[i][j] > max){
                max = x[i][j];
            }
        }
    }
    console.log("The lowest number: "+ min + " The largest number: " + max);
}

task1([[20, 34, 2], [9, 12, 18], [3, 4, 5]])

// Task 2
function task2(x){
    let number = 3;
    let exist = false;

    for(let i = 0; i < x.length; i++){
        if(x[i] === number){
            exist = !exist;
        }
    }
    if(exist){
        console.log(exist);
    }
    else {
        console.log(exist);
    }
}

task2([1,2,6,23,5])
// Task 3.1

function task3(point, num){

    if( 1 <= point && point <= 5){
        if(point === 5){
            console.log("Відмінно");
        }
        else if(point === 4){
            console.log("Добре");
        }
        else if(point === 3){
            console.log("Задовільно");
        }
        else {
            console.log("Незадовільно")
        }
    }
    else {
        console.log("Wrong number");
    }

// Task 3.2

    let checking = (1 <= point && point <= 5)
        ? (point === 5) ? "Відмінно" :
            (point === 4) ? "Добре" :
                (point === 3) ? "Задовільно" :
                    "Незадовільно"
        : "Wrong number";

    console.log(checking);

// Task 3.3

    if( 1 <= num && num <= 12){
        if(num === 12 || num === 1 || num === 2){
            console.log("Winter");
        }
        else if(num >= 3 && num <= 5){
            console.log("Spring");
        }
        else if(num >= 6 && num <= 8){
            console.log("Summer");
        }
        else {
            console.log("Autumn");
        }
    }
    else {
        console.log("Incorrect number");
    }

   // Task 3.4

    let answer = (1 <= num && num <= 12)
        ? (num === 12 || num === 1 || num === 2) ? "Winter" :
            (num >= 3 && num <= 5) ? "Spring" :
                (num >= 6 && num <= 8) ? "Summer" :
                    "Autumn"
        : "Wrong number";

    console.log(answer);
}

task3(3,5);
let obj1 = { name: "Vlad", age: 25};
let obj2 = { name: "Vlad", age: 26};

let key1 = Object.keys(obj1);
let key2 = Object.keys(obj2);
let exist = true;

if (key1.length !== key2.length){
    exist = false;
}
for(let key of key2){
    if(obj1[key] !== obj2[key]){
        exist = false;
    }
}

if(exist){
    console.log("Equal");
}
else{
    console.log("Not equal");
}