// module.exports = {
//   root: true,
//   env: {
//     node: true
//   },
//   'extends': [
//     'plugin:vue/essential',
//     '@vue/standard'
//   ],
//   rules: {
//     'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
//     'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
//   },
//   parserOptions: {
//     parser: 'babel-eslint'
//   }
// }

module.exports = {
    root: true,
    env: {
        node: true
    },
    'extends': [
        'plugin:vue/essential',
        '@vue/standard'
    ],
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'camelcase': [2, { 'properties': 'never' }],// 强制驼峰命名法
        "vue/component-name-in-template-casing": ["error", "PascalCase", {
            "registeredComponentsOnly": true,
            "ignores": []
        }],
        // "vue/name-property-casing": ["error", "PascalCase"],
        "vue/require-prop-types": "error",
        "vue/require-v-for-key": "error", // v-for必须绑定key
        "vue/no-use-v-if-with-v-for": ["error", {  // 不允许v-if与v-for同时作用于同一个的dom元素
            "allowUsingIterationVar": false
        }],
        // "vue/max-attributes-per-line": ["error", {
        //     "singleline": 3,
        //     "multiline": {
        //         "max": 1,
        //         "allowFirstLine": false
        //     }
        // }],
        "vue/v-bind-style": ["error", "shorthand"], // v-bind使用缩写 :
        "vue/v-on-style": ["error", "shorthand"], // v-on使用缩写
        "vue/order-in-components": ["error", {
            "order": [
                "el",
                "name",
                "parent",
                "functional",
                ["delimiters", "comments"],
                ["components", "directives", "filters"],
                "extends",
                "mixins",
                "inheritAttrs",
                "model",
                ["props", "propsData"],
                "data",
                "computed",
                "watch",
                "LIFECYCLE_HOOKS",
                "methods",
                ["template", "render"],
                "renderError"
            ]
        }],
        "vue/attributes-order": ["error", {
            "order": [
                "DEFINITION",
                "LIST_RENDERING",
                "CONDITIONALS",
                "RENDER_MODIFIERS",
                "GLOBAL",
                "UNIQUE",
                "TWO_WAY_BINDING",
                "OTHER_DIRECTIVES",
                "OTHER_ATTR",
                "EVENTS",
                "CONTENT"
            ]
        }]
    },
    parserOptions: {
        parser: 'babel-eslint'
    },
    plugins: [
        'vue',
        'prettier'
    ]
}
