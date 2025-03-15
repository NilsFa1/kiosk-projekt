import {defineEventHandler} from "h3";
import {useProgressManager} from "../../composeables/progress";

export default defineEventHandler(async (event) => {
  const progressManager = useProgressManager()
  const {id, send} = progressManager.connect(event)

  return send()
})
