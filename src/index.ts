import { $reflect } from "@rbxts/reflection-runtime";
export * from "@rbxts/reflection-runtime";

type RobloxTypes = Omit<CheckableTypes, keyof CheckablePrimitives>;
type Primitives = Omit<CheckablePrimitives, "nil" | "userdata">;

$reflect<RobloxTypes[keyof RobloxTypes] | Primitives[keyof Primitives]>();
