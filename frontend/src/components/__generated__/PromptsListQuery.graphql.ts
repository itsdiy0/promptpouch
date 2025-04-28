/**
 * @generated SignedSource<<18b61481437f1687b2f371f7de1faed1>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type PromptsListQuery$variables = Record<PropertyKey, never>;
export type PromptsListQuery$data = {
  readonly getPrompts: ReadonlyArray<{
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
    "concreteType": "PromptType",
    "kind": "LinkedField",
    "name": "getPrompts",
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
    "cacheID": "5db325182af8a65e542bc622b76ac5b0",
    "id": null,
    "metadata": {},
    "name": "PromptsListQuery",
    "operationKind": "query",
    "text": "query PromptsListQuery {\n  getPrompts {\n    id\n    title\n  }\n}\n"
  }
};
})();

(node as any).hash = "8dd4ccd7b41273261ff81959c7f21729";

export default node;
