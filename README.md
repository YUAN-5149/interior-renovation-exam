# 建築物室內裝修工程管理乙級｜術科學習站

105～114 年術科歷屆題庫（105～107 年含 D 卷）、參考答案、模擬考與重點筆記。

網站：https://yuan-5149.github.io/interior-renovation-exam/

## 檔案結構

| 檔案 | 內容 |
|---|---|
| `index.html` | 網頁版面與功能（總覽、題庫、模擬考、重點筆記） |
| `data/questions.js` | 題庫資料：題型分類 `CATS`、題目 `Q`、考試時程 `SCHEDULE` |
| `js/svgs.js` | 示意大樣圖（SVG） |
| `img/` | 考題附圖 |

## 新增題目

在 `data/questions.js` 的 `Q` 陣列加入一筆：

```js
{y:115, p:"A", n:1, cat:"draw", pts:20,
 q:"題目全文",
 a:["答案要點 1", "答案要點 2"],
 tip:"答題技巧（選填）",
 img:"fig115",   // 選填：附圖，需在 index.html 的 IMG 對照表加上 img/fig115.png
 warn:true       // 選填：法規題，提醒對照最新條文
},
```

- `y` 年度、`p` 卷別（A／B／C／D）、`n` 題號、`pts` 配分
- `cat` 題型，可用：`draw` `cns` `survey` `mgmt` `law` `safety` `tool` `masonry` `wood` `ceiling` `finish` `glass` `mep`

## 注意

參考答案為學習用整理，非官方解答；法規題請對照全國法規資料庫最新條文。

## 更新後看不到新題目？

修改 `data/questions.js` 後，請同步把 `index.html` 裡 `questions.js?v=` 後面的數字改大（例如改成當天日期），瀏覽器才不會沿用舊快取。
