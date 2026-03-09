import { createClient } from 'redis';

const client = createClient({
    username: 'default',
    password: 'W3PQLi7cHBOD27JhvQ5772miTA345A2j',
    socket: {
        host: 'redis-11015.crce276.ap-south-1-3.ec2.cloud.redislabs.com',
        port: 11015
    }
});

client.on('error', err => console.log('Redis Client Error', err));

await client.connect();

await client.set('hello', 'world');
const result = await client.get('hello');
console.log(result)  

