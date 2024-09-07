# 🔮 Roblox TS reflection
Library that allows you to work with types in runtime!

> [!WARNING]
> This library is in beta, so use it with caution, breaking changes are possible.

# 📦 Installation
To install this package run the following command:

``npm i rbxts-transformer-reflection``

``npm i @rbxts/reflection``

# ⚙ Setup
you need to modify your ``tsconfig.json`` file to enable reflection, modify ``compilerOptions``

```json
{
	"plugins": [
		{
			"transform": "rbxts-transformer-reflection",
			"reflectAllCalls": true,
			"autoRegister": true
		}
	]
}
```

also you can edit transformer settings

| name | description |
| - | - |
| reflectAllCalls | will automatically reflect all function calls with generics |
| autoRegister | will automatically register all types |


# 📚 API
Macros are functions that are replaced by Transformer with values

## Macros
```ts
$reflect<C>()  // will register C interface
```

```ts
$indefine<C>()  // will return unique type id
```

## How to Get the Type

Use function GetType<TType>(): Type imported from module @rbxts/reflection.
```ts
import { GetType } from "@rbxts/reflection";

interface IFoo {}
class Foo implements IFoo {}

getType<IFoo>();
getType<Foo>();
getType(Foo);

const foo = new Foo();
getType<typeof foo>();
getType(foo);
```

> [!WARNING]
> Reflection system does not support union and intersection types.

## Base usage

```ts
import { GetType, Type } from "@rbxts/reflection";

interface IAnimal
{
    name: string;
}

class Animal implements IAnimal
{
    constructor(public name: string)
    {
    }
}

const typeOfIAnimal: Type = getType<IAnimal>();
const typeOfAnimal: Type = getType<Animal>();
```

## Get Type of Generic Type Parameter (runtime)
```ts
import { GetType } from "@rbxts/reflection";

function printTypeProperties<TType>() 
{
    const type = GetType<TType>(); // <<== get type of type parameter TType
    
    print(type.Name)
}

interface SomeType {
    foo: string;
    bar: number;
    baz: Date;
}

printTypeProperties<SomeType>();
```

## Receipt of all types

```ts
/* Returns all types declared in the current project */
GetTypes(CurrentAssembly).forEach((_type) => {
	print(_type.Name);
});

/* Returns all declared types */
GetAllAssemblies().forEach((assembly) => {
	GetTypes(assembly).forEach((_type) => {
		print(_type.Name);
	});
});
```

## Attributes

The library provides a system of attributes. This system is very similar from the c# language

```ts
const MyAttribute = CreateAttribute(
	class {
		constructor(public param1: number) {}
	},
);

@MyAttribute(1)
class MyClass {
	@MyAttribute(2)
	private field!: number;

	constructor(@MyAttribute(1) data: string) {}
}

GetTypes(CurrentAssembly).forEach((_type) => {
	if (_type.HaveAttribute<typeof MyAttribute>()) {
		const attribute = _type.GetAttribute<typeof MyAttribute>()!;

		print(_type.Name, attribute.param1);
	}
});
```

## Types

```ts
/**
 * Object representing TypeScript type in memory
 */
export declare class Type {
	readonly Name: string;
	readonly FullName: string;
	readonly Assembly: string;
	readonly BaseType?: Type;
	readonly Value?: unknown;
	readonly Constructor?: ConstructorInfo;
	readonly Interfaces: ReadonlyArray<Type>;
	readonly Properties: ReadonlyArray<Property>;
	readonly Methods: ReadonlyArray<Method>;
	readonly Kind: TypeKind;

	IsInterface(): boolean;

	IsClass(): boolean;

	IsObject(): boolean;

	IsTypeParameter(): boolean;

	IsEnum(): boolean;

	IsPrimitive(): boolean;

	GetProperty(name: string): Property | undefined;

	GetMethod(name: string): Method | undefined;
}

export enum TypeKind {
	Unknown = 0,
	Primitive = 1,
	Interface = 2,
	Class = 3,
	Object = 4,
	TypeParameter = 5,
	Enum = 6,
}

export enum AccessModifier {
	Private = 0,
	Protected = 1,
	Public = 2,
}

export declare class Method {
	readonly Name: string;
	readonly ReturnType: Type;
	readonly Parameters: Parameter[];
	readonly AccessModifier: AccessModifier;
	readonly IsStatic: boolean;
	readonly IsAbstract: boolean;
	readonly Callback?: (context: unknown, ...args: unknown[]) => unknown;
}

export declare class Parameter extends Attribute {
	readonly Name: string;
	readonly Type: Type;
	readonly Optional: boolean;
}

export declare class Property {
	readonly Name: string;
	readonly Type: Type;
	readonly Optional: boolean;
	readonly AccessModifier: AccessModifier;
	readonly Readonly: boolean;
}

export declare class ConstructorInfo {
	readonly Parameters: Parameter[];
	readonly AccessModifier: AccessModifier;
	readonly Callback?: (...args: unknown[]) => unknown;
}

export type Constructor<T = object> = new (...args: never[]) => T;

export interface AttributeMarker<T extends Constructor> {
	(...params: ConstructorParameters<T>): (...args: any[]) => any;
	readonly __special: "AttributeMarker";
	readonly __instance: InstanceType<T>;
}

export class Attribute {
	public static Is<T extends AttributeMarker<any>>(attributeData: unknown): attributeData is T["__instance"];

	public GetAttributes(): object[];

	public GetAttribute<T extends AttributeMarker<any>>(inherit?: boolean): T["__instance"] | undefined;

	public HaveAttribute<T extends AttributeMarker<any>>(inherit?: boolean): boolean;
}
```

# 🏷 Tags

> [!NOTE]  
> The tags will be redesigned in future versions.

## Reflect all calls in file

Allows you to enable reflect system for the entire file if automatic system has been disabled in ``tsconfig.json``.
```ts
/** @globalReflect  */

myReflectableFunction<A>()
myReflectableFunction<B>()
```

## Don't reflect calls for file

Allows you to disable the reflective system for the entire file.

```ts
/** @nonReflect */
myReflectableFunction<A>()  // will not reflect
```

## Don't register types for entire file
Allows you to disable type registration, in the current file.
```ts
/** @nonRegister */

// this interface will not be registered in reflection
interface C {
	i: number;
}
```

## Enable reflection for one function
Enables reflection system for a specific function.
```ts
/** @reflect */
function reflectMe<T>(a: T): T {
	...
}
```