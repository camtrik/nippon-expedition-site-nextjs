# 用这个项目学 Next.js

**起草：2026-09-06**

这份文件回答一个问题：**做这个网站的过程中，哪一步能学到 Next.js 的什么，怎么确认自己真的学会了。**

建设顺序、要做哪些页面看 [ROADMAP.md](./ROADMAP.md)。两份文件的阶段编号是对应的。

---

## 先建立心智模型

### 一句话：Next.js 放开了三个轴

现在那个静态站在三个轴上都只有一个取值：

| 轴 | 静态站 | Next.js |
|---|---|---|
| **代码在哪跑** | 全在构建机上跑完，浏览器只拿 HTML | 组件可以在服务器跑（默认），也可以标记成在浏览器跑 |
| **什么时候跑** | 只有构建那一刻 | 构建时 / 请求时 / 后台按需重新验证 |
| **结果留多久** | 到下次部署为止 | 按函数粒度指定：几秒、几小时、永久、或按 tag 手动失效 |

**Next 的全部特性都是这三个轴的组合。** 遇到一个新概念，先问它动的是哪个轴。

### React 和 Next.js 的边界

你接下来写的代码里**绝大部分其实是 React**。Next 只在四个地方出现：文件放在哪（路由）、数据在哪取、结果缓存多久、请求进来之前拦不拦。

所以「学 Next.js」= **学 React + 学这四处约定**，前者是大头。

**最容易搞混的一条**：Server Components 是 **React 19** 的特性，`'use client'` / `'use server'` 是 **React 的指令**。Next 只是第一个把它实现出来的框架（RSC 需要打包器和路由深度配合，React 自己不提供这两样）。所以它们才叫 **React** Server Components。这套心智换到别的支持 RSC 的框架照样成立，不是 Next 的方言。

反过来，`'use cache'` / `cacheLife` / `cacheTag` / `revalidateTag` **是 Next 自己的**，React 里没有。

### 卡住的时候该查谁的文档

这张表会经常用到——分不清该搜哪边是初学最耗时间的地方：

| 属于 **React** | 属于 **Next.js** |
|---|---|
| 组件、JSX、props、state | `app/` 目录、`page.tsx` / `layout.tsx` / `loading.tsx` / `error.tsx` |
| `useState` `useEffect` `useMemo` `useRef` `useContext` | `generateStaticParams` `generateMetadata` |
| `'use client'` / `'use server'` 指令 | `'use cache'` `cacheLife` `cacheTag` `revalidateTag` |
| Server Components 模型本身 | `next/link` `next/image` `next/font` |
| `<Suspense>` 边界 | Route Handlers、Server Actions 的**部署形态** |
| `useActionState` `useOptimistic` `useTransition` | `proxy.ts`、`next.config.ts`、rewrites / redirects |
| 错误边界、key 与 diff | 构建产物、Vercel 上的行为、Cron |

**判据**：「这个东西在浏览器里单独跑一个 React 应用也存在吗？」存在 → React；只有在有框架和服务器的语境下才有意义 → Next。

---

## 阶段 1 · 地基与内容三页

> 对应 ROADMAP 阶段 1

### 学到什么

| 能力 | 是谁的 | 干什么 |
|---|---|---|
| **Server Components** | React | 组件函数里直接 `await` 读文件、读库，**这段代码不进浏览器包** |
| 文件路由 | Next | `app/[lang]/faq/page.tsx` → `/zh/faq` |
| `generateStaticParams` | Next | 一个 `[lang]` 文件展开成 zh / en 两套静态页 |
| 嵌套布局 `layout.tsx` | Next | 导航和页脚只写一次，切页时不重渲染 |
| `generateMetadata` | Next | title / description / og / canonical / hreflang |
| rewrites | Next | 把 `/` 映射到 `/zh`，URL 形状和实现解耦 |

**这一阶段几乎全是 React，Next 只用到文件路由和 layout——是最好的入口。**

### 这一步真正的收获

你会先建立一个反直觉的认知：**React 不等于客户端**。

```tsx
// app/[lang]/faq/page.tsx —— 没有 useEffect，没有 loading 分支，没有 API 层
export default async function FAQ({ params }) {
  const { lang } = await params
  const faq = await loadFaq()          // 直接读 content/faq.json
  return <FaqBand items={faq} lang={lang} />
}
```

这个组件的代码**一个字节都不会发给浏览器**。如果你以前写过 `useState` + `useEffect` + `fetch` 那一套，这里的差别会很直观。

### 自测

做完这一阶段，你应该能回答：

- [ ] 打开 DevTools 的 Network，这三个页面各下载了多少 JS？为什么是这个数？
- [ ] `loadFaq()` 这个函数的代码在哪台机器上执行过？浏览器能看到它的源码吗？
- [ ] 如果把 `console.log` 放进 `FAQ` 组件里，日志打在哪？
- [ ] `layout.tsx` 和 `page.tsx` 的区别是什么？从一个页面跳到另一个时，layout 会重新执行吗？

---

