import {defineEventHandler, readBody} from "h3";
import {AnalyzeRequestParams, AnalyzeResponse, BenutzerSmall} from "../../../../models/Benutzer";
import OpenAI from "openai";
import {ApiProduct} from "../../../../models/product";
import {insertProducts} from "../../../db/skripts/create-products";
import {blobToDataUrl} from "../../../utils/blobToBase64";
import {fail} from "@analogjs/router/server/actions";
import {USER_CONTEXT_KEY} from "../../../../models/Constants";
import {useNotificationManager} from "../../../composeables/notification";
import {useDalleRequestBatcher} from "../../../composeables/dalle-batch-requester";
import {useProgressManager} from "../../../composeables/progress";

export default defineEventHandler<{ body: AnalyzeRequestParams }>(async (req) => {
  const body = await readBody(req)
  const user = req.context[USER_CONTEXT_KEY] as BenutzerSmall;

  if (user.openApiToken == null && process.env["OPENAI_API_KEY"] == null) {
    return fail(400, "Not Valid")
  }
  const apikey = (user.openApiToken ?? process.env["OPENAI_API_KEY"]) as string;
  const openai = new OpenAI({apiKey: apikey});

  const progressmanager = useProgressManager();
  await progressmanager.push({
    id: Math.random(),
    waitingCount: 0,
    totalCount: 1,
    activeCount: 1
  })

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Ich brauche Hilfe dabei die Dinge auf dem Bild auszuwerten. Auf dem Bild ist eine Liste an Produkten zu finden. Diese sollen extrahiert und in ein JSON Format umgewandelt werden, wie im JSON-Schema beschrieben. Die Felder Description und Category kannst du selber passend befüllen, falls diese nicht im Bild vorhanden sind. Außerdem gibt bitte eine genaue Bildbeschreibung des Produktes an, wie dieses Typischerweise aussieht. Nur das Feld imageDescription soll auf Englisch sein, der Rest auf Deutsch. "
          },
          {
            type: "image_url",
            "image_url": {"url": body.fileUrls[0]},
          }
        ],
      },
    ],
    response_format: {
      "type": "json_schema",
      json_schema: {
        name: "product_schema",
        schema: {
          type: "object",
          properties: {
            products: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: {type: "string",},
                  description: {type: "string",},
                  price: {type: "number",},
                  category: {type: "string",},
                  imageDescription: {type: "string",},
                },
                required: ["name", "description", "price", "category", "imageDescription"],
                additionalProperties: false
              },
            },
          },
          required: ["products"],
          additionalProperties: false
        },
        strict: true
      }
    },
    store: false,
  });

  const produkte = JSON.parse(response.choices[0].message.content ?? '') as AnalyzeResponse;

  const requestBatcher = useDalleRequestBatcher();

  produkte.products.map(p => requestBatcher.addRequest(p, openai).then(async p => {
    await insertProducts([p])
    const apiProduct: ApiProduct = {
      name: p.name,
      description: p.description,
      price: p.price,
      category: p.category,
      id: p.id,
      imageDataUrl: p.image ? await blobToDataUrl(p.image) : undefined,
      active: p.active
    }
    await useNotificationManager().push({
      topic: 'new_product',
      id: Math.random(),
      message: {product: apiProduct}
    })
  }));

  return true;
});
