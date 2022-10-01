// import { supabase } from "../supabase";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
console.log(supabaseUrl, supabaseAnonKey);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function handler(request, response) {
  try {
    // * 入参
    const { query } = request;
    const { type, fileName } = query;
    if (type == 1) {
      const { data: notes, error: selectErr } = await supabase
        .from("profiles")
        .select("username");

      const { data, error } = await supabase.storage
        // .getPublicURL();
        // .listBuckets();
        // .getBucket("lottie-json")
        .list("json", {
          limit: 100,
          offset: 0,
          sortBy: { column: "name", order: "asc" },
        });
      if (error) console.log(error);
      response.status(200).json({
        body: {
          error,
          data,
          supabase,
          notes,
          selectErr,
        },
        query: request.query,
        cookies: request.cookies,
      });
    } else if (type == 2) {
      const { signedURL, error } = await supabase.storage
        .from("lottie-json")
        .createSignedUrl("json/lottie-1.json", 60);
      response.status(200).json({
        body: {
          error,
          signedURL,
        },
        query: request.query,
        cookies: request.cookies,
      });
    } else if (type == 3) {
      const { publicURL, error } = await supabase.storage
        .from("lottie-json")
        .getPublicUrl(`json/${fileName}`);
      response.status(200).json({
        body: {
          error,
          publicURL,
        },
        query: request.query,
        cookies: request.cookies,
      });
    }
  } catch (err) {
    console.log(`handler err: ${err}`);
  }
}