## 阶段 2 · 交互补齐

> 对应 ROADMAP 阶段 2

### 学到什么

| 能力 | 是谁的 | 干什么 |
|---|---|---|
| **Client Components（`'use client'`）** | React | 标记出需要在浏览器跑的那一小块 |
| **RSC 边界** | React | 服务端和客户端的分界线划在哪 |
| `<Link>` 软导航 | Next | 站内跳转不卸载文档，附带预取 |

### 这一步是整个项目最值钱的一课

**RSC 边界怎么划，是 Next 里最容易写错、也最值钱的东西。** 规则听起来简单——「需要交互的标 `'use client'`」——但真写起来会不断遇到边界情况：

- 一个 Client Component 里能不能渲染 Server Component？（能，但只能通过 `children` 传进去）
- Server Component 的数据传给 Client Component 会怎样？（**被序列化进 HTML**，查看源代码就能看见——这条在阶段 7 是安全问题）
- 标了 `'use client'` 的组件，它 import 的东西会怎样？（一起进客户端包，这是包体膨胀最常见的来源）

### 一个值得刻意做的实验

更新记录的页签现在是**纯 CSS radio**，不需要任何 JS。

建议：**先照原样用纯 CSS 实现，然后故意改成 Client Component + `useState`，对比两版的产物。**

看 Network 面板里 JS 体积的差别，看 View Source 里 HTML 的差别。这个对比比读十篇文档管用——你会亲眼看到「加一个 `'use client'` 的代价是多少」，以后划边界时心里有数。

### 自测

- [ ] 语言切换用 `<Link>` 之后，为什么滚动位置还是会跳到顶部？怎么改？
- [ ] 锚点复制按钮为什么必须是 Client Component？能不能只用 CSS 或 HTML 做到？
- [ ] 把一个对象从 Server Component 传给 Client Component，如果这个对象里有一个函数，会发生什么？
- [ ] 页签的两个版本（纯 CSS / Client Component），各自给浏览器发了多少字节？

---

## 阶段 3 · 图鉴与背景故事

> 对应 ROADMAP 阶段 3

### 学到什么

| 能力 | 是谁的 | 干什么 |
|---|---|---|
| **动态路由的完整形态** | Next | `app/[lang]/units/[slug]/page.tsx` 一个文件顶 28 个页面 |
| `generateStaticParams` 规模化 | Next | 构建时按数据展开，不是运行时算 |
| 构建时数据管线 | — | 从外部数据源导出 → `content/` → 渲染 |
| `notFound()` / `not-found.tsx` | Next | 访问不存在的 slug 该怎么办 |

### 这一步的意义

这是你最初那个需求——「将来会增加很多细节页面」——**真正被解决的地方**。

旧站里加一个细节页 = 写一个新的 `render_*()` 函数 + 往 `PAGES` 表里加一行。这里加 28 个页面 = **零个新文件**，数据里多 28 行而已。

顺带你会理解一件事：**动态路由 ≠ 动态页面**。`generateStaticParams` 展开出来的 28 个页面全是构建时生成的静态 HTML，和手写 28 个文件的产物一模一样，只是源码里只有一份。

### 自测

- [ ] `generateStaticParams` 返回的 28 个 slug，是在什么时候被执行的？部署之后再加一个兵种会怎样？
- [ ] 访问 `/zh/units/不存在的名字` 会发生什么？你希望它发生什么？
- [ ] 兵种页和人物页共用了哪些组件？共用的那部分是 Server 还是 Client？
- [ ] 如果一个兵种页需要显示「和其他兵种的数值对比」，这个对比是在服务端算还是客户端算？两种选择的差别是什么？

---

## 阶段 4 · 上线切换

> 对应 ROADMAP 阶段 4

### 学到什么

| 能力 | 是谁的 | 干什么 |
|---|---|---|
| Vercel 部署模型 | Next | 构建产物长什么样，哪些页面是静态的、哪些是动态的 |
| 环境变量 | Next | `.env.local` / Vercel 面板 / 哪些会进客户端包 |
| `redirects()` / `rewrites()` | Next | URL 层的重写与跳转 |

### 一个必须搞清楚的点

**`NEXT_PUBLIC_` 前缀。** 带这个前缀的环境变量会被**编译进客户端包**，任何人都能看到；不带的只在服务端可见。这条在阶段 7 是安全边界，现在先建立习惯。

### 自测

- [ ] 部署后看 Vercel 的构建输出：哪些路由标着「Static」，哪些标着「Dynamic」？为什么？
- [ ] 一个不带 `NEXT_PUBLIC_` 的环境变量，在 Client Component 里读会拿到什么？
- [ ] 改一个 `content/` 里的文案，线上什么时候会变？需要做什么？

---

## 阶段 5 · 工坊数据

> 对应 ROADMAP 阶段 5

### 学到什么 —— **这是 Next 的核心，值得花最多时间**

