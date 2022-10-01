<script setup>
import WelcomeItem from "./WelcomeItem.vue";
import DocumentationIcon from "./icons/IconDocumentation.vue";
import ToolingIcon from "./icons/IconTooling.vue";
import EcosystemIcon from "./icons/IconEcosystem.vue";
import CommunityIcon from "./icons/IconCommunity.vue";
import SupportIcon from "./icons/IconSupport.vue";

import { ref, unref, onMounted, onBeforeMount, nextTick } from "vue";
import Toastify from "toastify-js";
import { useFetchAuth } from "./composables/useFetchHandle";
import {
  useAsyncAnimate,
  useFetchAnimateList,
} from "./composables/useAsyncAnimate";
import { splitChunk } from "../utils";

const iconList = [
  SupportIcon,
  DocumentationIcon,
  ToolingIcon,
  EcosystemIcon,
  CommunityIcon,
];

// 收集vfor下的ref lottieDOM容器
const lottieWrapper = ref([]);

// 接口获取jsonList，循环展示
let LottieList = ref([]);

onBeforeMount(async () => {
  console.log("onBeforeMount");
  // 获取请求头
  useFetchAuth();
});

onMounted(async () => {
  console.log("onMounted");
  // 获取全量JSON-LIST
  const { LottieList: refLottieList } = await useFetchAnimateList();
  const refLottieListValue = unref(refLottieList);

  // 将数组拆分成指定段
  const ArrayList = splitChunk(refLottieListValue, 2);

  // 逐步分段渲染
  for (const urlChunk of ArrayList) {
    // 分段添加DOM
    LottieList.value.push(...urlChunk);
    await nextTick();
    // 渲染新添加的当前段DOM
    const currentLottieWrapper = lottieWrapper.value.slice(-2);
    // 执行渲染动画
    await useAsyncAnimate(urlChunk, currentLottieWrapper);
  }
});

// copy事件
// 将jsonURL写入剪贴板
const onCopyJson = async ({ fileName: lottieJsonUrl }) => {
  try {
    await navigator.clipboard.writeText(lottieJsonUrl);
    console.log("jsonURL copied to clipboard", lottieJsonUrl);
    Toastify({
      text: `URL copied to clipboard`,
      duration: 2000,
      destination: lottieJsonUrl,
      newWindow: true,
      // close: true,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "linear-gradient(to right, #00b09b, #96c93d)",
      },
      onClick: function () {}, // Callback after click
    }).showToast();
  } catch (err) {
    console.error(err);
  }
};
</script>

<template>
  <!-- 循环jsonList -->
  <WelcomeItem v-for="(e, i) in LottieList" :key="i">
    <template #icon>
      <component :is="iconList[i % 5]"></component>
    </template>
    <template #heading>{{ `lottie-${i + 1}` }}</template>
    <div
      class="lottie-wrapper"
      ref="lottieWrapper"
      @click="onCopyJson(e)"
    ></div>
    <span class="green" @click="onCopyJson(e)">点击复制</span>
  </WelcomeItem>
</template>

<style>
.lottie-wrapper {
  width: 100px;
  height: 100px;
  cursor: pointer;
}
</style>
