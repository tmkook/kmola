/**
|--------------------------------------------------------------------------
| Application Routes
| Document https://github.com/koajs/router/blob/master/API.md
|--------------------------------------------------------------------------
| example: router.get(name, path, ...middleware, controller);
| controller: router.action(controller,method)
| middleware: router.next(filename)
|--------------------------------------------------------------------------
|
*/
const { router } = require('kmola');

// example
router.get('/', router.action('welcome'));