const { Command } = require("commander");
const chalk = require("chalk");

//подключаю свой модуль
const {
  listContacts,
  addContact,
  getContactById,
  removeContact,
} = require("./contacts");

const program = new Command();
program
  .option("-a, --action <type>", "choose action")
  .option("-i, --id <type>", "user id")
  .option("-n, --name <type>", "user name")
  .option("-e, --email <type>", "user email")
  .option("-p, --phone <type>", "user phone");

program.parse(process.argv);

const argv = program.opts();

// анонимная самовызываемая ф-ция IIEF!!!
(async ({ action, id, name, email, phone }) => {
  try {
    switch (action) {
      case "list":
        const contacts = await listContacts();
        console.table(contacts);
        break;

      case "get":
        const contactById = await getContactById(id);
        contactById
          ? console.log(chalk.green("Contact found"))
          : console.log(chalk.yellow("Contact not found"));
        console.log(contactById);
        break;

      case "add":
        const contact = await addContact(name, email, phone);
        console.log(chalk.green("Add New Contact"));
        console.log(contact);
        break;

      case "remove":
        await removeContact(id);
        //console.log(chalk.green(`Contact${id} successfully deleted`));

        break;

      default:
        console.warn(chalk.red("Unknown action type!"));
    }
  } catch (error) {
    console.error(chalk.red(error.message));
  }
})(argv);
