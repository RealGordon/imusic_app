//const path=require("path");
module.exports={

    mode:"development",
  
    entry:
    'path\\to\\static\\imusic\\index.js',
    output:{
        filename:'index.compiled_typescript.js',
       
        path:
        "path\\to\\static\\imusic\\output",
    },
    module: {
        rules: [
          {
            test: /\.m?js$/,
            exclude: /node_modules/,
            use: {
              loader: "path\\to\\node_modules\\babel-loader",
              options: {
                presets: [ "path\\to\\@babel\\preset-react"
                ]
              }
            }
          },
          {
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/,
          },
        ]
      },
      resolve: {
        extensions: ['.tsx', '.ts', '.js'],
      }
}
