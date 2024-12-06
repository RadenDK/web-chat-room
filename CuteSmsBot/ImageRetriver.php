<?php

// This includes Composer's autoloader, which automatically loads all installed libraries.
require __DIR__ . '/vendor/autoload.php';

// This uses the phpdotenv library to load variables from a .env file in the current directory
// into the PHP environment for this script's runtime.
// It returns an instance of the Dotenv class.
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);

// Calls the safeLoad method on the Dotenv object to load the .env file.
// This could also have been written as a one-liner: 
// Dotenv\Dotenv::createImmutable(__DIR__)->safeLoad();
$dotenv->safeLoad();

// At this point, the superglobal $_ENV contains all variables defined in the .env file.
// For example, if your .env file has "BING_IMAGE_SEARCH_API_KEY=your-api-key",
// you can now access it using $_ENV['BING_IMAGE_SEARCH_API_KEY'].
echo $_ENV['BING_IMAGE_SEARCH_API_KEY'];

?>
