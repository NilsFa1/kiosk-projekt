import {defineEventHandler, readBody, setCookie} from 'h3';
import {findUserByName} from "../../db/skripts/find-user";
import {fail} from "@analogjs/router/server/actions";
import * as bcrypt from 'bcrypt';
import {Benutzer, BenutzerSmall, LoginRequestParams} from "../../../models/Benutzer";
import {signJWT} from "../../utils/jwt";
import {insertUsers} from "../../db/skripts/create-user";

export default defineEventHandler(async (req) => {
  const body = await readBody<LoginRequestParams>(req)
  let user = await findUserByName(body.name)
  if (user == null) {
    if (body.name == 'admin' && body.password == 'admin') {
      await insertUsers([{id: 0, name: 'admin', password: 'admin', isAdmin: true}])
      user = await findUserByName(body.name) as Benutzer
    } else {
      return fail(400, "Not Valid")
    }
  }

  if (!await bcrypt.compare(body.password, user.password)) {
    return fail(400, "Not Valid")
  }

  const b: BenutzerSmall = {
    name: user.name,
    isAdmin: user.isAdmin,
    id: user.id,
    openApiToken: user.openApiToken,
    openApiUrl: user.openApiUrl
  };
  const token = signJWT(b);

  setCookie(req, 'auth_token', token, {httpOnly: true, secure: true, maxAge: 3600});
  return token;
});
