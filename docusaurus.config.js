// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');
const math = require('remark-math');
const katex = require('rehype-katex');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Python 教程',
  tagline: 'Python, 编程, 经验, 教程, 开源, 免费, 电子书, 下载, PDF, 示例, 面试',
  url: 'https://py.qizhen.xyz',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  projectName: 'python_book', // Usually your repo name.
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
		  sidebarCollapsed: false,
          // Please change this to your repo.
          editUrl: 'https://github.com/ruanqizhen/python_book/edit/main/',
		  routeBasePath: '/',
		  path: './docs',
		  remarkPlugins: [math],
		  rehypePlugins: [katex],
        },
		blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
		sitemap: {
          changefreq: 'weekly',
          priority: 0.5,
        },
        gtag: {
          trackingID: 'G-9EFRGQK2N0',
        },
      }),
    ],
  ],

  themeConfig: (
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    {
	  docs: {
        sidebar: {
          hideable: true,
        },
      },
      colorMode: {
        defaultMode: 'light',
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
      navbar: {
		hideOnScroll: true,
        title: 'Python 教程',
        logo: {
          alt: 'Python',
          src: 'img/logo.png',
		  href: '/'
        },
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
	  zoomSelector: '.markdown img',
	  metadata: [
		{name: 'keywords', content: 'Python, 编程, 经验, 教程, 开源, 免费, 电子书, 下载, PDF, 示例, 面试'},
		{name: 'description', content: 'Python 学习 面试'},
		{name: 'author', content: 'Qizhen Ruan 阮奇桢'},
	  ],
    }
  ),
  plugins: [
    function baiduPlugin(context, options) {
      return {
        name: 'baidu-plugin',
        injectHtmlTags({content}) {
		  return {
			postBodyTags: ['<script type="text/javascript" src="https://hm.baidu.com/hm.js?b3f6e7ec9302021671173e3fad14f4cd"></script>'
			],
		  };
		},
      };
    },
	[
      require.resolve("@easyops-cn/docusaurus-search-local"),
      {
        hashed: true,
        language: ["en", "zh"],
		docsRouteBasePath: "/",
		highlightSearchTermsOnTargetPage: true,
      },
    ],
    "./src/plugin/plugin-image-zoom",
  ],
  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css',
      type: 'text/css',
      integrity:
        'sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM',
      crossorigin: 'anonymous',
    },
  ],
};

module.exports = config;
