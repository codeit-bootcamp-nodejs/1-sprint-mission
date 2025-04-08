import * as s from "superstruct";

const integerString = s.coerce(s.integer(), s.string(), (value) =>
  parseInt(value)
);

export const IdParamsStruct = s.object({
  id: s.string(),
});

export const PageParamsStruct = s.object({
  page: s.defaulted(integerString, 1),
  pageSize: s.defaulted(integerString, 10),
  order: s.optional(s.enums(["recent"])),
  search: s.optional(
    s.coerce(s.string(), s.string(), (value) => value?.trim().toLowerCase())
  ),
});

export const CursorParamsStruct = s.object({
  cursor: s.defaulted(integerString, 0),
  take: s.defaulted(integerString, 10),
  order: s.optional(s.enums["newest"]),
  search: s.optional(
    s.coerce(s.string(), s.string(), (value) => value.trim().toLowerCase())
  ),
});
