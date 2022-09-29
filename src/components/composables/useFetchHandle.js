import axios, { setTokenForAxios } from "@/axios";

export const useFetchAuth = async () => {
  try {
    // 获取请求头
    const tokenURL = `/lottie-json/token?name=sxh&&password=123456`;
    const { code, msg, data } = await axios(tokenURL);
    const { token = "" } = data || {};
    if (code === 200) {
      // 设置auth请求头
      setTokenForAxios(token);
    } else {
      console.error(msg);
    }
  } catch (error) {
    console.error(error);
  }
};
