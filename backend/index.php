<?php
/**
 * Created by Ana Zalozna.
 * Date: 15.03.17
 * Time: 15:41
 */

error_reporting(E_ALL);
ini_set("display_errors", 1);

// Require composer autoloader
require __DIR__ . '/vendor/autoload.php';

require __DIR__ . '/config.php';

//autoloads classes
spl_autoload_register(function ($className) {
	require_once("./classes/$className.php");
});

// Create Router instance
$router = new \Bramus\Router\Router();

$router->mount('/movies', function() use ($router) {
	$router->get('/', 'Movie@actionIndex');
    $router->get('/(\d+)', 'Movie@actionSingle');
    $router->post('/filter', 'Movie@actionFilter');

});

$router->mount('/comments', function() use ($router) {
    $router->get('/(\d+)', 'Comment@actionForMovie');
    $router->post('/add', 'Comment@actionAddComment');
});

$router->mount('/genres', function() use ($router) {
    $router->get('/', 'Movie@actionGenres');
    $router->get('/(\d+)', 'Movie@actionGenreMovie');
});

// Run it!
$router->run();