// TypeScript semantic-token stress fixture.
type ID = string | number;
type Result<T> = { data: T; error?: Error };

interface User<T extends Record<string, unknown>> {
  readonly id: ID;
  name: string;
  metadata?: T;
}

enum Role {
  Admin = "admin",
  Editor = "editor",
  Viewer = "viewer",
}

@sealed
export class UserService<T extends User<Record<string, unknown>>> {
  private cache = new Map<ID, T>();

  constructor(private readonly endpoint: string) {}

  async fetchUser(id: ID): Promise<Result<T | null>> {
    if (this.cache.has(id)) return { data: this.cache.get(id)! };
    const response = await fetch(`${this.endpoint}/users/${id}`);
    if (!response.ok) return { data: null, error: new Error(`HTTP ${response.status}`) };
    const user = (await response.json()) as T;
    this.cache.set(id, user);
    return { data: user };
  }
}

function sealed<T extends Function>(target: T): T {
  Object.freeze(target.prototype);
  return target;
}

export const roles: Record<Role, number> = {
  [Role.Admin]: 3,
  [Role.Editor]: 2,
  [Role.Viewer]: 1,
};