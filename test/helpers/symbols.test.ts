import { genSymbol, toValidSymbol } from "../../src/lib/helpers/symbols";

test("Should replace spaces with underscores", () => {
  expect(toValidSymbol("hello world")).toBe("hello_world");
});

test("Should replace multiple repeated spaces with a single underscore", () => {
  expect(toValidSymbol("hello   world")).toBe("hello_world");
});

test("Should convert uppercase to lowercase", () => {
  expect(toValidSymbol("HELLO")).toBe("hello");
});

test("Should uppend underscore to symbols starting with a number", () => {
  expect(toValidSymbol("4two")).toBe("_4two");
});

test("Should crop to 27 characters total", () => {
  const input = "Curabitur facilisis erat at est pharetra";
  expect(toValidSymbol(input)).toBe("curabitur_facilisis_erat_at");
  expect(toValidSymbol(input).length).toBe(27);
});

test("Should return input name if valid and not already in use", () => {
  const input = "actor_0";
  const existing: string[] = [];
  expect(genSymbol(input, existing)).toBe(input);
});

test("Should return input incremented if already exists", () => {
  const input = "actor_0";
  const existing: string[] = ["actor_0"];
  expect(genSymbol(input, existing)).toBe("actor_1");
});

test("Should convert input to valid name before checking for existance", () => {
  const input = "Actor|0";
  const existing: string[] = ["actor_0"];
  expect(genSymbol(input, existing)).toBe("actor_1");
});
