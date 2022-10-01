import axios from "@/axios";
import { ref, unref } from "vue";

const fetchJson = async (promiseList) => {
  return Promise.all(promiseList);
};

export const useFetchAnimateList = async () => {
  let LottieList = ref([]);

  //* 通过接口获取jsonList
  const jsonList = await axios.get("/lottie-json");
  // 列表循环展示
  LottieList.value = jsonList.data;
  return { LottieList };
};

/**
 *  异步将传入的json数据和DOM容器，渲染动画
 *
 * @param {Array} LottieListRef
 * @param {Array} lottieWrapperRef
 * @return {Array}
 */
export const useAsyncAnimate = async (LottieListRef, lottieWrapperRef) => {
  const LottieList = unref(LottieListRef);
  const lottieWrapper = unref(lottieWrapperRef);

  // 获取所有json内容，预览动画
  const PromiseList = LottieList.map((e) => {
    return axios.get(e);
  });
  const jsonDetailList = await fetchJson(PromiseList);

  const renderList = LottieList.map((e, i) => {
    return {
      ref: lottieWrapper[i],
      json: jsonDetailList[i],
    };
  });
  renderList.forEach((item, i) => {
    window.bodymovin.loadAnimation({
      container: item.ref,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: item.json,
    });
  });
  return { renderList };
};
