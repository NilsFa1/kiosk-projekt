import {defineEventHandler, readBody} from "h3";
import {AnalyzeRequestParams, AnalyzeResponse, BenutzerSmall} from "../../../../models/Benutzer";
import OpenAI from "openai";
import {ApiProduct, Product} from "../../../../models/product";
import {insertProducts} from "../../../db/skripts/create-products";
import {blobToDataUrl} from "../../../utils/blobToBase64";
import {fail} from "@analogjs/router/server/actions";
import {USER_CONTEXT_KEY} from "../../../../models/Constants";

export default defineEventHandler(async (req) => {
  const body = await readBody<AnalyzeRequestParams>(req)
  const user = req.context[USER_CONTEXT_KEY] as BenutzerSmall;

  if (user.openApiToken == null && process.env["OPENAI_API_KEY"] == null) {
    return fail(400, "Not Valid")
  }
  const apikey = (user.openApiToken ?? process.env["OPENAI_API_KEY"]) as string;
  const openai = new OpenAI({apiKey: apikey});

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

  const imageResults = await Promise.all(produkte.products.map(async (p, i) => {
    const prompt = `A realistic image of a ${p.name}. The product is well-lit with a neutral background, detailed and sharp, emphasizing its design and features. A typical ImageDescription of the Product is ${p.imageDescription}. The product should be displayed prominently in the middle to ensure visibility even when cropped to a 200x300 format.`;
    const imageGenerationResult = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      size: "1024x1024",
      quality: "standard",
      n: 1,
    })

    const imageUrl = imageGenerationResult.data.at(0)?.url;
    const imageBlob = await downloadImageAsBlob(imageUrl ?? '');

    return {
      name: p.name,
      price: p.price,
      category: p.category,
      description: p.description,
      image: imageBlob,
      active: false
    } as Product
  }))

  await insertProducts(imageResults);

  return await Promise.all(imageResults.map(async p => ({
    name: p.name,
    description: p.description,
    price: p.price,
    category: p.category,
    id: p.id,
    imageDataUrl: p.image ? await blobToDataUrl(p.image) : undefined,
    active: p.active
  }) as ApiProduct));
});

// Funktion zum Herunterladen eines Bildes als Blob mit fetch
async function downloadImageAsBlob(imageUrl: string): Promise<Blob> {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.blob();
  } catch (error) {
    console.error("Error downloading image:", error);
    throw error;
  }
}
