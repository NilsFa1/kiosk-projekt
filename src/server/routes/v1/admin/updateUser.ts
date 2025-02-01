import {defineEventHandler, readBody, setCookie} from "h3";
import {BenutzerSmall, UpdateUserRequestParams} from "../../../../models/Benutzer";
import {updateUsers} from "../../../db/skripts/update-user";
import {signJWT} from "../../../utils/jwt";
import {USER_CONTEXT_KEY} from "../../../../models/Constants";

export default defineEventHandler(async (req) => {
  const body = await readBody<UpdateUserRequestParams>(req)
  const user = req.context[USER_CONTEXT_KEY] as BenutzerSmall;

  await updateUsers({...body, id: user.id});

  const newUser: BenutzerSmall = {
    name: user.name,
    isAdmin: user.isAdmin,
    id: user.id,
    openApiToken: body.openApiToken,
    openApiUrl: body.openApiUrl
  };

  const newtoken = signJWT(newUser);

  setCookie(req, 'auth_token', newtoken, {httpOnly: true, secure: true, maxAge: 3600});
  return true;
});
