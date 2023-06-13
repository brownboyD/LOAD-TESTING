import http from 'k6/http';
import { sleep } from 'k6';
import { open } from 'k6/data';

export default function () {
  // Open the JSON file and read its contents
  let file = open('./ApI.json').read;
  let jsonData = JSON.parse(file);

  // Access the imported JSON data
  console.log(jsonData.key1);
  console.log(jsonData.key2);

  // Make an HTTP GET request
  let response = http.get('https://api.example.com/endpoint');

  // Log the response status code
  console.log('Response status code:', response.status);

  // Log the response body
  console.log('Response body:', response.body);

  // Simulate a wait time
  sleep(1); // Wait for 1 second before making the next request
}
