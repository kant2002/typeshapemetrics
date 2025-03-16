import { PathLike, readFileSync, readdirSync, statSync } from "fs";
import * as path from "path";
import * as ts from "typescript";

const statistics = {
    unionTypes: 0,
    intersectionTypes: 0,
    tupleTypes: 0,
    singleTypes: 0,
    anyTypes: 0,
    thisType: 0,
    restType: 0,
    inferredType: 0
}

function reportType(type?: ts.TypeNode) {
    if (!type) {
        statistics.inferredType++;
        return;
    }

    if (ts.isUnionTypeNode(type)) {
        statistics.unionTypes++;
    } else if (ts.isIntersectionTypeNode(type)) {
        statistics.intersectionTypes++;
    } else if (ts.isTupleTypeNode(type)) {
        statistics.tupleTypes++;
    } else if (ts.isThisTypeNode(type)) {
        statistics.thisType++;
    } else if (ts.isRestTypeNode(type)) {
        statistics.restType++;
    } else if (type.getText() === 'any') {
        statistics.anyTypes++;
    } else {
        statistics.singleTypes++;
    }
}

export function measureTypes(sourceFile: ts.SourceFile) {
    measureTypeNode(sourceFile);

    function measureTypeNode(node: ts.Node) {
        if (ts.isToken(node)) {
            return
        }
        
        if (ts.isStatement(node)) {
            ts.forEachChild(node, measureTypeNode);
            return
        }
        
        switch (node.kind) {
            case ts.SyntaxKind.AssertClause:
            case ts.SyntaxKind.AssertEntry:
            case ts.SyntaxKind.ArrowFunction:
            case ts.SyntaxKind.AwaitExpression:
            case ts.SyntaxKind.ArrayLiteralExpression:
            case ts.SyntaxKind.ArrayBindingPattern:
            case ts.SyntaxKind.Block:
            case ts.SyntaxKind.BindingElement:
            case ts.SyntaxKind.BinaryExpression:
            case ts.SyntaxKind.CallExpression:
            case ts.SyntaxKind.ConditionalType:
            case ts.SyntaxKind.CaseClause:
            case ts.SyntaxKind.CatchClause:
            case ts.SyntaxKind.ComputedPropertyName:
            case ts.SyntaxKind.CaseBlock:
            case ts.SyntaxKind.ClassExpression:
            case ts.SyntaxKind.ConditionalExpression:
            case ts.SyntaxKind.Constructor:
            case ts.SyntaxKind.Decorator:
            case ts.SyntaxKind.DefaultClause:
            case ts.SyntaxKind.DeleteExpression:
            case ts.SyntaxKind.ExpressionStatement:
            case ts.SyntaxKind.ExportSpecifier:
            case ts.SyntaxKind.EnumMember:
            case ts.SyntaxKind.ExternalModuleReference:
            case ts.SyntaxKind.ElementAccessExpression:
            case ts.SyntaxKind.ExpressionWithTypeArguments:
            case ts.SyntaxKind.FirstNode:
            case ts.SyntaxKind.FirstTypeNode:
            case ts.SyntaxKind.FunctionDeclaration:
            case ts.SyntaxKind.FunctionExpression:
            case ts.SyntaxKind.Identifier:
            case ts.SyntaxKind.IntersectionType:
            case ts.SyntaxKind.IndexedAccessType:
            case ts.SyntaxKind.ImportClause:
            case ts.SyntaxKind.ImportSpecifier:
            case ts.SyntaxKind.InferType:
            case ts.SyntaxKind.HeritageClause:
            case ts.SyntaxKind.GetAccessor:
            //case ts.SyntaxKind.MethodSignature:
            case ts.SyntaxKind.LiteralType:
            case ts.SyntaxKind.MappedType:
            case ts.SyntaxKind.MetaProperty:
            case ts.SyntaxKind.ModuleBlock:
            case ts.SyntaxKind.NamedImports:
            case ts.SyntaxKind.NamedExports:
            case ts.SyntaxKind.NamespaceImport:
            case ts.SyntaxKind.NamespaceExport:
            case ts.SyntaxKind.NamedTupleMember:
            case ts.SyntaxKind.NamespaceExportDeclaration:
            case ts.SyntaxKind.NewExpression:
            case ts.SyntaxKind.NonNullExpression:
            case ts.SyntaxKind.ObjectLiteralExpression:
            case ts.SyntaxKind.ObjectBindingPattern:
            case ts.SyntaxKind.OptionalType:
            case ts.SyntaxKind.OmittedExpression:
            case ts.SyntaxKind.ParenthesizedType:
            case ts.SyntaxKind.PropertyAssignment:
            case ts.SyntaxKind.PropertyAccessExpression:
            case ts.SyntaxKind.PrefixUnaryExpression:
            case ts.SyntaxKind.PostfixUnaryExpression:
            case ts.SyntaxKind.ParenthesizedExpression:
            case ts.SyntaxKind.ParenthesizedType:
            case ts.SyntaxKind.ReturnStatement:
            case ts.SyntaxKind.RestType:
            case ts.SyntaxKind.SatisfiesExpression:
            case ts.SyntaxKind.SetAccessor:
            case ts.SyntaxKind.SourceFile:
            case ts.SyntaxKind.ShorthandPropertyAssignment:
            case ts.SyntaxKind.SpreadElement:
            case ts.SyntaxKind.SpreadAssignment:
            case ts.SyntaxKind.StringLiteral:
            case ts.SyntaxKind.TypeLiteral:
            case ts.SyntaxKind.TypeOfExpression:
            case ts.SyntaxKind.TypeQuery:
            case ts.SyntaxKind.TupleType:
            case ts.SyntaxKind.ThisType:
            case ts.SyntaxKind.TypeParameter:
            case ts.SyntaxKind.TypeAssertionExpression:
            case ts.SyntaxKind.TypeOperator:
            case ts.SyntaxKind.TemplateSpan:
            case ts.SyntaxKind.TemplateExpression:
            case ts.SyntaxKind.TemplateLiteralType:
            case ts.SyntaxKind.TemplateLiteralTypeSpan:
            case ts.SyntaxKind.TaggedTemplateExpression:
            case ts.SyntaxKind.TypeReference:
            case ts.SyntaxKind.UnionType:
            case ts.SyntaxKind.VoidExpression:
            case ts.SyntaxKind.VariableDeclarationList:
            case ts.SyntaxKind.YieldExpression:
            // Tokens
            // Keywords
            case ts.SyntaxKind.AsyncKeyword:
            case ts.SyntaxKind.AssertKeyword:
            case ts.SyntaxKind.AssertsKeyword:
            case ts.SyntaxKind.FalseKeyword:
            case ts.SyntaxKind.NullKeyword:
            case ts.SyntaxKind.NumberKeyword:
            case ts.SyntaxKind.StringKeyword:
            case ts.SyntaxKind.ReturnKeyword:
            case ts.SyntaxKind.TrueKeyword:
            case ts.SyntaxKind.UndefinedKeyword:
            case ts.SyntaxKind.VoidKeyword:
                break;
            case ts.SyntaxKind.AsExpression:
                const asExpression = node as ts.AsExpression;
                if (asExpression.type) {
                    reportType(asExpression.type)
                }
                break;
            case ts.SyntaxKind.Parameter:
                const parameter = node as ts.ParameterDeclaration;
                reportType(parameter.type)
                break;
            case ts.SyntaxKind.TypeAliasDeclaration:
                const typeAlias = node as ts.TypeAliasDeclaration;
                reportType(typeAlias.type)
                break;
            case ts.SyntaxKind.MethodSignature:
                const methodSignature = node as ts.MethodSignature;
                reportType(methodSignature.type)
                break;
            case ts.SyntaxKind.MethodDeclaration:
                const methodDeclaration = node as ts.MethodDeclaration;
                reportType(methodDeclaration.type)
                break;
            case ts.SyntaxKind.PropertyDeclaration:
                const propertyDeclaration = node as ts.PropertyDeclaration;                
                reportType(propertyDeclaration.type)
                break;
            case ts.SyntaxKind.PropertySignature:
                const propertySignature = node as ts.PropertySignature;
                reportType(propertySignature.type)
                break;
            case ts.SyntaxKind.VariableDeclaration:
                const variableDeclaration = node as ts.VariableDeclaration;
                reportType(variableDeclaration.type)
                break;
            case ts.SyntaxKind.FunctionType:
                const functionType = node as ts.FunctionTypeNode;
                reportType(functionType.type)
                break;
            case ts.SyntaxKind.ConstructorType:
                const constructorType = node as ts.ConstructorTypeNode;
                reportType(constructorType.type)
                break;
            case ts.SyntaxKind.ConstructSignature:
                const constructSignature = node as ts.ConstructSignatureDeclaration;
                reportType(constructSignature.type)
                break;
            case ts.SyntaxKind.ArrayType:
                const arrayType = node as ts.ArrayTypeNode;
                reportType(arrayType.elementType)
                break;
            case ts.SyntaxKind.CallSignature:
                const callSignature = node as ts.CallSignatureDeclaration;
                reportType(callSignature.type)
                break;
            case ts.SyntaxKind.IndexSignature:
                const indexSignature = node as ts.IndexSignatureDeclaration;
                reportType(indexSignature.type)
                break;

            default:
              report(
                node,
                `${ts.SyntaxKind[node.kind]} ${node.getText()} is not handled in the measureTypes. Please update the code to handle it.`
              );
        }

        ts.forEachChild(node, measureTypeNode);
    }

    function report(node: ts.Node, message: string) {
        const { line, character } = sourceFile.getLineAndCharacterOfPosition(node.getStart());
        console.log(`${sourceFile.fileName} (${line + 1},${character + 1}): ${message}`);
    }
}

if (process.argv.length < 3) {
    console.log('Usage: node index.js folder');
    process.exit(1);
}

function recursiveReaddirSync(folder: PathLike) {
    readdirSync(folder).forEach(fileName => {
        const originalFileName = fileName;
        fileName = path.join(folder.toString(), fileName);
        if (statSync(fileName).isDirectory()) {
            if (fileName.endsWith('node_modules')) {
                return;
            }
            if (originalFileName === '.git') {
                return;
            }
            recursiveReaddirSync(fileName);
        } else {
            if (fileName.endsWith('.d.ts')) {
                return;
            }
            if (!fileName.endsWith('.ts') && !fileName.endsWith('.tsx')) {
                return;
            }

            // Parse a file
            const sourceFile = ts.createSourceFile(
                fileName,
                readFileSync(fileName).toString(),
                ts.ScriptTarget.ES2015,
                /*setParentNodes */ true
            );
          
            // delint it
            measureTypes(sourceFile);
        }
    });
}

const folder = process.argv[2];
recursiveReaddirSync(folder)
console.log(statistics)