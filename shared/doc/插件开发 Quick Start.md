> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [ld246.com](https://ld246.com/article/1723732790981)

> Last Updated: 2025-09-10 前提说明 本文并非手把手的插件开发教程 本文旨在提供给有一定经验的开发者编写的思源插件开发指南，以帮助他们降低插件开发的门槛 很多前置技术会默认读者已经会了，同时语言风格上会偏向简略而不做过多解释。

🕐 **Last Updated**: 2025-09-1
🔔 **前提说明**

1.  本文并非手把手的插件开发教程
    
    *   本文旨在提供给有一定经验的开发者编写的思源插件开发指南，以帮助他们降低插件开发的门槛
    *   很多前置技术会默认读者已经会了，同时语言风格上会偏向简略而不做过多解释。
2.  本文也并非插件开发的说明文档
    
    1.  只包含我个人认为的最常用的概念和用法
        
    2.  关于插件如何发布、更新；请阅读官方插件模板的 [README](https://ld246.com/forward?goto=https%3A%2F%2Fgithub.com%2Fsiyuan-note%2Fplugin-sample%2Fblob%2Fmain%2FREADME.md)，不在这里赘述
        
    3.  思源的插件开发的文档并不充分（人手不足），如果你想要自行研究，请参考
        
        1.  siyuan 提供的 [d.ts 声明文件](https://ld246.com/forward?goto=https%3A%2F%2Fgithub.com%2Fsiyuan-note%2Fpetal)
            
        2.  扒思源源代码
            
        3.  [社区文档](https://ld246.com/forward?goto=https%3A%2F%2Fdocs.siyuan-note.club%2Fzh-Hans%2Freference%2F) （同样不全面）
            
        4.  或者加入思源爱好者 QQ 群进行技术咨询
            
            ![](https://b3logfile.com/file/2025/05/siyuan/1646569891270/assets/image-20240731195519-xgw9ya7.png?imageView2/2/interlace/1/format/webp)
            

START UP
--------

思源插件开发的常规流程如下：

1.  使用插件模板，新建 github 项目
2.  在本地使用 nodejs 环境进行开发
3.  打包项目，创建 github release
4.  推送到集市中

### 插件开发的依赖环境

1.  nodejs 环境
    
2.  `npm install siyuan`
    
    *   一个纯 typescript 接口声明项目
    *   内部声明了思源插件的各种 API
    *   由于思源缺少插件文档，所以你有必要认真阅读内部的接口定义

### 单开一个工作空间

当你进行插件开发的时候，请**单独开一个工作空间**！尽可能避免因为插件开发中遇到的意外情况，对你自己的笔记数据造成不利影响。

### 从模板中构建

目前官方 SiYuan 仓库下提供的插件开发模板有两套：

*   [SiYuan plugin sample](https://ld246.com/forward?goto=https%3A%2F%2Fgithub.com%2Fsiyuan-note%2Fplugin-sample)
    
    *   思源核心开发者提供，但是并不推荐使用
*   [SiYuan plugin sample (Vite & Svelte)](https://ld246.com/forward?goto=https%3A%2F%2Fgithub.com%2Fsiyuan-note%2Fplugin-sample-vite-svelte)
    
    *   使用 **vite** 打包项目，并内置了对 **svelte** 的支持
    *   💡 **更推荐使用**
    *   提供了软链接、热重载等功能；内置 typescript 类型声明、一系列 util 函数；内置一系列 svelte 组件
*   [SiYuan plugin sample (Vite & Vue)](https://ld246.com/forward?goto=https%3A%2F%2Fgithub.com%2Fsiyuan-note%2Fsiyuan-flashcard-title-toolbox-plugin)
    
    *   使用 **vite** 打包项目，并内置了对 **vue** 的支持
    *   💡 **更推荐使用**
    *   提供了软链接、热重载等功能；内置 typescript 类型声明、一系列 util 函数；内置一系列 vue 组件

你可以选择在 github 上点击 "Use Template"，然后 clone 到本地。

或者另一种选择是使用 npm 的 [siyuan-plugin-cli](https://ld246.com/forward?goto=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fsiyuan-plugin-cli) 工具，在本地命令行中选择拉取某个模板的程序。

#### 关于框架

其他选择：

*   [frostime/plugin-sample-vite](https://ld246.com/forward?goto=https%3A%2F%2Fgithub.com%2Ffrostime%2Fplugin-sample-vite) 项目，剔除了 svelte 的部分，其他的和 svelte 模板保持了一致
*   [frostime/plugin-sample-vite-solidjs](https://ld246.com/forward?goto=https%3A%2F%2Fgithub.com%2Ffrostime%2Fplugin-sample-vite-solidjs) 项目，基于 solidjs 框架，其他部分基本和 svelte 模板保持一致

> ❓ 为什么是 svelte，而不是更加常见的例如 react 框架？
> 
> *   React 的流行主要源自其先发地位和优秀的生态环境；但是在插件开发的场景下，前端库的生态如何、组件库是否够多带来的影响并不大
> *   svelte 足够轻量级、性能足够高；而 React 这类基于 vdom 的框架，往往打包结果偏大，并不适合插件开发这种小型项目
> *   svelte 的开发和上手成本最低

### 插件的生命周期

![](https://b3logfile.com/file/2025/05/siyuan/1646569891270/assets/6317cf25a7642e03e6e142e1eaa8c434-20240801114854-7w3nmxe.png?imageView2/2/interlace/1/format/webp)

#### Plugin 的生命周期 Hooks

```
import { Plugin } from 'siyuan';

class MyPlugin extends Plugin {
    onload() {
      //插件的入口函数，一个 minimum 的插件至少要包含 onload 的实现, 最常用
      //onload 可以被声明为一个 async 函数
    }

    onLayoutReady() {
      //布局加载完成的时候，会自动调用这个函数
    }

    onunload() {
      //当插件被禁用的时候，会自动调用这个函数
    }

    uninstall() {
      //当插件被卸载的时候，会自动调用这个函数
    }
}
```

#### eventbus

在插件中有一个 `eventBus` 对象。

```
class Plugin {
  eventBus: EventBus;
}
```

你可以使用 `plugin.eventBus.on('some event', callback func)`，为插件注册一个总线事件的回调函数，让插件在思源的特定时刻执行一些特别的功能，例如:

```
import { Plugin } from 'siyuan';

class MyPlugin extends Plugin {
    cbBound: this.cb.bind(this);

    cb({ detail} ) {
      console.log('刚刚打开了一个新的文档！');
    }

    onload() {
      this.eventBus.on('loaded-protyle-dynamic', this.cbBound);
    }

    onunload() {
      this.eventBus.off('loaded-protyle-dynamic', this.cbBound);
    }
}
```

关于 event bus 支持哪些事件，请自行阅读 d.ts API 文件。

几个重要概念
------

### 内核 API 与插件 API

思源基于 BS 架构，故而当我们说思源的 API 的时候，需要区分两套不同的 API：

1.  内核 API：思源的后端开放的网络 API，通过发出网络请求来调用（如 js 的 `fetch`、python 的 `requests` 等）
    
    *   内核 API 往往和数据、思源底层配置相关
        
    *   内核 API 也可以分为两部分
        
        *   开放 API
            
            *   这部份的 API 是思源已经明确固定，肯定不会变动的 API
            *   可以参考 [API 文档](https://ld246.com/forward?goto=https%3A%2F%2Fgithub.com%2Fsiyuan-note%2Fsiyuan%2Fblob%2Fmaster%2FAPI_zh_CN.md)查看详细的用法
        *   非开放 API
            
            *   这部分 API 本质上和开放 API 没有什么区别，同样可以自由地通过网络请求来调用
            *   但是这部分 API 被定义为「不稳定的 API」，这意味着开发者理论上有权力不考虑第三方的使用需求而对 API 进行更改
            *   这部分 API 没有官方的说明文档，如果你想要使用，只能去自行检查思源的网络请求或者查看思源后端的 api 代码，并自行推导出使用方式
            *   相关源代码见：[https://github.com/siyuan-note/siyuan/tree/master/kernel/api](https://ld246.com/forward?goto=https%3A%2F%2Fgithub.com%2Fsiyuan-note%2Fsiyuan%2Ftree%2Fmaster%2Fkernel%2Fapi)
2.  插件 API：专供插件使用的 javascript 前端 API
    
    *   只能在插件当中使用
    *   在插件开发中，通过 `require('siyuan')` 获取 API 对象
    *   详情见插件 API 类型定义接口：[https://github.com/siyuan-note/petal](https://ld246.com/forward?goto=https%3A%2F%2Fgithub.com%2Fsiyuan-note%2Fpetal)

### Protyle

Protyle 是思源中最重要的概念，他是指的是一个完整的思源文档对象。最核心的部分是这两个：

*   element：文档的前端 HTML 元素
*   ws 连接：通过 websocket 和后端相连，实时读取思源本体的数据

你可以打开开发者模式，可以看到每个文档的顶层 div 都是一个含有 `protyle` 类名的元素。这里的 protyle 就代表了完整的文档。

![](https://b3logfile.com/file/2025/05/siyuan/1646569891270/assets/image-20240731201659-bli82ae.png?imageView2/2/interlace/1/format/webp)

一个 protyle 中最重要的组成部分如下：

1.  title：文档的块标题部分
    
2.  wysiwyg：所见即所得编辑器（what you see is what you get），是整个思源最核心的部分
    
    > 注意：尽量不要手动改 DOM！如果想要更改文档内容，请使用后端 API。
    
3.  gutter：也就是块图标；一个文档内共用一个元素
    

### Block 和 Node

*   Block 是思源内核中的概念，对应的是 SQLITE 数据库当中的 Block 对象
*   Node 是前端的概念，一个 Block 在前端往往通过一个 Node 来表示；wysiwyg 中就是由若干个 Node 组成的

以下是一个 protyle 当中标题块对应的元素:

```
<div data-subtype="h3" data-node-id="20240731174116-tu1nxd3" data-node-index="28" data-type="NodeHeading" class="h3" updated="20240731200430">
  <div contenteditable="true" spellcheck="false">Block 和 Node</div>
  <div class="protyle-attr" contenteditable="false"></div>
</div>
```

*   `data-node-id` 对应了块的 ID
*   `data-type` 对应了块的 type
*   `data-subtype` 对应了块的 subtype

‍

HOWTO
-----

这部分快速地介绍在思源插件开发中，常常会遇到的需求，以及如何实现对应的需求。

### 注册顶栏图标

你可以调用 `plugin.addTopbar` 来为插件添加一个顶栏的按钮。

![](https://b3logfile.com/file/2025/05/siyuan/1646569891270/assets/image-20240731175413-cyqym0q.png?imageView2/2/interlace/1/format/webp)

```
/**
   * Must be executed before the synchronous function.
   * @param {string} [options.position=right]
   * @param {string} options.icon - Support svg id or svg tag.
   */
  addTopBar(options: {
      icon: string,
      title: string,
      callback: (event: MouseEvent) => void
      position?: "right" | "left"
  }): HTMLElement;
```

思源中最常见的实践方案是：

1.  为插件注册一个 topbar 按钮
2.  当点击按钮的时候，显示一个 Context Menu 来进一步触发更多的功能（详情请见后面的部分）

### 使用 icon

*   在思源插件的很多 API 中，会有一个 `icon` 参数
    
*   这个参数需要传入一个 [svg symbol](https://ld246.com/forward?goto=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FSVG%2FElement%2Fsymbol) 的名称，例如我们可以传入一个名称为 `iconRight` 的参数
    
    ```
    <svg class="b3-menu__icon b3-menu__icon--small">
      <use xlink:href="#iconRight"></use>
    </svg>
    ```
    
*   在 `body>svg>defs` 下，你可以查看到所有思源内置的 `symbol`
    
*   你可以可以调用 `plugin.addIcons` 来传入自定义的 svg symbol，例如
    
    ```
    plugin.addIcons(`
    <symbol id="iconUrl" viewBox="0 0 1024 1024">
    <path d="M578.133 675.627c-3.306-3.307-8.746-3.307-12.053 0L442.133 799.573c-57.386 57.387-154.24 63.467-217.6 0-63.466-63.466-57.386-160.213 0-217.6L348.48 458.027c3.307-3.307 3.307-8.747 0-12.054l-42.453-42.453c-3.307-3.307-8.747-3.307-12.054 0L170.027 527.467c-90.24 90.24-90.24 236.266 0 326.4s236.266 90.24 326.4 0L620.373 729.92c3.307-3.307 3.307-8.747 0-12.053l-42.24-42.24z m275.84-505.6c-90.24-90.24-236.266-90.24-326.4 0L403.52 293.973c-3.307 3.307-3.307 8.747 0 12.054l42.347 42.346c3.306 3.307 8.746 3.307 12.053 0l123.947-123.946c57.386-57.387 154.24-63.467 217.6 0 63.466 63.466 57.386 160.213 0 217.6L675.52 565.973c-3.307 3.307-3.307 8.747 0 12.054l42.453 42.453c3.307 3.307 8.747 3.307 12.054 0l123.946-123.947c90.134-90.24 90.134-236.266 0-326.506z"></path><path d="M616.64 362.987c-3.307-3.307-8.747-3.307-12.053 0l-241.6 241.493c-3.307 3.307-3.307 8.747 0 12.053l42.24 42.24c3.306 3.307 8.746 3.307 12.053 0L658.773 417.28c3.307-3.307 3.307-8.747 0-12.053l-42.133-42.24z"></path>
    </symbol>
    `);
    ```
    

你可以在开发者模式当中看到所有的 symbol 定义

![](https://b3logfile.com/file/2025/05/siyuan/1646569891270/assets/image-20240815182549-k81nkl3.png?imageView2/2/interlace/1/format/webp)

如何自己制作一个 symbol 呢？你可以在网上找到很多自动化的工具，不过大部分时候，也可以手动解决。

1.  找到一个你喜欢的 svg 图标（例如在 [https://www.iconfont.cn/](https://ld246.com/forward?goto=https%3A%2F%2Fwww.iconfont.cn%2F) 上面）
    
2.  下载下来，并修改 svg 字符串
    
    1.  把 svg 标签名称改成 symbol
    2.  去掉 svg 当中关于固定的颜色、固定的尺寸等相关的属性

![](https://b3logfile.com/file/2025/05/siyuan/1646569891270/assets/image-20240815182918-mprnmn9.png?imageView2/2/interlace/1/format/webp)

通过插件创建 / 打开菜单需要三步：

1.  `new Menu` 创建一个菜单对象
2.  使用 `menu.addItem` 添加菜单项目
3.  使用 `menu.open` 显示菜单

例如以下是一个点击 topbar 按钮显示菜单的案例

```
import { Menu } from 'siyuan';

private addMenu() {
    const menu = new Menu("myPluginMenu", () => {
        console.log("Menu will close");
    });
    menu.addItem({
        icon: "iconInfo",
        label: "About",
        click: () => {
            // 菜单项的回调
        }
    });
    menu.open({ x: 0, y: 0 }); // 显示菜单
}
```

addItem 的具体参数，参考插件类型中的 `IMenuItemOption`

```
export interface IMenuItemOption {
    iconClass?: string;
    label?: string;
    click?: (element: HTMLElement, event: MouseEvent) => boolean | void | Promise<boolean | void>;
    type?: "separator" | "submenu" | "readonly";
    accelerator?: string;
    action?: string;
    id?: string;
    submenu?: IMenuItemOption[];
    disabled?: boolean;
    icon?: string;
    iconHTML?: string;
    current?: boolean;
    bind?: (element: HTMLElement) => void;
    index?: number;
    element?: HTMLElement;
}
```

### 注册块菜单

![](https://b3logfile.com/file/2025/05/siyuan/1646569891270/assets/image-20240815191851-hi4lrbv.png?imageView2/2/interlace/1/format/webp)

块菜单事件，可以通过 eventBus 来注册。以下示例参考 [sy-bq-callout/index.ts](https://ld246.com/forward?goto=https%3A%2F%2Fgithub.com%2Ffrostime%2Fsy-bq-callout%2Fblob%2Fmain%2Fsrc%2Findex.ts)

```
export default class BqCalloutPlugin extends Plugin {

    private blockIconEventBindThis = this.blockIconEvent.bind(this);

    async onload() {
        this.eventBus.on("click-blockicon", this.blockIconEventBindThis);
    }

    async onunload() {
        this.eventBus.off("click-blockicon", this.blockIconEventBindThis);
    }

    private blockIconEvent({ detail }: any) {
        //  强行请查看 click-blockicon eventBus 的类型定义
        let menu: Menu = detail.menu;
        let submenus = [];
        submenus.push({
            element: callout.createCalloutButton("", {id: this.i18n.mode.big, icon: '🇹'}),
            click: () => {
                setBlockAttrs(ele.getAttribute("data-node-id"), {
                    'custom-callout-mode': 'big',
                });
            }
        });
        submenus.push({
            element: callout.createCalloutButton("", {id: this.i18n.mode.small, icon: '🇵'}),
            click: () => {
                setBlockAttrs(ele.getAttribute("data-node-id"), {
                    'custom-callout-mode': 'small',
                });
            }
        });
        menu.addItem({
            icon: "iconInfo",
            label: this.i18n.name,
            type: "submenu",
            submenu: submenus
        });
    }

}
```

文档块菜单和编辑器内的块菜单不在一起，而是一个单独的事件。

```
this.eventBus.on('click-editortitleicon', this.blockIconEventBindThis);
```

### 打开一个 Dialog

![](https://b3logfile.com/file/2025/05/siyuan/1646569891270/assets/image-20240815183249-vol0uoa.png?imageView2/2/interlace/1/format/webp)

通过插件创建 / 打开一个对话框需要调用 `Dialog` 对象，比如这样：

```
const dialog = new Dialog({
    title: "Hello",
    content: "This is a dialog",
    width: "500px",
    // 其他配置...
});
```

`Dialog` 是一个类，只要创建就会自动打开，不需要调用什么 open 方法。但是他有一个 `destroy` 方法可以手动关闭对话框。

在创建 Dialog 中的过程中，最重要的参数是 `content`，这是一个**字符串**，代表了对话框当中的内部内容。不过你也可以传入 `HTML` 字符串进去。比如下面这个案例（参考 [plugin-sample-vite-svelte/src/libs/dialog.ts](https://ld246.com/forward?goto=https%3A%2F%2Fgithub.com%2Fsiyuan-note%2Fplugin-sample-vite-svelte%2Fblob%2Fmain%2Fsrc%2Flibs%2Fdialog.ts)）

```
export const inputDialog = (args: {
    title: string, placeholder?: string, defaultText?: string,
    confirm?: (text: string) => void, cancel?: () => void,
    width?: string, height?: string
}) => {
    const dialog = new Dialog({
        title: args.title,
        content: `<div class="b3-dialog__content">
    <div class="ft__breakword"><textarea class="b3-text-field fn__block" style="height: 100%;" placeholder=${args?.placeholder ?? ''}>${args?.defaultText ?? ''}</textarea></div>
</div>
<div class="b3-dialog__action">
    <button class="b3-button b3-button--cancel">${window.siyuan.languages.cancel}</button><div class="fn__space"></div>
    <button class="b3-button b3-button--text" id="confirmDialogConfirmBtn">${window.siyuan.languages.confirm}</button>
</div>`,
        width: args.width ?? "520px",
        height: args.height
    });
    const target: HTMLTextAreaElement = dialog.element.querySelector(".b3-dialog__content>div.ft__breakword>textarea");
    const btnsElement = dialog.element.querySelectorAll(".b3-button");
    btnsElement[0].addEventListener("click", () => {
        if (args?.cancel) {
            args.cancel();
        }
        dialog.destroy();
    });
    btnsElement[1].addEventListener("click", () => {
        if (args?.confirm) {
            args.confirm(target.value);
        }
        dialog.destroy();
    });
};
```

每次都直接传入 HTML 字符串显然有些烦人。为了方便，我们可以使用 dialog 对象中的 `element` 元素，这个属性就代表了 Dialog 对象本身的 HTMLElement。比如我们可以把 Dialog 封装一下，让他接受一个传入的 Element：

```
//参考 https://github.com/siyuan-note/plugin-sample-vite-svelte/blob/main/src/libs/dialog.ts
export const simpleDialog = (args: {
    title: string, ele: HTMLElement | DocumentFragment,
    width?: string, height?: string,
    callback?: () => void;
}) => {
    const dialog = new Dialog({
        title: args.title,
        content: `<div class="dialog-content" style="display: flex; height: 100%;"/>`,
        width: args.width,
        height: args.height,
        destroyCallback: args.callback
    });
    dialog.element.querySelector(".dialog-content").appendChild(args.ele);
    return dialog;
}
```

‍

### 打开一个文档页面

*   在桌面端使用 tab 标签页打开一个块 ID
    
    ```
    import { openTab } from 'siyuan';
    
    openTab({
        app: plugin.app, //plugin 是你插件的 this 对象
        doc: {
            id: "文档或者块ID"
        }
    });
    ```
    
*   在移动端打开一个块文档，需要用另一个 API（移动端没有页面 Tab）
    
    ```
    openMobileFileById(plugin.app, blockId)
    ```
    

除此之外，还有一个方案，是使用 `siyuan://` 链接。比如你可以创建这么做：

```
const url = `siyuan://blocks/20240731174116-23lqdzi`;
window.open(url)
```

但是不推荐这种方案。

### 打开一个自定义 Tab

Tab 就是正中央的页签，他可以是文档，也可以是自定义的页面。

![](https://b3logfile.com/file/2025/05/siyuan/1646569891270/assets/image-20240815185213-pufh1pw.png?imageView2/2/interlace/1/format/webp)

在上一个小节当中，我们展示了使用 `openTab` 来打开一个文档。而如果你想要打开一个自定义的 tab，可以参考下面这个使用案例（参考 [sy-test-template/index.ts](https://ld246.com/forward?goto=https%3A%2F%2Fgithub.com%2Ffrostime%2Fsy-test-template%2Fblob%2Fmain%2Fsrc%2Findex.ts)）。

1.  `addTab` 创建一个 Tab 对象
    
    *   `type` 参数：传入 Tab 的唯一标识符
    *   在 `init` 函数中初始化内部 dom
2.  使用 `openTab` 打开 tab；对于 plugin 创建的自定义 tab 而言，id 为 `<Plugin 名称> + <type名称>`
    

```
import {
    Plugin,
    openTab
} from "siyuan";
import "@/index.scss";
import { createElement } from "./func";


export default class PluginTestTemplate extends Plugin {

    openTab() {
        const id = Math.random().toString(36).substring(7);
        this.addTab({
            'type': id,
            init() {
                this.element.style.display = 'flex';
                this.element.appendChild(createElement());
            }
        });
        openTab({
            app: this.app,
            custom: {
                title: 'TestTemplate',
                icon: 'iconMarkdown',
                id: this.name + id,
            }
        });
    }

}
```

### 判断插件的运行环境

插件在 plugin.json 中会填写允许运行的环境。

```
{
  "backends": [
    "windows",
    "linux",
    "darwin",
    "docker",
    "ios",
    "android"
  ],
  "frontends": [
    "desktop",
    "mobile",
    "browser-desktop",
    "browser-mobile",
    "desktop-window"
  ],
}
```

思源的 API 也提供了获取当前运行环境的功能。

```
function getFrontend(): "desktop" | "desktop-window" | "mobile" | "browser-desktop" | "browser-mobile";
function getBackend(): "windows" | "linux" | "darwin" | "docker" | "android" | "ios";
```

实践中最常见的用法是通过 `getFrontend` 判断是否为移动端环境；因为移动端环境的很多 DOM 结构和桌面端不同，需要插件做单独适配。（例如需要用 openMobileFileById 来打开一个文档）。以下是一个参考案例（参考 [sy-bookmark-plus](https://ld246.com/forward?goto=https%3A%2F%2Fgithub.com%2Ffrostime%2Fsy-bookmark-plus)）

```
//utils.ts
import { getFrontend } from 'siyuan';

export const isMobile = () => {
    return getFrontend().endsWith('mobile');
}

//components/item.tsx
import { isMobile } from "@/utils";

const openBlock = () => {
    if (isMobile()) {
        openMobileFileById(plugin.app, item().id);
    } else {
        openTab({
            app: plugin.app,
            doc: {
                id: item().id,
                zoomIn: item().type === 'd' ? false : true,
            },
        });
    }
};
```

‍

### 使用前端框架

在需要在 Dialog、Tab 等当中使用前端框架的时候，可以使用前端框架自带的渲染函数，将组件和页面中的 Element 绑定。以下是一个简单的案例，其中 `SettingExample` 是一个 Svelte 组件，我们在一个 Dialog 当中展示这个组件。

```
import SettingExample from "@/setting-example.svelte";

let dialog = new Dialog({
    title: "SettingPanel",
    content: `<div id="SettingPanel" style="height: 100%;"></div>`,
    width: "800px",
    destroyCallback: (options) => {
        console.log("destroyCallback", options);
        //You'd better destroy the component when the dialog is closed
        panel.$destroy();
    }
});
let panel = new SettingExample({
    target: dialog.element.querySelector("#SettingPanel"),
});
```

再比如，对于 vue 框架：

```
//参考: siyuan-plugin-picture-library
import Tab from './components/tab.vue';

this.addTab({
  type: TAB_TYPE,
  init() {
    const tab = createApp(Tab);
    tab.use(ElementPlus);
    tab.provide('plugin', plugin);
    tab.provide('folder', this.data);
    tab.mount(this.element);
  }
})
```

⚠️ **需要注意的是**：使用前端框架的时候，一定要小心不要出现**内存泄漏**问题。

思源的 Dialog 或者 Tab 等的销毁对于前端框架来说是外部的脚本行为，不涉及到前端组件的生命周期。所以当 Dialog 被销毁的时候，并不会触发组件当中的 `onUnMount` （`onDestroy`、`onCleanup`，各个前端框架的叫法不一样）钩子。

所以，如果你在前端框架中创建某些副作用并且需要在回收钩子函数中销毁（例如 `clearInterval`），建议在 Dialog 的 `destroyCallback` 中手动调用销毁方法以触发组件的回收声明周期。

这一点请参考：[https://ld246.com/article/1721278971170](https://ld246.com/article/1721278971170)

### 插件设置（Setting）

#### Data

插件可以使用 `plugin.saveData` 和 `plugin.loadData` 来写入 / 读取配置文件。

```
const File = 'config.json';
const DefaultConfig = {
  refresh: true,
  title: 'hello'
}

export default class PluginSample extends Plugin {

    async onload() {
        //读取
        let data = await this.loadData(File);
        data = data || DefaultConfig;  //如果不存在会返回空
  
        //保存
        this.saveData(File, data);
    }

}
```

插件的数据，会被保存在 `data/storage/petal/<name>/` 下。

#### UI

![](https://b3logfile.com/file/2025/05/siyuan/1646569891270/assets/image-20240815194618-9qc8lbb.png?imageView2/2/interlace/1/format/webp)

![](https://b3logfile.com/file/2025/05/siyuan/1646569891270/assets/image-20240815194704-kppabzx.png?imageView2/2/interlace/1/format/webp)

在思源插件中创建用户交互的设置面板一般有两种方案，三种方法

1.  实现 setting 对象
    
    1.  使用思源内置的 `plugin.setting`
    2.  使用插件模板提供的 `SettingUtils`
2.  实现 openSetting 方法
    
    *   使用自定义的 Setting 组件

`plugin.setting` 对象是思源提供的一个特殊的工具，可以帮助开发者创建一个 Setting 面板。

其中最重要的是 `createActionElement` 方法。

```
import { Setting } from 'siyuan';

this.setting = new Setting({
    confirmCallback: () => {
        this.saveData(STORAGE_NAME, {readonlyText: textareaElement.value});
    }
});
this.setting.addItem({
    title: "Readonly text",
    direction: "row",
    description: "Open plugin url in browser",
    createActionElement: () => {
        textareaElement.className = "b3-text-field fn__block";
        textareaElement.placeholder = "Readonly text in the menu";
        textareaElement.value = this.data[STORAGE_NAME].readonlyText;
        return textareaElement;
    },
});
```

可以看到 `plugin.setting` 用起来还是有点麻烦的，需要自己编写 `createActionElement`，同时还要独自处理 loadData 和 saveData。所以更推荐使用插件模板提供的 `SettingUtils` 工具（[plugin-sample-vite-svelte/libs/setting-utils.ts](https://ld246.com/forward?goto=https%3A%2F%2Fgithub.com%2Fsiyuan-note%2Fplugin-sample-vite-svelte%2Fblob%2Fmain%2Fsrc%2Flibs%2Fsetting-utils.ts)）。

```
import { SettingUtils } from "./libs/setting-utils";

export default class PluginSample extends Plugin {

    customTab: () => IModel;
    private isMobile: boolean;
    private blockIconEventBindThis = this.blockIconEvent.bind(this);
    private settingUtils: SettingUtils;

    async onload() {
        this.settingUtils = new SettingUtils({
            plugin: this, name: STORAGE_NAME
        });
        /*
          通过 type 自动指定 action 元素类型； value 填写默认值
        */
        this.settingUtils.addItem({
            key: "Input",
            value: "",
            type: "textinput",
            title: "Readonly text",
            description: "Input description",
            action: {
                // Called when focus is lost and content changes
                callback: () => {
                    // Return data and save it in real time
                    console.log(value);
                }
            }
        });
        this.settingUtils.addItem({
            key: "Select",
            value: 1,
            type: "select",
            title: "Select",
            description: "Select description",
            options: {
                1: "Option 1",
                2: "Option 2"
            },
            action: {
                callback: () => {
                    // Read data in real time
                    console.log(value);
                }
            }
        });

        await this.settingUtils.load(); //导入配置并合并
    }
}
```

不过 SettingUtils 只提供单面板的设置界面，而且自定义设置元素比较麻烦。所以如果你使用了前端框架的话，更推荐自行编写配置面板，这就需要重写 `openSetting` 方法。

当点击插件的「设置」按钮的时候，`plugin.openSetting` 方法会被自动调用。

![](https://b3logfile.com/file/2025/05/siyuan/1646569891270/assets/image-20240815195839-n430ijr.png?imageView2/2/interlace/1/format/webp)

```
import SettingExample from "@/setting-example.svelte";

openSetting(): void {
    let dialog = new Dialog({
        title: "SettingPanel",
        content: `<div id="SettingPanel" style="height: 100%;"></div>`,
        width: "800px",
        destroyCallback: (options) => {
            console.log("destroyCallback", options);
            //You'd better destroy the component when the dialog is closed
            panel.$destroy();
        }
    });
    let panel = new SettingExample({
        target: dialog.element.querySelector("#SettingPanel"),
    });
}
```

如果你使用了 [plugin-sample-vite-svelte](https://ld246.com/forward?goto=https%3A%2F%2Fgithub.com%2Fsiyuan-note%2Fplugin-sample-vite-svelte%2Fblob%2Fmain%2Fsrc%2Fsetting-example.svelte) 插件模板，那么该模板提供了可供参考的组件案例 [src/setting-example.svelte](https://ld246.com/forward?goto=https%3A%2F%2Fgithub.com%2Fsiyuan-note%2Fplugin-sample-vite-svelte%2Fblob%2Fmain%2Fsrc%2Fsetting-example.svelte)。

![](https://b3logfile.com/file/2025/05/siyuan/1646569891270/assets/image-20240815200507-fxu576j.png?imageView2/2/interlace/1/format/webp)

‍

### MISC: 插件和同步

思源可以在多个设备之间同步安装的插件，但是当插件遇到同步机制的时候，可能会遇到一些比较棘手的问题。

这一小节简单讨论一些插件开发中和同步相关的问题，主题较为零碎。

#### saveData 带来的 bug

对插件开发者而言，可能会自然而然地写出这样的代码：

```
async onload() {
    let config = await this.loadData(CONFIG_FILLE);
}

async onunload() {
    this.saveData(CONFIG_FILLE, this.config);
}
```

🐛 但是这种代码实际上会诱发一个潜在的 bug：假设存在一个设备 A，在 2024-08-27 A 上插件保存了一份 config.json 文件，这份 config.json 文件通过云同步算法放到了远端。现在有一个设备 B，他的数据版本还停留在 2024-08-01。现在我们在设备 B 上启动思源，会发生如下的事情：

1.  思源 B 启动
2.  插件启动，读取本地的 2024-08-01 版本的 config.json 文件
3.  思源开始同步数据，拉取到了运算的 2024-08-27 的数据
4.  本地的 2024-08-01 版本的 config.json 文件被替换为 2024-08-27 版本的 config.json
5.  **关键步骤来了**：当数据版本相差过大的时候，思源会自动重启；在重启的过程中，会 unload 插件，于是**插件把运行时读取到的 2024-08-01 版的 config 数据又写回到了本地文件，用旧的版本覆盖了新的版本！**
6.  思源 B 重启后，插件再次读取了 **2024-08-01 版的 config.json 文件**，并且同步数据——于是最新的 2024-08-27 的 config 数据就这么**丢失了**。

💡 为了避免这种情况发生：请不要在 onunload 中保存插件的数据！仅仅在配置信息发生改变的时候，才更新文件。

#### 插件的多端数据同步

v3.1.8 版本之后，如果插件同时在多端的思源实例中运行；当某个设备上插件对应的 petal/ 目录更新了数据之后，会通过同步提醒其他端。

当别的端接收到了 petal 目录的更改，就会重载插件（即，执行 unload + load）来保证插件数据状态的多端同步。

### 注册 Dock 侧边栏

![](https://b3logfile.com/file/2025/05/siyuan/1646569891270/assets/image-20240815201644-tlatb7s.png?imageView2/2/interlace/1/format/webp)

使用 plugin 的 `addDock` API：

*   config：配置侧边栏的位置、大小、标题等
*   data：传入一个 object，被传入 object 的对象，可以在 `init` api 里面直接被 `this` 获取
*   init：初始化函数；在这里可以使用 this 访问侧边栏的 element，从而设置内部的元素（所以不要用箭头函数来调用）

以下参考 [sy-bookmark-plus/src/index.ts](https://ld246.com/forward?goto=https%3A%2F%2Fgithub.com%2Ffrostime%2Fsy-bookmark-plus%2Fblob%2Fmain%2Fsrc%2Findex.ts)

```
this.addDock({
    type: '::dock',
    config: {
        position: 'RightBottom',
        size: {
            width: 200,
            height: 200,
        },
        icon: 'iconBookmark',
        title: 'Bookmark+'
    },
    data: {
        plugin: this,
        initBookmark: initBookmark,
    },
    init() {
        this.data.initBookmark(this.element, this.data.plugin);
    }
});
```

‍

### 注册快捷键

可以通过 `plugin.addCommand` 来注册一个快捷键操作。

```
this.addCommand({
    langKey: "showDialog",
    hotkey: "⇧⌘O",
    callback: () => {
        this.showDialog();
    },
    fileTreeCallback: (file: any) => {
        console.log(file, "fileTreeCallback");
    },
    editorCallback: (protyle: any) => {
        console.log(protyle, "editorCallback");
    },
    dockCallback: (element: HTMLElement) => {
        console.log(element, "dockCallback");
    },
});
```

这里面最关键的一个是 `hotkey` 一个是 callback 方法。 hotkey 必须按照特定的顺序设置才会生效。

```
export interface ICommandOption {
    langKey: string // 用于区分不同快捷键的 key
    langText?: string // 快捷键功能描述文本
    /**
     * 目前需使用 MacOS 符号标识，顺序按照 ⌥⇧⌘，入 ⌥⇧⌘A
     * "Ctrl": "⌘",
     * "Shift": "⇧",
     * "Alt": "⌥",
     * "Tab": "⇥",
     * "Backspace": "⌫",
     * "Delete": "⌦",
     * "Enter": "↩",
     */
    hotkey: string,
    customHotkey?: string,
    callback?: () => void // 其余回调存在时将不会触
    globalCallback?: () => void // 焦点不在应用内时执行的回调
    fileTreeCallback?: (file: any) => void // 焦点在文档树上时执行的回调
    editorCallback?: (protyle: any) => void // 焦点在编辑器上时执行的回调
    dockCallback?: (element: HTMLElement) => void // 焦点在 dock 上时执行的回调
}
```

当然，插件注册的 hotkey 是默认的 hotkey，而用户是可以在设置面板里面进行覆盖的。

![](https://b3logfile.com/file/2025/05/siyuan/1646569891270/assets/image-20240815225754-zkhd49o.png?imageView2/2/interlace/1/format/webp)

而如果你想要覆盖思源内置的快捷键，可以把快捷键配置的 `custom` 字段置空；等到恢复的时候，在从 `default` 中填写回来。

以下案例参考 Bookmark+ 插件

```
const bookmarkKeymap = window.siyuan.config.keymap.general.bookmark;

//禁用默认书签快捷键
bookmarkKeymap.custom = '';

//恢复快捷键
bookmarkKeymap.custom = bookmarkKeymap.default;
```

![](https://b3logfile.com/file/2025/05/siyuan/1646569891270/assets/image-20240815230000-kp6d11u.png?imageView2/2/interlace/1/format/webp)

### 注册 `/` 命令

![](https://b3logfile.com/file/2025/05/siyuan/1646569891270/assets/image-20240815213424-c6nqqm4.png?imageView2/2/interlace/1/format/webp)

`/` 命令，又称 slash 命令，就是思源中通过 `/` 触发，并快速在编辑器中插入某些元素的命令。

一个插件的 `/` 命令，可以通过设置 `plugin.protyleSlash` 属性来配置。

```
protyleSlash: {
    filter: string[],
    html: string,
    id: string,
    callback(protyle: Protyle): void,
}[];
```

*   filter：指触发命令的关键词
    
*   html：指在选择面板中显示的元素
    
*   id：唯一标识符
    
*   callback：Enter 选择命令项目后，触发的回调函数
    
    *   一般在 callback 当中，通过 `protyle.insert` 在编辑器中插入元素。

以下是一个案例：

```
let Templates = {
    datetime: {
        filter: ['xz', 'now'],
        name: 'Now',
        template: 'yyyy-MM-dd HH:mm:ss'
    },
    date: {
        filter: ['rq', 'date', 'jt', 'today'],
        name: 'Date',
        template: 'yyyy-MM-dd'
    },
    time: {
        filter: ['sj', 'time'],
        name: 'Time',
        template: 'HH:mm:ss'
    }
};


this.protyleSlash = Object.values(Templates).map((template) => {
    return {
        filter: template.filter,
        html: `<span>${template.name} ${formatDateTime(template.template)}</span>`,
        id: template.name,
        callback: (protyle: Protyle) => {
            let strnow = formatDateTime(template.template);
            console.log(template.name, strnow);
            protyle.insert(strnow, false);
        },
        //@ts-ignore
        update() {
            this.html = `<span>${template.name} ${formatDateTime(template.template)}</span>`;
        }
    }
});
```

效果如下：

![](https://b3logfile.com/file/2025/05/siyuan/1646569891270/assets/image-20240815214009-h8jy59d.png?imageView2/2/interlace/1/format/webp)

‍

ℹ️ Tips：一般使用 slash 命令都是希望在 protyle 里面插入一些什么东西。但是有些情况我们可能不想要插入内容，而是想要做别的操作，这就需要我们手动清理掉输入的 `/xxx` 了。具体方法是插入一个 `Lute.Carte` 字符，来清空前面的输入。这里给一个参考案例：[quick-attr 插件](https://ld246.com/forward?goto=https%3A%2F%2Fgithub.com%2Ffrostime%2Fsy-quick-attr%2Fblob%2Fc127d99762cee485ec597e29e479c6356f3177f7%2Fsrc%2Findex.ts%23L255)

```
protyle.insert(Lute.Carte);
```

### 插入自定义样式

大部分情况下，你只需要把样式写在 `index.css` 文件里面就可以了。但是有时候可能需要使用 JS 插入一些自定义的 style，这时你就会遇到一个问题：插入的自定义样式在导出 PDF 的时候无法生效。

解决这个问题的最简单的办法是：插入的 style 标签的 id 要以 `snippetCSS` 为开头，来模拟一个代码片段样式。

例如，[Callout 插件](https://ld246.com/forward?goto=https%3A%2F%2Fgithub.com%2Ffrostime%2Fsy-bq-callout%2Fblob%2Fmain%2Fsrc%2Fstyle.ts)中，所有动态更改的样式，都会放在一个 `style#snippetCSS-BqCallout` 当中，这样导出的 PDF 中，这些动态的样式同样会生效。

### 访问思源内部设置

访问 `window.siyuan` 变量；在内部中存储了大量思源内部的设置。

![](https://b3logfile.com/file/2025/05/siyuan/1646569891270/assets/image-20240815192530-ziu4ke1.png?imageView2/2/interlace/1/format/webp)

⚠️ **请以只读的方式来使用这个变量，不要随意更改内部的值！否则可能会造成意外的错误！**

### i18n（多语言支持）

在插件目录的 i18n/ 文件夹下的 json 文件会被自动导入。

插件运行时可以通过 `plugin.i18n` 对象来访问其中的内容。

如果嫌麻烦，也可以自行在 js 中处理；`window.siyuan.config.lang` 指向了当前思源呈现的语言。比如你可以这么干：

```
const I18N = {
    zh_CN: {
        warn: '⚠️ 注意Asset目录已更改！',
        menuLabel: '同本地 Markdown 文件同步',
    },
    en_US: {
        warn: '⚠️ Warning: Asset directory has changed!',
        menuLabel: 'Sync With Local Markdown File',
    }
};

let i18n: typeof I18N.zh_CN = window.siyuan.config.lang in I18N ? I18N[window.siyuan.config.lang] : I18N.en_US;
export default i18n;
```

‍

### 解析 markdown 文本

window 下有一个 Lute 变量，他是思源内部用来处理 markdown 解析的工具。

```
let lute = window.Lute.New();
lute.Md2HTML('## Hello')
// 输出: '<h2>Hello</h2>\n'
```

### 使用 Node/electron API

桌面端的思源可以直接访问一些 Node 环境的包和 electron API

```
const nodeFs = window.require('fs') as typeof import('fs');
const nodePath = window.require('path') as typeof import('path');
const electron = window.require('electron');
```

**⚠️ 一定不要使用 node fs 写思源的工作空间！**

插件或者外部扩展如果有直接读取或者写入 data 下文件的需求，请通过调用内核 API 来实现，**不要自行调用** **`fs`** **或者其他 electron、nodejs API**，否则可能会导致数据同步时分块丢失，造成云端数据损坏。

相关 API 见 `/api/file/*`（例如 `/api/file/getFile` 等）。