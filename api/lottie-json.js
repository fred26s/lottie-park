import { supabase } from "../supabase";

export default async function handler(request, response) {
  try {
    // * 入参
    const { data, error } = await supabase.storage
      .from("lottie-json")
      .list("json", {
        limit: 100,
        offset: 0,
        sortBy: { column: "name", order: "asc" },
      });
    const fileNameList = data.map((e) => `json/${e.name}`);

    // * 批量获取资源URL
    const { data: signedURLList, error: createSignedUrlsError } =
      await supabase.storage
        .from("lottie-json")
        .createSignedUrls(fileNameList, 60);

    // * 这里默认接口返回的URL list数量，全等于上一个接口查出的所有文件数量
    const renderDataList = signedURLList.map((url, index) => {
      return {
        url: url,
        fileName: fileNameList[index],
      };
    });
    response.status(200).json({
      data: renderDataList,
      msg: 'ok'
    });
  } catch (err) {
    console.log(`handler err: ${err}`);
  }
}
