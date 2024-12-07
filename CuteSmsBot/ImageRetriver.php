<?php

// This includes Composer's autoloader, which automatically loads all installed libraries.
require __DIR__ . '/vendor/autoload.php';

use GuzzleHttp\Client;
use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__);

$dotenv->safeLoad();

function println($text) {
    echo $text . PHP_EOL;
}

function getImageUrl($query_term)
{
    $api_key = $_ENV['BING_IMAGE_SEARCH_API_KEY'];

    $base_url = 'https://api.bing.microsoft.com/v7.0/images/search';

    $client = new Client();

    println("Sending a request to the bing image search api");
    $response = $client->request('GET', $base_url, [
        'headers' => ['Ocp-Apim-Subscription-Key' => $api_key],

        'query' => [
            'q' => $query_term,
            'count' => 1, // Number of images to retrieve
            'offset' => rand(0, 100), // Start position
            'safeSearch' => 'Strict',
            'imageType' => 'Photo', // Filter by image type
            'maxFileSize' => 520192
        ]
    ]);

    $response_json = json_decode($response->getBody());

    $img_url = $response_json->value[0]->contentUrl;

    println("Got the following URL " . $img_url);

    return $img_url;
}

function getJPGImageUrl($query_term)
{
    $image_url = "";
    do {
        $image_url = getImageUrl($query_term);
    }
    while (!str_ends_with($image_url, ".jpg"));

    return $image_url;
}

function saveImgUrlToFileInCurrentDirectory($img_url, $file_name)
{
    $file_path = __DIR__ . "\\" . $file_name;

    $img_data = file_get_contents($img_url);
    file_put_contents($file_path, $img_data);

    println("Saved the url " . $img_url . " at " . $file_path . "");
}

$query_term = "cute bunny";
$img_url = getJPGImageUrl($query_term);

$file_name = "cute_img.jpg";
saveImgUrlToFileInCurrentDirectory($img_url, $file_name);

?>