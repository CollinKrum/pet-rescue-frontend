const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080"; 

export async function getPets() {
  const res = await fetch(`${API_URL}/pets`);
  if (!res.ok) {
    throw new Error(`Failed to fetch pets: ${res.statusText}`);
  }
  return res.json();
}
