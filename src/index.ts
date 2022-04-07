type TargetConstructor = {
  new(...args: any[]): any;
}

// example of class decorator
function Component(name: string) {
  return function (target: TargetConstructor): TargetConstructor {
    return class extends target {
      name = name + 'Component';
    }
  }
}

// example of a method decorator
function runMultiple(times: number) {
  return function(target: Object, properyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = function(...args: any[]) {
      for(let i = 0; i < times; i++) {
        originalMethod.apply(this, args);
      }
    }
  }
}

// example of a property decorator
function Max(limit: number, strict: boolean = false) {  
  return function(target: Object, propertyKey: string) {
    let value : string;
    const getter = function() {
      return value;
    }

    const setter = function(newValue: string) {
      if(newValue.length > limit) {
        if (strict) {
          const errorMessage = `${propertyKey} cannot be more than ${limit} characters`;
          throw new Error(errorMessage);
        }
        return;
      }
      value = newValue;
    }

    Object.defineProperty(target, propertyKey, {
      get: getter,
      set: setter
    })
  }
}

@Component('Greeter')
class Greeter {
  constructor(public greeting: string, public name: string) { }

  @Max(10, true)
  public title: string = '';

  @Max(30)
  public description:string = '';

  @runMultiple(3)
  greet() {
    console.log(`${this.greeting} ${this.name}`);
  }
}

const greeter = new Greeter('Hello', 'John');

greeter.greet();

greeter.title = 'Hello';

greeter.description = 'World';


console.log(greeter);