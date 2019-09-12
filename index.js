const types = require('@babel/types');

const opts = {
  packageMatch: [
    /@material-ui\/core/g,
    /@material-ui\/icons/g,
    /@material-ui\/styles/g
  ],
  naivelyTransformMemberImports: false, // unused
  naivelyTransformNestedImports: false // unused
}

const barf = (msg) => {
  throw new Error('babel-plugin-transform-default-export: ' + msg);
}

const getOptionsFromState = (state) => {
  // unused, configs are from this file, sorry :D
  return opts
}

module.exports = function() {
  return {
    visitor: {
      ImportDeclaration: function (path, state) {
        const opts = getOptionsFromState(state);

        const source = path.node.source.value;
        const defaultImports = path
          .node
          .specifiers
          .filter(
            (specifier) => specifier.type === 'ImportDefaultSpecifier'
          );

        const memberImports = path
          .node
          .specifiers
          .filter(
            (specifier) => specifier.type === 'ImportSpecifier'
          )

        const transforms = []
        let pkgName
        memberImports.forEach((memberImport, index) => {
          const packageStripRegex = opts.packageMatch.find((regex) => (
            regex.test(source)
          ));

          if (!packageStripRegex) return;

          const pkgStripped = source.replace(packageStripRegex, '')

          if (pkgStripped.length == 0) {
            // Imported the package at the root
            //    import Something from 'package-name'
            return
          }

          pkgName = source.replace(pkgStripped, '');

          // Imported the nested package, strip the slash to get the qualified name
          // const importName = pkgStripped.substring(1) // subpackage
          
          transforms.push(
            types.importSpecifier(
              types.identifier(memberImport.local.name), // import { THIS } 
              types.identifier(memberImport.local.name),// import { OTHER as THIS }
            )
          )
        })

        if (transforms.length > 0) {
          path.replaceWith(
            types.importDeclaration(
              transforms,
              types.stringLiteral(pkgName)
            )
          )
        }

        defaultImports.forEach((defaultImport, index) => {
          const packageStripRegex = opts.packageMatch.find((regex) => (
            regex.test(source)
          ));

          if (!packageStripRegex) return;

          const pkgStripped = source.replace(packageStripRegex, '')

          if (pkgStripped.length == 0) {
            // Imported the package at the root
            //    import Something from 'package-name'
            return
          }

          const pkgName = source.replace(pkgStripped, '');

          // Imported the nested package, strip the slash to get the qualified name
          const importName = pkgStripped.substring(1)

          if (importName.indexOf("/") > -1) {
            // Imported deeply nested package, doesn't work
            //    import Something from 'package-name/Deep/Something'
            barf("Can not transform imports nested more than 1 layer: " + source);
          }

          /*console.log(`
          import {
            ${defaultImport.local.name} as ${importName}
          } from '${pkgName}'
          `)*/
          path.replaceWith(
            types.importDeclaration(
              [types.importSpecifier(types.identifier(defaultImport.local.name), types.identifier(importName))],
              types.stringLiteral(pkgName)
            )
          )
        })
      }
    }
  }
}