const part1 = () => console.log('dir1 part1');
const part2 = () => console.log('dir1 part2');
console.log('dir1 importFile console');

var index$1 = () => {
    console.log('dir2');
    part1();
};

const num = 123;
var index = () => {
    console.log(`dir2 num: ${num}`);
    part2();
};

export { index$1 as Dir1, index as Dir2 };
