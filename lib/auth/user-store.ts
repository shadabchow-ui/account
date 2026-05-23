import { getStore } from "lib/db/store";
import { createAuditEvent } from "./audit";

export async function upsertUserFromGoogle(googleUser: {
  sub: string;
  email: string;
  name: string;
  picture?: string;
}): Promise<{
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
}> {
  const store = getStore();
  const existingOAuth = await store.getOAuthAccount("google", googleUser.sub);

  if (existingOAuth) {
    const user = await store.getUserById(existingOAuth.user_id);
    if (!user) throw new Error("User referenced by OAuth account not found");

    await store.updateUser(existingOAuth.user_id, {
      name: googleUser.name,
      avatar_url: googleUser.picture ?? null,
    });

    return {
      id: user.id,
      email: user.email,
      name: googleUser.name,
      avatar_url: googleUser.picture ?? null,
    };
  }

  let user = await store.getUserByEmail(googleUser.email);

  if (user) {
    await store.updateUser(user.id, {
      name: googleUser.name,
      avatar_url: googleUser.picture ?? null,
    });
  } else {
    user = await store.createUser({
      id: crypto.randomUUID(),
      email: googleUser.email,
      name: googleUser.name,
      avatar_url: googleUser.picture ?? null,
    });

    await createAuditEvent({
      id: crypto.randomUUID(),
      user_id: user.id,
      event_type: "user.created",
      metadata_json: JSON.stringify({ provider: "google" }),
    });
  }

  const alreadyLinked = await store.getOAuthAccount("google", googleUser.sub);
  if (!alreadyLinked) {
    await store.createOAuthAccount({
      id: crypto.randomUUID(),
      user_id: user.id,
      provider: "google",
      provider_account_id: googleUser.sub,
      email: googleUser.email,
    });

    await createAuditEvent({
      id: crypto.randomUUID(),
      user_id: user.id,
      event_type: "oauth.account_linked",
      metadata_json: JSON.stringify({ provider: "google" }),
    });
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name ?? googleUser.name,
    avatar_url: user.avatar_url,
  };
}