| 能力 | 是谁的 | 干什么 |
|---|---|---|
| **Route Handlers** | Next | `app/api/*/route.ts`，后端接口和前端同仓库 |
| **`'use cache'`** | Next | 给函数结果加缓存，**缓存键从参数自动推导** |
| **`cacheLife()`** | Next | 缓存活多久：`seconds` / `minutes` / `hours` / `days` / `max` |
| **`cacheTag()`** | Next | 给缓存打标签，用于精确失效 |
| **`revalidateTag(tag, profile)`** | Next | 让某个 tag 失效——**内容变了不用重新部署** |
| **Cache Components / PPR** | Next | 静态外壳先发，动态部分挖洞流式补上 |
| Cron | Vercel | 定时触发 |

```ts
import { cacheLife, cacheTag } from 'next/cache'

export async function getVotes(fileId: string) {
  'use cache'
  cacheLife('hours')
  cacheTag(`votes:${fileId}`)
  return db.query(...)
}
```

### 这一步是分水岭

走到这里，「Next 到底比静态站多了什么」才算彻底想通。

静态站的模型是：**改内容 → 重新构建 → 重新部署 → 生效**。
这里的模型是：**数据变了 → `revalidateTag` → 立刻生效，代码一行没动，部署一次没有**。

PPR 更进一步：**同一个页面里，版式是静态的、数字是动态的**。你不用为了一个会变的数字把整页降级成动态渲染。

### ⚠️ 已知的 API 变化

`revalidateTag` **现在必须传第二个参数**（一个缓存档位），只传 tag 会报错：

```ts
revalidateTag('votes', 'max')
```

### 自测

- [ ] `'use cache'` 的缓存键是怎么算出来的？两次不同参数的调用会共用缓存吗？
- [ ] `cacheLife('hours')` 到期之后，下一个访问者会等新数据，还是先拿到旧的、后台再刷新？
- [ ] 开了 `cacheComponents` 之后，页面的哪部分是构建时生成的、哪部分是请求时补上的？怎么在浏览器里看出来？
- [ ] 如果 Steam 的 API 挂了，这个页面会怎样？你希望它怎样？

---

## 阶段 6 · 评论管线

> 对应 ROADMAP 阶段 6

**这一阶段 Next 的成分最少**，主要是 Node 脚本、HTML 解析、数据建模。学习价值不在框架上。

唯一值得注意的 Next 相关点：**长时间运行的任务不该放在请求路径上**。抓 147 条评论 + 跑分类要几十秒，这必须是后台任务写库，页面只读库——和阶段 7 的 LLM 分析是同一个道理。

### 自测

- [ ] 如果把抓取逻辑直接写进页面组件的 `await` 里，会发生什么？
- [ ] 为什么正文和分类标签要分两张表？（提示：哪张表会被重写很多次）

---

## 阶段 7 · 私有后台

> 对应 ROADMAP 阶段 7

### 学到什么

| 能力 | 是谁的 | 干什么 |
|---|---|---|
| **`proxy.ts`** | Next | 请求进入路由之前拦一道（Next 16 起，原 `middleware.ts`） |
| **Server Actions（`'use server'`）** | React | 表单和写入不用手写 API 层 |
| **`<Suspense>` / Streaming** | React | 慢的部分挂起，外壳先到 |
| **RSC 的数据泄漏边界** | React | 什么数据传给客户端会被看见 |

### ⚠️ `proxy.ts` 的坑

- Next 16 起 `middleware.ts` 改名叫 `proxy.ts`，导出的函数也从 `middleware` 改叫 `proxy`
- **只有 nodejs runtime，不支持 edge**。要 edge 得继续用 `middleware.ts`
- 两个文件同时存在会构建报错。`npx @next/codemod@canary middleware-to-proxy .` 能自动迁

### 这一步真正要学的是安全边界

三条，少一条就漏：

1. **matcher 要覆盖接口**，不只是页面。漏了 `/api/admin/*`，别人直接打接口就能把数据全捞走
2. **私有数据别传给 Client Component**。这是阶段 2 那个「序列化进 HTML」的问题，在这里从性能问题变成安全问题
3. **环境变量没配时要挡住**，`if (!secret) return notFound()`。少了这行，`undefined === undefined` 会直接放行

### 自测

- [ ] `proxy.ts` 在什么时候执行？在 layout 之前还是之后？
- [ ] 一个 Server Component 里 `const key = process.env.ADMIN_KEY`，然后把它传给 Client Component 的 props——查看网页源代码能看到这个 key 吗？
- [ ] Server Action 和 Route Handler 的区别是什么？什么时候该用哪个？
- [ ] `<Suspense>` 包住的那部分，HTML 是怎么到达浏览器的？和普通渲染有什么不同？

---

## 学完之后

七个阶段走完，Next 的主要能力你都真写过一遍，而且做出来的东西你自己每天在用。

那时候回头看两个问题，你应该能自己回答：

1. **一个新项目该不该用 Next.js？** 判据：页面内容在「构建那一刻」能不能全部确定？能 → 不需要 Next。
2. **这个项目当初该不该用 Next.js？** ——这个问题的答案会比现在诚实，因为是有依据的。
