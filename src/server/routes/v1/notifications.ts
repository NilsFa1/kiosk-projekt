import {defineEventHandler} from "h3";
import {useNotificationManager} from "../../composeables/notification";

export default defineEventHandler(async (event) => {
  const notificationManager = useNotificationManager()
  const {id, send} = notificationManager.connect(event)

  return send()
})
