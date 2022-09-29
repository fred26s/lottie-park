/**
 * 将arrayList 拆分成指定 splitChunks 长度的等分list
 *
 * @param {Array} arrayList
 * @param {Number} splitChunks
 * @return {Array}
 */
export const splitChunk = (arrayList, splitChunks) => {
  const dataLength = arrayList.length;
  const ArrayList = [];
  let index = 0;
  while (index < dataLength) {
    ArrayList.push(arrayList.slice(index, (index += splitChunks)));
  }
  return ArrayList;
};
