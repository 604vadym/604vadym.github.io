"use strict";

console.log("JavaScript Core #16. Домашнє завдання. Класи у JavaScript");

/**
 * Завдання
 * 1. Створити класс Student з полями:
 *
 * firstName (ім’я)
 * lastName (фамілія)
 * age (вік)
 * averageScore (середній бал)
 * coreSubject (основний предмет)
 * 2. Додати метод printStudent() який виводить на екран всі дані студента
 *
 * 3. Створити 3 студентів використовуючи класс Student
 *
 * 4. (*) Розширити класс студента класом GraduateStudent
 *
 * 5. Додати класу GraduateStudent власне поле diplomaType
 *
 * 6. Створити 2 ексемпляра класа GraduateStudent
 */

class Student {
    constructor(firstName, lastName, age, averageScore, coreSubject) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.age = age;
        this.averageScore = averageScore;
        this.coreSubject = coreSubject;
    }

    print() {
        console.log("First name: " + this.firstName);
        console.log("Last name: " + this.lastName);
        console.log("Age: " + this.age);
        console.log("Average score: " + this.averageScore);
        console.log("Core subject: " + this.coreSubject);
    }
}

class GraduateStudent extends Student {
    constructor(
        firstName,
        lastName,
        age,
        averageScore,
        coreSubject,
        diplomaType,
    ) {
        super(firstName, lastName, age, averageScore, coreSubject);
        this.diplomaType = diplomaType;
    }

    print() {
        super.print();
        console.log("Diploma Type: " + this.diplomaType);
    }
}

const student1 = new Student("John", "Brown", 18, 8.5, "Chemistry");
const student2 = new Student("Mike", "Thompson", 22, 10.3, "Physics");
const student3 = new Student("Jack", "Ford", 20, 11.5, "Mathematics");

student1.print();
console.log("******************************");

student2.print();
console.log("******************************");

student3.print();
console.log("******************************");

const graduateStudent1 = new GraduateStudent(
    "Fred",
    "Anderson",
    24,
    10.1,
    "Mathematics",
    "Bachelor",
);
const graduateStudent2 = new GraduateStudent(
    "Robert",
    "Vince",
    23,
    11,
    "Physics",
    "Bachelor",
);

graduateStudent1.print();
console.log("******************************");

graduateStudent2.print();
