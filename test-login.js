fetch("http://localhost:5000/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: "admin@example.com", password: "password" })
}).then(async res => {
  console.log(res.status);
  console.log(await res.text());
}).catch(console.error);
