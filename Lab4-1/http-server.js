const http = require('http');
const url = require('url');

const PORT = 3000;

// 🔹 ข้อมูลจำลอง students array
const students = [
  { id: 1, name: 'Somchai', major: 'Computer Engineering', year: 3 },
  { id: 2, name: 'Suda', major: 'Information Technology', year: 2 },
  { id: 3, name: 'Arthit', major: 'Computer Engineering', year: 4 },
];

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // ตั้งค่า Header
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  // 🔹 Route: GET /
  if (method === 'GET' && pathname === '/') {
    const message = {
      message: 'Welcome to Basic HTTP Server!',
      endpoints: [
        'GET /students',
        'GET /students/:id',
        'GET /students/major/:major',
      ],
    };
    res.writeHead(200);
    res.end(JSON.stringify(message));
    return;
  }

  // 🔹 Route: GET /students
  if (method === 'GET' && pathname === '/students') {
    res.writeHead(200);
    res.end(JSON.stringify(students));
    return;
  }

  // 🔹 Route: GET /students/:id
  const studentIdMatch = pathname.match(/^\/students\/(\d+)$/);
  if (method === 'GET' && studentIdMatch) {
    const id = parseInt(studentIdMatch[1]);
    const student = students.find((s) => s.id === id);
    if (student) {
      res.writeHead(200);
      res.end(JSON.stringify(student));
    } else {
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'Student not found' }));
    }
    return;
  }

  // 🔹 Route: GET /students/major/:major
  const majorMatch = pathname.match(/^\/students\/major\/(.+)$/);
  if (method === 'GET' && majorMatch) {
    const major = decodeURIComponent(majorMatch[1]);
    const filtered = students.filter(
      (s) => s.major.toLowerCase() === major.toLowerCase()
    );
    res.writeHead(200);
    res.end(JSON.stringify(filtered));
    return;
  }

  // 🔹 กรณี 404 Not Found
  res.writeHead(404);
  res.end(JSON.stringify({ error: 'Not Found' }));
});

server.listen(PORT, () => {
  console.log(`🌐 HTTP Server running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('  GET /');
  console.log('  GET /students');
  console.log('  GET /students/:id');
  console.log('  GET /students/major/:major');
});
