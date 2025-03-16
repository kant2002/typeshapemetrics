import { PathLike, readFileSync, readdirSync, statSync } from "fs";
import * as path from "path";
import * as ts from "typescript";

const statistics = {
    unionTypes: 0,
    singleTypes: 0
}

function reportType(type: ts.TypeNode) {
    if (ts.isUnionTypeNode(type)) {
        statistics.unionTypes++;
    } else {
        statistics.singleTypes++;
    }
}

export function measureTypes(sourceFile: ts.SourceFile) {
    measureTypeNode(sourceFile);

    function measureTypeNode(node: ts.Node) {
        switch (node.kind) {
            case ts.SyntaxKind.SourceFile:
            case ts.SyntaxKind.EndOfFileToken:
            case ts.SyntaxKind.Identifier:
            case ts.SyntaxKind.FirstLiteralToken:
            case ts.SyntaxKind.FunctionDeclaration:
            //case ts.SyntaxKind.MethodSignature:
            case ts.SyntaxKind.VoidKeyword:
            case ts.SyntaxKind.Block:
            case ts.SyntaxKind.TypeLiteral:
            case ts.SyntaxKind.LiteralType:
            case ts.SyntaxKind.NullKeyword:
            case ts.SyntaxKind.UndefinedKeyword:
            case ts.SyntaxKind.NumberKeyword:
            case ts.SyntaxKind.ObjectLiteralExpression:
            case ts.SyntaxKind.ReturnKeyword:
            case ts.SyntaxKind.ReturnStatement:
            case ts.SyntaxKind.StringKeyword:
            case ts.SyntaxKind.StringLiteral:
            case ts.SyntaxKind.TypeReference:
            case ts.SyntaxKind.UnionType:
                break;
            case ts.SyntaxKind.Parameter:
                const parameter = node as ts.ParameterDeclaration;
                if (parameter.type) {
                    reportType(parameter.type)
                }
                break;
            case ts.SyntaxKind.TypeAliasDeclaration:
                const typeAlias = node as ts.TypeAliasDeclaration;
                reportType(typeAlias.type)
                break;
            case ts.SyntaxKind.MethodSignature:
                const methodSignature = node as ts.MethodSignature;
                if (methodSignature.type) {
                    reportType(methodSignature.type)
                }
                break;
            case ts.SyntaxKind.MethodDeclaration:
                const methodDeclaration = node as ts.MethodDeclaration;
                if (methodDeclaration.type) {
                    reportType(methodDeclaration.type)
                }
                break;

            default:
              report(
                node,
                `${ts.SyntaxKind[node.kind]} is not handled in the measureTypes. Please update the code to handle it.`
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
        fileName = path.join(folder.toString(), fileName);
        if (statSync(fileName).isDirectory()) {
            if (fileName.endsWith('node_modules')) {
                return;
            }
            recursiveReaddirSync(fileName);
        } else {
            if (fileName.endsWith('.d.ts')) {
                return;
            }
            if (!fileName.endsWith('.ts')) {
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