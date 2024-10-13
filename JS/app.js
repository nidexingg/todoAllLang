const fs = require('fs');
const readline = require('readline');

const FILE_NAME = 'tasks.txt';

class TodoApp {
    constructor() {
        this.tasks = [];
        this.loadTasks();
    }

    loadTasks() {
        if (fs.existsSync(FILE_NAME)) {
            const data = fs.readFileSync(FILE_NAME, 'utf8');
            this.tasks = data.split('\n').filter(task => task.trim() !== '');
        }
    }

    saveTasks() {
        fs.writeFileSync(FILE_NAME, this.tasks.join('\n'));
    }

    displayMenu() {
        console.log("=== To-Do List ===");
        console.log("1. Add Task");
        console.log("2. View Tasks");
        console.log("3. Remove Task");
        console.log("4. Exit");
        process.stdout.write("Choose an option: ");
    }

    async addTask() {
        const taskDescription = await this.getInput("Enter the tasks separated by '/': ");
        const newTasks = taskDescription.split('/').map(task => task.trim()).filter(task => task !== '');

        this.tasks.push(...newTasks);
        this.saveTasks();
        console.log("Tasks added!");
    }

    viewTasks() {
        if (this.tasks.length === 0) {
            console.log("No tasks available.");
            return;
        }

        console.log("=== Your Tasks ===");
        this.tasks.forEach((task, index) => {
            console.log(`${index + 1}. ${task}`);
        });
    }

    async removeTask() {
        this.viewTasks();

        if (this.tasks.length === 0) return;

        const taskNumber = await this.getInput("Enter the task number to remove (type 0 to remove all tasks): ");
        
        if (taskNumber === '0') {
            this.clearAllTasks();
            return;
        }

        const index = parseInt(taskNumber) - 1;
        
        if (index >= 0 && index < this.tasks.length) {
            this.tasks.splice(index, 1);
            this.saveTasks();
            console.log("Task removed!");
        } else {
            console.log("Invalid task number.");
        }
    }

    clearAllTasks() {
        this.tasks = [];
        this.saveTasks();
        console.log("All tasks cleared!");
    }

    getInput(prompt) {
        return new Promise((resolve) => {
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });
            rl.question(prompt, (answer) => {
                rl.close();
                resolve(answer);
            });
        });
    }

    async run() {
        while (true) {
            this.displayMenu();
            const choice = await this.getInput("");

            switch (choice) {
                case '1':
                    await this.addTask();
                    break;
                case '2':
                    this.viewTasks();
                    break;
                case '3':
                    await this.removeTask();
                    break;
                case '4':
                    console.log("Exiting...");
                    return;
                default:
                    console.log("Invalid choice. Please try again.");
                    break;
            }
            console.log();
        }
    }
}

const app = new TodoApp();
app.run();