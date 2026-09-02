// Functions, classes, imports, async code, regexes, literals and errors.
import { readFile as read } from "node:fs/promises";

const pattern = /ava\s+night/gi;
const version = 1.3;
const config = { enabled: true, retries: null, name: `Ava Night ${version}` };

function formatUser(user) {
  return `${user.name ?? "Unknown"} <${user.email}>`;
}

class UserService {
  #cache = new Map();

  async load(id) {
    if (!id) throw new TypeError("Missing user id");
    if (this.#cache.has(id)) return this.#cache.get(id);
    const data = JSON.parse(await read(`./users/${id}.json`, "utf8"));
    this.#cache.set(id, data);
    return data;
  }
}

const service = new UserService();
Promise.all([1, 2, 3].map((id) => service.load(id)))
  .then(console.log)
  .catch((error) => console.error("load failed", error));