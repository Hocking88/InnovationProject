// Tests for the text/CSV → features parsers
// Techniques used: Equivalence Partitioning (EP) + Boundary Value Analysis (BVA)

jest.mock('react-router-dom');





import { parseTextToFeatures, parseCsvFirstRow } from '../Upload';

describe("parseTextToFeatures (EP & BVA)", () => {
  const features = ["A", "B", "C"];

  // EP: empty/whitespace → valid 'empty' partition
  test("empty or whitespace returns all zeros", () => {
    expect(parseTextToFeatures("", features)).toEqual({ A: 0, B: 0, C: 0 });
    expect(parseTextToFeatures("   ", features)).toEqual({ A: 0, B: 0, C: 0 });
  });

  // EP: valid JSON partition
  test("valid JSON sets only provided keys", () => {
    const text = JSON.stringify({ A: 5, C: 1 });
    expect(parseTextToFeatures(text, features)).toEqual({ A: 5, B: 0, C: 1 });
  });

  // EP: key=value lines; ignore unknown keys and non-numbers
  test("key=value lines; unknown/NaN values ignored", () => {
    const text = "A=3\nB=foo\nX=9\nC=2";
    expect(parseTextToFeatures(text, features)).toEqual({ A: 3, B: 0, C: 2 });
  });

  // BVA: 0, negative, float values
  test("boundary numeric values are accepted", () => {
    const text = "A=0\nB=-1\nC=0.5";
    expect(parseTextToFeatures(text, features)).toEqual({ A: 0, B: -1, C: 0.5 });
  });
});

  describe("parseCsvFirstRow (EP & BVA)", () => {
  const features = ["A", "B", "C"];

  // EP: normal header + first data row
  test("parses first data row with matching headers", () => {
    const csv = "A,B,C\n1,2,3\n4,5,6";
    expect(parseCsvFirstRow(csv, features)).toEqual({ A: 1, B: 2, C: 3 });
  });

  // BVA: non-numeric cell becomes 0
  test("non-numeric cell becomes 0", () => {
    const csv = "A,B,C\n1,foo,3";
    expect(parseCsvFirstRow(csv, features)).toEqual({ A: 1, B: 0, C: 3 });
  });
});
