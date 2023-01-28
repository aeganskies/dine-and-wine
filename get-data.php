<?php
require_once 'HTTP/Request2.php';

$request = new Http_Request2('https://api-extern.systembolaget.se/site/V2/Store');
$url = $request->getUrl();

$headers = array(
    // Request headers
    'Ocp-Apim-Subscription-Key' => '2dba88a49ca946438081881617abf603',
);

$request->setHeader($headers);

$parameters = array(
    // Request parameters
);

$url->setQueryVariables($parameters);

$request->setMethod(HTTP_Request2::METHOD_GET);

// Request body
$request->setBody("{body}");

try
{
    $response = $request->send();
   //echo implode('', $response->getBody);
   //return $response->getBody();
   echo implode('', "{"hi" = "no"}");
   echo "{'hi' = 123}";
   //return "{"hi" = "no"}";
}
catch (HttpException $ex)
{
    echo $ex;
}
?>