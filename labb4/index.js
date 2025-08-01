function line(){
    return console.log("--------------------------");
}

function task1(fruits){

    line();
    console.log("Initially array:");
    console.log(fruits.join(', '));
    fruits.pop();
    line();
    console.log("Deleting last element:");
    console.log(fruits.join(', '));
    line()
    fruits.unshift("Kivi");
    console.log("Adding element at the beginning:")
    console.log(fruits.join(', '));
    line();
    fruits.sort();
    console.log("Sorted array:");
    console.log(fruits.join(', '));
    line();
    console.log("The index of Apple:")
    console.log(fruits.indexOf("Apple"));
    line();
}

function task2(colors){

    line();
    console.log("Initial array:")
    for(let color of colors){
        console.log(color);
    }

    let min = colors[0];
    let max = colors[0];

    for(let color of colors){
        if(color.length > max.length)
            max = color;
        if(color.length < min.length)
            min = color;
    }
    line()
    console.log("The shortest length: " + min + "\nThe longest length: " + max);
    line();
    console.log("Filtered array: ")
    let colors2 = colors.filter(word => word === "Blue");
    let result = colors2.join(', ');

    console.log(result);

}

function task3(){
    let workers = [
        {id: 1, name: "Petya", age: 22, position: "Developer"},
        {id: 2, name: "Vlad", age: 20, position: "Manager"},
        {id: 3, name: "Vova", age: 23, position: "UI/UX Designer"},
        {id: 4, name: "Anton", age: 24, position: "Developer"}
    ];


    console.log(workers.sort((a,b) => a.name.localeCompare(b.name)));

    console.log(workers.filter(a => a.position === "Developer"))

    workers = workers.filter(a => a.id !== 1);

    console.log(workers);

    workers.push(
        {id:5, name: "Oleksandr", age: 19, position: "Developer"});

    console.log(workers)
}

function task4(){
    let students =[
        {id:1, name:"Oleksandr", age: 18, course: 1},
        {id:2, name:"Anton", age: 19, course: 2},
        {id:3, name:"Vasya", age: 20, course: 3},
        {id:4, name:"Oleksiy", age: 21, course: 4}
    ]

    console.log(students)
    students = students.filter(a => a.name !== "Oleksiy");

    console.log(students);

    students.push(
        {id: 5, name:"Vlad", age:18, course:2}
    )

    console.log(students);

    students = students.sort((a, b) => a.age - b.age)

    console.log(students);

    console.log(students.find(a => a.course === 3))
}

function task5(){
    let nums = [1, 2, 5, 3, 6, 8];

    nums = nums.map((a) => Math.pow(a, 2))

    console.log(nums);

    console.log(nums.filter(a => a % 2 === 0));

    let sum = nums.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    console.log(sum);

    let newnums = [10, 2, 4];

    nums = newnums.concat(nums);

    console.log(nums);

    nums.splice(0,3)

    console.log(nums);
}

function task6(){
    function addBook(title, author, genre, pages, isAvailable){
        books.push(
            {title: title, author: author, genre: genre, pages: pages, isAvailable: isAvailable}
        )
    }

    function removeBook(title){
        books = books.filter(a => a.title !==title);
    }

    function findBooksByAuthor(author){
        return books.filter(a => a.author === author)
    }

    function toggleBookAvailability(title, isBorrowed){
        let book = books.find(a => a.title === title);

        if(book){
            book.isAvailable = !isBorrowed;
            console.log(`${title} is now ${book.isAvailable ? 'available' : 'borrowed'}.`);
        }
        else{
            console.log("Not found")
        }
    }

    function sortBooksByPages(){
        return books = books.sort((a,b) => a.pages - b.pages);
    }

    function getBooksStatistics(){

        let totalBooks = books.length;
        let availableBooks = books.filter(a => a.isAvailable === true).length;
        let borrowedBooks = totalBooks - availableBooks;
        let averagePages = books.reduce((a, b) => a + b.pages, 0) / totalBooks;
        return {
            totalBooks,
            availableBooks,
            borrowedBooks,
            averagePages
        }
    }
    let books = [
        { title: "1984", author: "George Orwell", genre: "Dystopian", pages: 328, isAvailable: true },
        { title: "Harry Potter and the Sorcerer's Stone", author: "J.K. Rowling", genre: "Fantasy", pages: 309, isAvailable: false },
        { title: "The Art of War", author: "Sun Tzu", genre: "Philosophy", pages: 273, isAvailable: true },
        { title: "The Shadow of the Wind", author: "J.K. Rowling", genre: "Mystery", pages: 487, isAvailable: true },
        { title: "Atlas Shrugged", author: "Ayn Rand", genre: "Philosophy", pages: 1168, isAvailable: false }
    ]

    addBook("Name", "Someone", "Some", 228, true);
    console.log(books);
    removeBook("1984")
    line();
    console.log(books)

    console.log(findBooksByAuthor("J.K. Rowling"))

    toggleBookAvailability("Atlas Shrugged", false);

    console.log(sortBooksByPages());
    let stats = getBooksStatistics();
    console.log(stats)
}

function task7(){
    let student = {
        name: "Vasya",
        age: 19,
        course: 3
    }
    console.log(student)
    student.subjects = ["Math", "Ukrainian", "English"];
    console.log(student)
    delete student.age
    console.log(student)
}
// task1(["Apple", "Banana", "Cherry"])
// task2(["Blue", "Black", "Blue","Purple", "Orange"])
// task3();
// task4();
// task5();
// task6();
task7()