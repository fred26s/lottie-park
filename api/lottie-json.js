import { supabase } from "../supabase";

export default async function handler(request, response) {
  const { data: notes, error:selectErr } = await supabase
    .from('profiles')
    .select('username')

  const { data, error } = await supabase.storage
    .from("lottie-json")
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
      selectErr
    },
    query: request.query,
    cookies: request.cookies,
  });
}
