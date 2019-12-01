import { Cursor } from './InputStream';

export interface Nodes {
  OpeningTag: { component: string; props: Props };
  ClosingTag: { component: string; props: Props };
  SelfClosingTag: { component: string; props: Props };
  Prop: {
    name: string;
    value: any;
  };
}

export type NodeType = keyof Nodes;

type NodeCommon = {
  cursor: Cursor;
};

export type Node<K extends NodeType = NodeType> = {
  [K in NodeType]: Nodes[K] & { type: K } & NodeCommon;
}[K];

const NODES_OBJ: { [K in NodeType]: null } = {
  ClosingTag: null,
  OpeningTag: null,
  SelfClosingTag: null,
  Prop: null,
};

const NODES = Object.keys(NODES_OBJ) as Array<NodeType>;

export const NodeIs: {
  [K in NodeType]: (node: Node) => node is Node<K>;
} = NODES.reduce<any>((acc, key) => {
  acc[key] = (node: Node) => node.type === key;
  return acc;
}, {});

// Alias
export type Tag = Node<'ClosingTag' | 'OpeningTag' | 'SelfClosingTag'>;
export type Prop = Node<'Prop'>;
export type Props = Array<Prop>;
