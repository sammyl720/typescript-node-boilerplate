enum FurColors {
  BROWN = 'brown', // '#a87741',
  WHITE = 'white', //'#bbacb2',
  BLACK = 'black', //'#12253d',
  GRAY =  'gray', //'#545256',
  ORANGE = 'orange' //'#96471c'
}
interface Cat {
  kind: 'cat',
  furColor: FurColors;
  name: string;
}

interface Dog {
  kind: 'dog',
  name: string;
  isFriendly: boolean;
}

type Animal<T> = T extends { kind: string} ? Omit<T, 'kind'> : never;

type CatOrDog = Cat | Dog;

function isCat(animal: CatOrDog): animal is Cat {
  return animal.kind == 'cat';
}

function isDog(animal: CatOrDog): animal is Dog {
  return animal.kind == 'dog';
}

type SimpleDog = Animal<Dog>;

const goodDog: SimpleDog = {
  isFriendly: true,
  name: 'Mr Kibbles'
}

const brownCat:Animal<Cat> = {
  furColor: FurColors.BROWN,
  name: 'Fluffy'
}

interface ColoredCat<T extends FurColors, P extends Animal<Cat>> {
  furColor: T;
  name: string;
}

function generateCat(color: FurColors, name: string):Animal<Cat> {
  return {
    furColor: color,
    name
  } as ColoredCat<typeof color, Animal<Cat>>;
}

const orangeCat = generateCat(FurColors.ORANGE, 'Garfield')

const blackCat: CatOrDog = {
  kind: 'cat',
  name: 'Pete',
  furColor: FurColors.BLACK
}

const anotherGoodDog: CatOrDog = {
  kind: 'dog',
  name: 'Rufles',
  isFriendly: true
}

function getAnimalInfo(animal:CatOrDog): string {
  if(isCat(animal)) {
    return `${animal.name} is a ${animal.furColor} cat.`;
  }
  return `${animal.name} is a ${animal.isFriendly ? 'good' : 'bad'} dog.`
}

console.log(getAnimalInfo(blackCat));
console.log(getAnimalInfo(anotherGoodDog));

enum ANSIColorCodes {
  RESET,
  BLACK = 30,
  RED,
  GREEN,
  YELLOW,
  BLUE,
  MAGENTA,
  CYAN,
  WHITE
}

function ColorOutput(color?: ANSIColorCodes) {
  return function(target: Object, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = function(...args: any[]) {
      const value = color ? color : hasColor(this) ? this.color : ANSIColorCodes.WHITE;
      const message = originalMethod.apply(this, args);
      console.log(`\x1b[${value}m${message}\x1b[${ANSIColorCodes.RESET}m`);
      return message;
    }
  }
}


function hasColor(object: any): object is { color: ANSIColorCodes } {
  return object?.color &&
  typeof object.color === 'number'
  && Object.values(ANSIColorCodes).filter(value => typeof value === 'number').includes(object.color);
}

type ClassConstructor<T> = {
  new (...args: any[]): T
}
function ColoredLogger(color: ANSIColorCodes) {
  return function (target: ClassConstructor<any>): any {
    return class extends target {
      color = color;
    }
  }
}

@ColoredLogger(ANSIColorCodes.BLUE)
class Logger {

  @ColorOutput(ANSIColorCodes.MAGENTA)
  magentaLog(message: string) {
    return message;;
  }

  @ColorOutput(ANSIColorCodes.YELLOW)
  yellowLog(message: string) {
    return message;
  }

  @ColorOutput(ANSIColorCodes.YELLOW)
  greenLog(message: string) {
    return message;
  }

  @ColorOutput(ANSIColorCodes.BLUE)
  blueLog(message: string) {
    return message;
  }

  @ColorOutput(ANSIColorCodes.RED)
  redLog(message: string) {
    return message;
  } 

  @ColorOutput()
  log(message: string) {
    return message;;
  }
}

const logger = new Logger();

logger.redLog('Red Light...')
logger.greenLog('Green Light...')
logger.log("One, Two, Three...");