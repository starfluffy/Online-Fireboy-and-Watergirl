import users from "./user-schema.js";
import phrases from "./phrase-schema.js";

export function initializeDatabase() {
  return {
    users,
    phrases,
  };
}

if (import.meta.url === new URL(import.meta.url).href) {
  initializeDatabase();
}