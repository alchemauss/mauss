import { json } from '@sveltejs/kit';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
import { exports } from '$ws/mauss/package.json';

export const prerender = true;

export interface Schema {
	[modules: string]: Array<{
		name: string;
		docs: string;
		signature: string;
	}>;
}

export async function GET() {
	const program = ts.createProgram(
		Object.keys(exports).flatMap((m) => {
			if (m.slice(2).includes('.')) return [];
			return `../mauss/src/${m.slice(2) || 'core'}/index.ts`;
		}),
		{},
	);

	const schema: Schema = {};
	for (const exp in exports) {
		if (exp.slice(2).includes('.')) continue;
		const module = exp.slice(2) || 'core';
		const source = program.getSourceFile(`../mauss/src/${module}/index.ts`);
		if (!source) continue;

		const typechecker = program.getTypeChecker();
		schema[module] = [];

		ts.forEachChild(source, (node) => {
			if (ts.isExportDeclaration(node)) {
				// Handle re-exported symbols
				const symbols = typechecker.getExportsOfModule(
					typechecker.getSymbolAtLocation(node.moduleSpecifier),
				);
				symbols.forEach((symbol) => {
					const decl = symbol.valueDeclaration || symbol.declarations[0];
					if (ts.isFunctionDeclaration(decl)) {
						const name = symbol.getName();
						const docs = ts
							.getJSDocCommentsAndTags(decl)
							.map((doc) => doc.getText())
							.join('\n');
						const signature = decl.getText();
						schema[module].push({ name, docs, signature });
					}
				});
			} else if (
				ts.isFunctionDeclaration(node) &&
				node.modifiers?.some((mod) => mod.kind === ts.SyntaxKind.ExportKeyword)
			) {
				const docs = ts
					.getJSDocCommentsAndTags(node)
					.map((doc) => doc.getText())
					.join('\n');
				const signature = node.getText();
				schema[module].push({
					name: node.name?.text,
					docs,
					signature,
				});
			}
		});
	}

	return json(schema);
}
