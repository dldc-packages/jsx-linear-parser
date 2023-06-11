import { describe, expect, test } from 'vitest';
import { Parser } from '../src/mod';

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

  SHAPES.forEach((str) => {
    test(`Parse ${str}`, () => {
      expect(() => Parser.parse(str)).not.toThrow();
    });
  });
});

test('parse object', () => {
  expect(Parser.parse('<Foo prop={{ foo: "bar", hey: 45 }}>')).toEqual([
    {
      type: 'OpeningTag',
      position: {
        start: { column: 0, line: 1, offset: 0 },
        end: { column: 36, line: 1, offset: 36 },
      },
      component: 'Foo',
      props: [
        {
          type: 'Prop',
          position: {
            start: { column: 5, line: 1, offset: 5 },
            end: { column: 35, line: 1, offset: 35 },
          },
          name: 'prop',
          value: { foo: 'bar', hey: 45 },
        },
      ],
    },
  ]);
});

test('parse multiple props', () => {
  expect(Parser.parse('<Foo prop="prop1" other={true} >')).toEqual([
    {
      type: 'OpeningTag',
      component: 'Foo',
      position: {
        end: { column: 32, line: 1, offset: 32 },
        start: { column: 0, line: 1, offset: 0 },
      },
      props: [
        {
          type: 'Prop',
          position: {
            end: { column: 18, line: 1, offset: 18 },
            start: { column: 5, line: 1, offset: 5 },
          },
          name: 'prop',
          value: 'prop1',
        },
        {
          type: 'Prop',
          position: {
            end: { column: 31, line: 1, offset: 31 },
            start: { column: 18, line: 1, offset: 18 },
          },
          name: 'other',
          value: true,
        },
      ],
    },
  ]);
});

test('parse object', () => {
  expect(Parser.parse('<Foo prop={{ foo: "bar", hey: 45 }}>')).toEqual([
    {
      type: 'OpeningTag',
      position: {
        start: { column: 0, line: 1, offset: 0 },
        end: { column: 36, line: 1, offset: 36 },
      },
      component: 'Foo',
      props: [
        {
          type: 'Prop',
          position: {
            start: { column: 5, line: 1, offset: 5 },
            end: { column: 35, line: 1, offset: 35 },
          },
          name: 'prop',
          value: { foo: 'bar', hey: 45 },
        },
      ],
    },
  ]);
});

test('parse items', () => {
  expect(Parser.parse('<Foo><Foo></Foo>').length).toEqual(3);
});

test('parse text', () => {
  expect(Parser.parse('some text').length).toEqual(1);
});

test('parse text', () => {
  expect(Parser.parse('some < text').length).toEqual(1);
});

test('parse text', () => {
  expect(Parser.parse('some <NotComponent text').length).toEqual(1);
});

test('parse text then component', () => {
  expect(Parser.parse('some <Component text={true}>').length).toEqual(2);
});

test('parse text then component', () => {
  expect(Parser.parse('some <Component text={true}>')).toEqual([
    {
      type: 'Text',
      position: {
        end: { column: 5, line: 1, offset: 5 },
        start: { column: 0, line: 1, offset: 0 },
      },
      value: 'some ',
    },
    {
      type: 'OpeningTag',
      position: {
        end: { column: 28, line: 1, offset: 28 },
        start: { column: 5, line: 1, offset: 5 },
      },
      component: 'Component',
      props: [
        {
          name: 'text',
          position: {
            end: { column: 27, line: 1, offset: 27 },
            start: { column: 16, line: 1, offset: 16 },
          },
          type: 'Prop',
          value: true,
        },
      ],
    },
  ]);
});
