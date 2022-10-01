import { supabase } from "../supabase";

export default async function handler(request, response) {
  try {
    // * 入参
    const { query } = request;
    const { type, fileName } = query;
    if (type == 1) {
      const { signedURLList, createSignedUrlsError } = await supabase.storage
        .from("lottie-json")
        .createSignedUrls(['json/lottie-1.json', 'json/lottie-2.json'], 60);
      response.status(200).json({
        data: signedURLList,
        body: {
          createSignedUrlsError,
          supabase,
        },
        query: request.query,
        cookies: request.cookies,
      });
      return;
    }
    const { data: notes, error: selectErr } = await supabase
      .from("profiles")
      .select("username");

    const { data, error } = await supabase.storage
      .from("lottie-json")
      .list("json", {
        limit: 100,
        offset: 0,
        sortBy: { column: "name", order: "asc" },
      });
    if (error) console.log(error);
    const fileNameList = data.map((e) => `json/${e.name}`);

    // 批量获取资源URL
    const { signedURLList, createSignedUrlsError } = await supabase.storage
      .from("lottie-json")
      .createSignedUrls(fileNameList, 60);
    response.status(200).json({
      data: signedURLList,
      body: {
        createSignedUrlsError,
        data,
        supabase,
        notes,
        selectErr,
      },
      query: request.query,
      cookies: request.cookies,
    });
    // } else if (type == 2) {
    //   const { signedURL, error } = await supabase.storage
    //     .from("lottie-json")
    //     .createSignedUrl("json/lottie-1.json", 60);
    //   response.status(200).json({
    //     body: {
    //       error,
    //       signedURL,
    //     },
    //     query: request.query,
    //     cookies: request.cookies,
    //   });
    // } else if (type == 3) {
    //   const { publicURL, error } = await supabase.storage
    //     .from("lottie-json")
    //     .getPublicUrl(`json/${fileName}`);
    //   response.status(200).json({
    //     body: {
    //       error,
    //       publicURL,
    //     },
    //     query: request.query,
    //     cookies: request.cookies,
    //   });
    // }
  } catch (err) {
    console.log(`handler err: ${err}`);
  }
}
