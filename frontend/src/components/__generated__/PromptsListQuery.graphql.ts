/**
 * @generated SignedSource<<6e982c5a529dc3aa1a4e89326eb99c11>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type PromptsListQuery$variables = Record<PropertyKey, never>;
export type PromptsListQuery$data = {
  readonly prompts: ReadonlyArray<{
    readonly content: string;
    readonly id: number;
    readonly title: string;
  }>;
};
export type PromptsListQuery = {
  response: PromptsListQuery$data;
  variables: PromptsListQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "Prompt",
    "kind": "LinkedField",
    "name": "prompts",
    "plural": true,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "title",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "content",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "PromptsListQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "PromptsListQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "12ad96f2f050ecb5bd2c0fdea35354ed",
    "id": null,
    "metadata": {},
    "name": "PromptsListQuery",
    "operationKind": "query",
    "text": "query PromptsListQuery {\n  prompts {\n    id\n    title\n    content\n  }\n}\n"
  }
};
})();

(node as any).hash = "00f52fd8976fe324f784a8afa9a0fe9a";

export default node;
