const fs = require("fs/promises"); //модуль функций
const path = require("path");
const crypto = require("crypto"); //генерирует айди
const chalk = require("chalk"); //цветные консоли
const contactsPath = path.join(__dirname, "./db/contacts.json"); //путь к базе

const readData = async () => {
  const result = await fs.readFile(contactsPath, "utf-8");
  return JSON.parse(result);
};

// TODO: задокументировать каждую функцию
const listContacts = async () => {
  return await readData();
};

const getContactById = async (contactId) => {
  const contacts = await readData();
  const [result] = contacts.filter(
    (contact) => String(contact.id) === String(contactId) //привожу к строке - чтоб можно было найти по любому айди
  );
  return result;
};

const removeContact = async (contactId) => {
  const contacts = await readData();
  const newResult = contacts.filter(
    (contact) => contact.id !== Number(contactId)
  );
  await fs.writeFile(
    contactsPath,
    JSON.stringify(newResult, null, 2) //обязательно приводим к строке
  );
  console.log("OLD", contacts.length);
  console.log("NEW", newResult.length);

  console.table(newResult);
  if (contacts.length === newResult.length) {
    console.log(
      chalk.yellow(` Contact with ${contactId}-ID not found in this list`)
    );
  } else {
    console.log(
      chalk.green(`Contact with ${contactId}-ID successfully deleted`)
    );
  }
};

const addContact = async (name, email, phone) => {
  const contacts = await readData();
  const newContact = { id: crypto.randomUUID(), name, email, phone };
  contacts.push(newContact);
  await fs.writeFile(
    contactsPath,
    JSON.stringify(contacts, null, 2) //обязательно приводим к строке
  );
  return newContact;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
