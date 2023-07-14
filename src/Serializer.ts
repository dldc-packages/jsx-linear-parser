import { Serializer as LiteralSerializer } from '@dldc/literal-parser';
import type { Node, NodeType } from './Node';

export const Serializer = {
  serialize,
};

const SERIALIZER: { [K in NodeType]: (node: Node<K>) => string } = {
  Text: (node) => node.value,
  ClosingTag: (node) => `</${node.component} ${node.props.map((prop) => serialize(prop)).join(' ')}>`,
  OpeningTag: (node) => `<${node.component} ${node.props.map((prop) => serialize(prop)).join(' ')}>`,
  SelfClosingTag: (node) => `<${node.component} ${node.props.map((prop) => serialize(prop)).join(' ')} />`,
  Prop: (node) =>
    `${node.name}=${
      typeof node.value === 'string' ? `"${node.value}"` : `{${LiteralSerializer.serialize(node.value)}}`
    }`,
};

function serialize(node: Node): string {
  return SERIALIZER[node.type](node as any);
}
