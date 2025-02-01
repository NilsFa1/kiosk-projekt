import {defineEventHandler, deleteCookie, getRequestURL, parseCookies} from "h3";
import {fail} from "@analogjs/router/server/actions";
import {jwtDecode} from "jwt-decode";
import {BenutzerSmall} from "../../models/Benutzer";
import {verifyJWT} from "../utils/jwt";
import {AUTH_TOKEN_COOKIE_NAME, USER_CONTEXT_KEY} from "../../models/Constants";

// @ts-ignore
export default defineEventHandler((event) => {
  // Will only execute for /auth route
  if (getRequestURL(event).pathname.includes('/admin')) {
    const cookies = parseCookies(event)
    const token = cookies[AUTH_TOKEN_COOKIE_NAME];
    const decoded = verifyJWT(token)
    if (token == null || decoded == null) {
      return fail(401, 'Not Authorized')
    }

    const user = jwtDecode<BenutzerSmall>(token);
    if (user == null || !user.isAdmin) {
      deleteCookie(event, AUTH_TOKEN_COOKIE_NAME);
      return fail(401, 'Not Authorized')
    }
    event.context[USER_CONTEXT_KEY] = user;
  }
})
