const http = require('http');

http.get('http://localhost:5000/api/products', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log('Status Code:', res.statusCode);
    try {
      const json = JSON.parse(data);
      console.log('Returned products:', json.length);
      console.log('First product:', json[0]?.name);
    } catch (e) {
      console.log('Failed to parse JSON');
      console.log('Raw data:', data.substring(0, 100));
    }
    process.exit(0);
  });
}).on('error', (err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
