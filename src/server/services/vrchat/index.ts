import { TOTP } from "totp-generator";

import { env } from "@/utils/env/server";
import cache from "@/server/cache";

import vrchatClient from "./client";

const AUTH_COOKIE_KEY = "vrchat-auth-cookie";
const TWOFACTOR_COOKIE_KEY = "vrchat-2fa-cookie";

function getBasicAuth() {
  const value = `${env.VRCHAT_USERNAME}:${env.VRCHAT_PASSWORD}`;
  const bytes = new TextEncoder().encode(value);
  return btoa(String.fromCodePoint(...bytes));
}

function getCookieValue(key: string, headers: Headers) {
  return headers
    .getSetCookie()
    .find((cookie) => cookie.startsWith(key + "="))
    ?.split(";")[0]
    .split("=")[1];
}

async function loginWithTotp() {
  let loginResult = await login();

  const authCookie = getCookieValue("auth", loginResult.response.headers);

  cache.set(AUTH_COOKIE_KEY, authCookie);

  if (!loginResult.response.ok || !loginResult.data) {
    return false;
  }

  if (!("requiresTwoFactorAuth" in loginResult.data)) {
    return true;
  }

  const { otp } = TOTP.generate(env.VRCHAT_TOTP);

  let verify2FACodeResult = await verify2FACode(otp);

  const twofactorCookie = getCookieValue(
    "twoFactorAuth",
    verify2FACodeResult.response.headers
  );

  cache.set(TWOFACTOR_COOKIE_KEY, twofactorCookie);

  if (!verify2FACodeResult.response.ok || !verify2FACodeResult.data) {
    return false;
  }

  return verify2FACodeResult.data.verified;
}

async function login() {
  const { data, error, response } = await vrchatClient.GET("/auth/user", {
    headers: {
      Authorization: `Basic ${getBasicAuth()}`,
    },
  });

  return { data, error, response };
}

async function getCurrentUserInfo() {
  const authCookie = await cache.get<string>(AUTH_COOKIE_KEY);
  const twofactorCookie = await cache.get<string>(TWOFACTOR_COOKIE_KEY);

  if (!authCookie) {
    throw new Error("no auth cookie found");
  }

  let cookie = `auth=${authCookie};`;

  if (twofactorCookie) {
    cookie += `twoFactorAuth=${twofactorCookie};`;
  }

  const { data, error, response } = await vrchatClient.GET("/auth/user", {
    headers: {
      Cookie: cookie,
    },
  });

  return { data, error, response };
}

async function verify2FACode(code: string) {
  const authCookie = await cache.get<string>("vrchat-auth-cookie");

  if (!authCookie) {
    throw new Error("no auth cookie found");
  }

  const { data, error, response } = await vrchatClient.POST(
    "/auth/twofactorauth/totp/verify",
    {
      body: {
        code,
      },
      headers: {
        Cookie: `auth=${authCookie}`,
      },
    }
  );

  return { data, error, response };
}

async function getFriend(userId: string) {
  const authCookie = await cache.get<string>(AUTH_COOKIE_KEY);
  const twofactorCookie = await cache.get<string>(TWOFACTOR_COOKIE_KEY);

  if (!authCookie) {
    throw new Error("no auth cookie found");
  }

  let cookie = `auth=${authCookie};`;

  if (twofactorCookie) {
    cookie += `twoFactorAuth=${twofactorCookie};`;
  }

  return await vrchatClient.GET("/users/{userId}", {
    params: {
      path: {
        userId,
      },
    },
    headers: {
      Cookie: cookie,
    },
  });
}

type GroupAuditLogEventKinds =
  | "group.instance.kick"
  | "group.instance.warn"
  | "group.invite.create"
  | "group.member.join"
  | "group.member.leave"
  | "group.member.remove"
  | "group.member.role.assign"
  | "group.request.block"
  | "group.request.create"
  | "group.request.reject"
  | "group.role.update"
  | "group.update"
  | "group.user.ban"
  | "group.instance.create";

type GroupAuditLogEventTypes = {
  [K in GroupAuditLogEventKinds]?: boolean;
};

async function getGroupAuditLog(
  groupId: string,
  eventTypes?: GroupAuditLogEventTypes
) {
  const authCookie = await cache.get<string>(AUTH_COOKIE_KEY);
  const twofactorCookie = await cache.get<string>(TWOFACTOR_COOKIE_KEY);

  if (!authCookie) {
    throw new Error("no auth cookie found");
  }

  let cookie = `auth=${authCookie};`;

  if (twofactorCookie) {
    cookie += `twoFactorAuth=${twofactorCookie};`;
  }

  let eventTypesStr: string | null = null;

  if (eventTypes) {
    const entries = Object.entries(eventTypes).filter((entry) => entry[1]);
    if (entries.length > 0) {
      eventTypesStr = entries.join(",");
    }
  }

  return await vrchatClient.GET("/groups/{groupId}/auditLogs", {
    params: {
      path: {
        groupId,
      },
      query: {
        // @ts-ignore
        eventTypes: eventTypesStr ?? undefined,
      },
    },
    headers: {
      Cookie: cookie,
    },
  });
}

const VRChatService = {
  getCurrentUserInfo,
  login,
  verify2FACode,
  loginWithTotp,
  getFriend,
  getGroupAuditLog,
};

export default VRChatService;
