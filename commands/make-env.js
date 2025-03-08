const folder = require('../folder');
const dotenv = require('../dotenv');
const string = require('../string');
const program = require('../program');

program.command('make:env')
    .description('Create a Dotenv')
    .option('-k, --key', 'Change the APP_KEY')
    .action((options) => {
        let data = {
            APP_KEY: string.snow(64),
            APP_LOG: "info",
            APP_ENV: "development",
            DB_CLIENT: "msyql",
            DB_HOST: "127.0.0.1",
            DB_PORT: "3306",
            DB_USER: "root",
            DB_PASSWORD: "12345678",
            DB_DATABSSE: "test",
        };
        let file = folder.base('.env');
        if (folder.fs.existsSync(file)) {
            let json = dotenv.toJson(folder.content(file));
            if (options.key) {
                json.APP_KEY = string.snow(options.key > 32 ? string.snow(options.key) : string.snow(32));
            }
            data = Object.assign(data, json);
        }
        folder.fs.writeFileSync(file, dotenv.toEnv(data));
        console.log('.env file has been generated');
    });