fetch("http://localhost:5000/api/health").then(res => res.json()).then(console.log).catch(console.error);
