export interface IUserStub {
  _id?: string;
  username?: string;
  display_name?: string;
  avatar?: string;
  avatar_url?: string;
}

export function useCurrentUser(): IUserStub | null {
  try {
    const raw = localStorage.getItem("userData");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed as IUserStub;
  } catch (e) {
    return null;
  }
}

export default useCurrentUser;
