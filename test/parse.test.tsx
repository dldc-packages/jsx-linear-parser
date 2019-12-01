import { Parser } from '../src';

describe('parse all sort of shape', () => {
  const SHAPES: Array<string> = [
    '<Foo />',
    '<Foo.Bar />',
    '<Foo></Foo>',
    '<Foo>Hey</Foo>',
    '</Bar>',
    '<Foo prop="yes">',
    '<Foo prop={"hello"}>',
    '<Foo prop={{ foo: "bar", hey: 45 }}>',
    '<Foo prop="prop1" other={true} >',
    '<Foo prop="prop1" other={true} >Something else',
  ];

  SHAPES.forEach(str => {
    test(`Parse ${str}`, () => {
      expect(() => Parser.parse(str)).not.toThrow();
    });
  });
});

test('parse object', () => {
  expect(Parser.parse('<Foo prop={{ foo: "bar", hey: 45 }}>')).toEqual({
    component: 'Foo',
    cursor: { column: 36, line: 1 },
    props: [
      {
        cursor: { column: 35, line: 1 },
        name: 'prop',
        type: 'Prop',
        value: { foo: 'bar', hey: 45 },
      },
    ],
    type: 'OpeningTag',
  });
});

test('parse multiple props', () => {
  expect(Parser.parse('<Foo prop="prop1" other={true} >')).toEqual({
    component: 'Foo',
    cursor: { column: 32, line: 1 },
    props: [
      { cursor: { column: 18, line: 1 }, name: 'prop', type: 'Prop', value: 'prop1' },
      { cursor: { column: 31, line: 1 }, name: 'other', type: 'Prop', value: true },
    ],
    type: 'OpeningTag',
  });
});
