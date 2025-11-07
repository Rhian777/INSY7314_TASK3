const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000/api";

async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const defaultHeaders = { "Content-Type": "application/json" };
  options.headers = { ...(options.headers || {}), ...defaultHeaders };

  if (options.body && typeof options.body !== "string") {
    options.body = JSON.stringify(options.body);
  }

  const res = await fetch(url, options);
  const text = await res.text();

  try {
    const json = text ? JSON.parse(text) : {};
    if (!res.ok) throw { status: res.status, body: json };
    return json;
  } catch (e) {
    if (e && e.status) throw e;
    if (!res.ok) throw { status: res.status, body: text };
    return text;
  }
}

export default {
  get: (path, token) =>
    request(path, {
      method: "GET",
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    }),
  post: (path, body, token) =>
    request(path, {
      method: "POST",
      body,
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    }),
  put: (path, body, token) =>
    request(path, {
      method: "PUT",
      body,
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    }),
};