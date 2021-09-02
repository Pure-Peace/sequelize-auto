// put in seperate file to keep main sequelize-auto clean
'use strict';

var Sequelize = require('sequelize');
var _ = Sequelize.Utils._;

function getModelFileStart(indentation, spaces, tableName, delegate) {
  var fileStart = "/* jshint indent: " + indentation + " */\n";
  fileStart += '// tslint:disable\n';
  fileStart += "import sequelize from 'sequelize';\n";
  fileStart += "import { Application } from 'egg';\n"
  fileStart += "export default function(app: Application) {\n";
  fileStart += spaces + 'return app.' + delegate + '.define(\'' + tableName + '\', {\n';
  return fileStart;
}

function generateTableModels(tableNames, isSpaces, indentation, isCamelCase, isCamelCaseForFile) {
  var spaces = '';
  for (var i = 0; i < indentation; ++i) {
    spaces += (isSpaces === true ? ' ' : "\t");
  }

  return generateImports() + generateInterface() + generateTableMapper();

  function generateImports() {
    var fileTextOutput = '// tslint:disable\n';
    fileTextOutput += 'import * as path from \'path\';\n';
    fileTextOutput += 'import * as sequelize from \'sequelize\';\n';
    fileTextOutput += 'import * as def from \'./db\';\n\n';
    return fileTextOutput;
  }

  function generateInterface() {
    var fileTextOutput = 'export interface ITables {\n';
    for (var i = 0; i < tableNames.length; i++) {
      var table = isCamelCase ? _.camelCase(tableNames[i]) : tableNames[i];

      fileTextOutput += spaces + table + ':def.' + table + 'Model;\n';
    }
    fileTextOutput += '}\n\n';
    return fileTextOutput;
  }

  function generateTableMapper() {
    var fileTextOutput = 'export const getModels = function(seq:sequelize.Sequelize):ITables {\n';
    fileTextOutput += spaces + 'const tables:ITables = {\n';
    for (var i = 0; i < tableNames.length; i++) {
      var tableForClass = isCamelCase ? _.camelCase(tableNames[i]) : tableNames[i];
      var tableForFile = isCamelCaseForFile ? _.camelCase(tableNames[i]) : tableNames[i];

      fileTextOutput += spaces + spaces + tableForClass + ': seq.import(path.join(__dirname, \'./' + tableForFile + '\')),\n';
    }
    fileTextOutput += spaces + '};\n';
    fileTextOutput += spaces + 'return tables;\n';
    fileTextOutput += '};\n';
    return fileTextOutput;
  }
}

exports.model = {
  getModelFileStart,
  generateTableModels
};

function getDefinitionFileStart() {
  return '// tslint:disable\nimport * as Sequelize from \'@types/sequelize\';\n\n';
}

function getTableDefinition(tsTableDefAttr, tableName) {
  var tableDef = '\n// table: ' + tableName + '\n';
  tableDef += tsTableDefAttr + '\n}\n';
  tableDef += 'export interface ' + tableName + 'Instance extends Sequelize.Instance<' + tableName + 'Attribute>, ' + tableName + 'Attribute { }\n';
  tableDef += 'export interface  ' + tableName + 'Model extends Sequelize.Model<' + tableName + 'Instance, ' + tableName + 'Attribute> { }\n';
  return tableDef;
}

function getEggDefines(delegate, tableNames) {
  var defs = tableNames.map(tableName => {
    return `      ${_.upperFirst(tableName)}: ${tableName}Model,\n`
  }).join('');
  var def =
    `
declare module 'egg' {
  interface Context {
    ${delegate}: Sequelize.Sequelize & {
${defs}
    }
  }
  interface Application {
    ${delegate}: Sequelize.Sequelize & {
${defs}
    }
  }
}
  `;
  return def;
}

// doing this in ts helper to not clutter up main index if statement
function getMemberDefinition(spaces, fieldName, val, allowNull, autoIncrement) {
  if (fieldName === undefined) return '';
  var m = '\n' + spaces + fieldName + ((allowNull === true || autoIncrement) ? '?:' : ':');

  if (val === undefined) {
    m += 'any';
  } else if (val.indexOf('sequelize.BOOLEAN') > -1) {
    m += 'boolean';
  } else if (val.indexOf('sequelize.INTEGER') > -1) {
    m += 'number';
  } else if (val.indexOf('sequelize.BIGINT') > -1) {
    m += 'number';
  } else if (val.indexOf('sequelize.STRING') > -1) {
    m += 'string';
  } else if (val.indexOf('sequelize.CHAR') > -1) {
    m += 'string';
  } else if (val.indexOf('sequelize.REAL') > -1) {
    m += 'number';
  } else if (val.indexOf('sequelize.TEXT') > -1) {
    m += 'string';
  } else if (val.indexOf('sequelize.DATE') > -1) {
    m += 'Date';
  } else if (val.indexOf('sequelize.FLOAT') > -1) {
    m += 'number';
  } else if (val.indexOf('sequelize.DECIMAL') > -1) {
    m += 'number';
  } else if (val.indexOf('sequelize.DOUBLE') > -1) {
    m += 'number';
  } else if (val.indexOf('sequelize.UUIDV4') > -1) {
    m += 'string';
  } else {
    m += 'any';
  }

  return m + ';';
}

exports.def = {
  getDefinitionFileStart,
  getTableDefinition,
  getMemberDefinition,
  getEggDefines
};