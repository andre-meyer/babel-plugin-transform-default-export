const babel = require('babel-core');
const plugin = require('../')

var defaultImport = `
import Box from '@material-ui/core/Box';
`;

var manyDefaultImports = `
import Box from '@material-ui/core/Box';
import SvgIcon from '@material-ui/core/SvgIcon';
import Modal from '@material-ui/core/Modal';

import RouterIcon from '@material-ui/icons/RouterIcon';
`;

var renamedDefaultImports = `
import Renamed from '@material-ui/styles/NotTheName';
`;

var nonDefaultImport = `
import { Box } from '@material-ui/core';
`;

var kindaDefaultMemberImport = `
import { makeStyles } from '@material-ui/core/styles';
`;

var multipleMemberImport = `
import { makeStyles, useTheme } from '@material-ui/core/styles';
`

var invalidMultipleMemberImport = `
import { amber, green } from '@material-ui/core/colors';
`

describe('default import transform', () => {
  it('transforms default import', () => {
    const {code} = babel.transform(defaultImport, {plugins: [plugin]});
    expect(code).toMatchSnapshot();
  });

  it('transforms many default imports', () => {
    const {code} = babel.transform(manyDefaultImports, {plugins: [plugin]});
    expect(code).toMatchSnapshot();
  })

  it('transform altering names from default import', () => {
    const {code} = babel.transform(renamedDefaultImports, {plugins: [plugin]});
    expect(code).toMatchSnapshot();
  })

  it('transforms memberstyle imports when nested', () => {
    const {code} = babel.transform(kindaDefaultMemberImport, {plugins: [plugin]});
    expect(code).toMatchSnapshot();
  })

  it('transforms multiple memberstyle imports when nested', () => {
    const {code} = babel.transform(multipleMemberImport, {plugins: [plugin]});
    expect(code).toMatchSnapshot();
  })

  it('transforms with special rules for unknown nested subpacke imports', () => {
    const {code} = babel.transform(invalidMultipleMemberImport, {plugins: [plugin]});
    expect(code).toMatchSnapshot();
  })

  it('does not transform member import', () => {
    const {code} = babel.transform(nonDefaultImport, {plugins: [plugin]});
    expect(code).toMatchSnapshot();
  })
})