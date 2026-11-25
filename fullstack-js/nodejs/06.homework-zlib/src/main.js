import { createGzip, createGunzip } from "node:zlib";
import {
    createReadStream,
    createWriteStream,
    promises as fsPromises,
} from "node:fs";
import { parse, join } from "node:path";
import { pipeline } from "node:stream/promises";

async function isFileExists(filePath) {
    try {
        await fsPromises.access(filePath);
        return true;
    } catch {
        return false;
    }
}

async function generateUniqueFileName(origPath, delimiter = "", extZip = "") {
    const { dir, name, ext } = parse(origPath);
    let destPath;
    let num = 1;
    do {
        destPath = join(dir, `${name}${delimiter}${num++}${ext}${extZip}`);
    } while (await isFileExists(destPath));
    return destPath;
}
/*
 *
 * #1
 *
 * Технічне завдання для розробки функції "compressFile"
 *
 * Задача:
 * Розробити асинхронну функцію, що використовує алгоритм Gzip для стиснення вказаного файлу.
 * Функція має генерувати унікальне ім'я для стиснутого файлу, якщо файл із таким самим іменем вже наявний,
 * та забезпечувати високий рівень надійності та безпеки процесу стиснення.
 *
 * Функціональні вимоги:
 * 1. Вхідні параметри:
 *    - `filePath`: Шлях до файлу, який потрібно стиснути.
 *
 * 2. Вихідні дані:
 *    - Функція повертає шлях до стиснутого файлу як рядок.
 *
 * 3. Унікальність:
 *    - Перевірка наявності файлів із таким самим іменем і створення унікального імені файлу
 *      шляхом додавання номера до наявного імені, якщо необхідно.
 *
 * 4. Обробка помилок:
 *    - Функція має ідентифікувати та коректно обробляти помилки читання, запису та доступу до файлів.
 *    - У разі помилок, функція має повертати відповідні повідомлення про помилку або коди помилок,
 *      що дозволяють користувачеві або іншим частинам програми адекватно реагувати на такі ситуації.
 *
 * Технічні вимоги:
 * - Використання сучасних можливостей JavaScript (ES6+), включаючи асинхронні функції, стрімове API Node.js, та ESM
 *   для легкої інтеграції та тестування.
 * - Функція має бути написана таким чином, щоб її можна було експортувати та використовувати в інших частинах програми
 *   або тестових сценаріях.
 * - Забезпечення документації коду з описом параметрів, процесу роботи, виключень, які можуть бути згенеровані,
 *   та прикладами використання.
 * - Підготовка функції для можливості легкого мокування та тестування за допомогою Jest.
 *
 */

async function compressFile(filePath) {
    const destFileName = (await isFileExists(`${filePath}.gz`))
        ? await generateUniqueFileName(filePath, "_", ".gz")
        : `${filePath}.gz`;

    const gzip = createGzip();
    const source = createReadStream(filePath);
    const destination = createWriteStream(destFileName);

    await pipeline(source, gzip, destination);
    return destFileName;
}

/*
 *
 * #2
 *
 * Технічне завдання для розробки функції "decompressFile"
 *
 * Задача:
 * Розробити асинхронну функцію, яка використовує алгоритм Gzip для розпакування вказаного стиснутого файлу у вказане місце збереження. Функція має генерувати унікальне ім'я для розпакованого файлу, якщо файл із таким самим іменем вже наявний, та забезпечувати високий рівень надійності та безпеки процесу розпакування.
 *
 * Функціональні вимоги:
 * 1. Вхідні параметри:
 *  - `compressedFilePath`: Шлях до стиснутого файлу, який потрібно розпакувати.
 *  - `destinationFilePath`: Шлях, де буде збережено розпакований файл.
 *
 * 2. Вихідні дані:
 *  - Функція повертає шлях до розпакованого файлу як рядок.
 *
 * 3. Унікальність:
 *  - Перевірка наявності файлів із таким самим іменем і створення унікального імені файлу шляхом додавання номера до наявного імені, якщо необхідно.
 *
 * 4. Обробка помилок:
 *  - Функція має ідентифікувати та коректно обробляти помилки читання, запису та доступу до файлів.
 *  - У разі помилок, функція має повертати відповідні повідомлення про помилку або коди помилок,
 *    що дозволяють користувачеві або іншим частинам програми адекватно реагувати на такі ситуації.
 *
 * Технічні вимоги:
 * - Використання сучасних можливостей JavaScript (ES6+), включаючи асинхронні функції, стрімове API Node.js, та ESM для легкої інтеграції та тестування.
 * - Функція має бути написана таким чином, щоб її можна було експортувати та використовувати в інших частинах програми або тестових сценаріях.
 * - Забезпечення документації коду з описом параметрів, процесу роботи, виключень, які можуть бути згенеровані, та прикладами використання.
 * - Підготовка функції для можливості легкого мокування та тестування за допомогою Jest.
 *
 */

async function decompressFile(compressedFilePath, destinationFilePath) {
    await fsPromises.access(compressedFilePath);
    const destFileName = (await isFileExists(destinationFilePath))
        ? await generateUniqueFileName(destinationFilePath, "_")
        : destinationFilePath;

    const gunzip = createGunzip();
    const source = createReadStream(compressedFilePath);
    const destination = createWriteStream(destFileName);

    await pipeline(source, gunzip, destination);
    return destFileName;
}

// ! Перевірка роботи функцій стиснення та розпакування файлів
async function performCompressionAndDecompression() {
    try {
        const compressedResult = await compressFile("./files/source.txt");
        console.log(compressedResult);
        const decompressedResult = await decompressFile(
            compressedResult,
            "./files/source_decompressed.txt",
        );
        console.log(decompressedResult);
    } catch (error) {
        console.error("Error during compression or decompression:", error);
    }
}
performCompressionAndDecompression();

export { compressFile, decompressFile, performCompressionAndDecompression };
