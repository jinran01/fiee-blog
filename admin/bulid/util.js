const cssLoader = {
    loader: 'css-loader',
    options: {
        minimize: process.env.NODE_ENV === 'production',
        sourceMap: options.sourceMap
    }
}
const px2remLoader = {
    loader: 'px2rem-loader',
    options: {
        //一般设置75
        remUnit: 35
    }
}

function generateLoaders(loader, loaderOptions) {
    const loaders = options.usePostCSS ? [cssLoader, postcssLoader,px2remLoader] : [cssLoader,px2remLoader]
    if (loader) {
        loaders.push({
            loader: loader + '-loader',
            options: Object.assign({}, loaderOptions, {
                sourceMap: options.sourceMap
            })
        })
    }
    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
        return ExtractTextPlugin.extract({
            use: loaders,
            fallback: 'vue-style-loader'
        })
    } else {
        return ['vue-style-loader'].concat(loaders)
    }
}

//1、lib-flexible：是 rem 的适配插件。（例：750px == 10rem）
//2、px2rem-loader ：是为了方便在书写CSS时，输入 px 会 自动转为 rem。
//3、有时 用 ‘px2rem-loader ’ 插件，发现 rem 转换不正确。
